import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  LessThan,
  MoreThan,
} from 'typeorm';
import { Game } from './games.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Field } from 'src/fields/fields.entity';
import { User } from 'src/users/users.entity';
import { GameStatus } from 'src/enums/game-status.enum';
import { QueryGameDto } from './dto/query-game.dto';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { WeatherApiService } from 'src/weather-api/weather-api.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,

    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,

    @InjectRepository(GameParticipant)
    private gameParticipantRepository: Repository<GameParticipant>,
    private readonly weatherApiService: WeatherApiService,
  ) {}

  async findAllMine(user: User): Promise<Game[]> {
    const participations = await this.gameParticipantRepository.find({
      where: { user: { uid: user.uid } },
      relations: [
        'game',
        'game.field',
        'game.creator',
        'game.gameParticipants',
        'game.gameParticipants.user',
      ],
    });
    return participations.map((participation) => participation.game);
  }

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find();
  }

  async findById(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { gameId } });
    if (!game) {
      throw new NotFoundException(`game with id ${gameId} not found`);
    }
    return game;
  }

  async findByFieldId(fieldId: string): Promise<Game[]> {
    const game = await this.gameRepository.find({
      relations: ['field'],
      where: {
        field: {
          fieldId,
        },
      },
    });
    if (!game) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }
    return game;
  }

  async deleteOne(gameId: string): Promise<void> {
    const results = await this.gameRepository.delete(gameId);
    if (results.affected === 0) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
  }

  async create(createGameDto: CreateGameDto, user: User): Promise<Game> {
    const { gameType, startDate, endDate, maxParticipants, field } =
      createGameDto;

    // Check if the field exists
    const fieldd = await this.fieldRepository.findOne({
      where: { fieldId: field },
    });
    if (!fieldd) {
      throw new NotFoundException(`field with id ${field} not found`);
    }

    //Add weather data to game
    const parsedStartDate = new Date(startDate);
    const dt = parsedStartDate.toISOString().split('T')[0];
    const hour = parseInt(
      parsedStartDate.toISOString().split('T')[1].split(':')[0],
    );
    const lat = fieldd.fieldLat ? fieldd.fieldLat : 0;
    const lon = fieldd.fieldLng ? fieldd.fieldLng : 0;
    const getWeatherDto = {
      lat,
      lon,
      dt,
      hour,
    };
    const weatherData = await this.weatherApiService.getWeather(getWeatherDto);

    const game = this.gameRepository.create({
      gameType,
      startDate,
      endDate,
      maxParticipants,
      creator: user,
      field: fieldd,
      status: GameStatus.AVAILABLE,
      gameParticipants: [],
      weatherTemp: parseInt(weatherData.temp_c),
      weatherCondition: weatherData.condition.text,
      weatherIcon: weatherData.condition.icon,
    });

    //create game participant for the creator
    const creatorParticipation = this.gameParticipantRepository.create({
      game: game,
      user: user,
      status: ParticipationStatus.APPROVED,
    });
    const savedGame = await this.gameRepository.save(game);
    creatorParticipation.game = savedGame;
    await this.gameParticipantRepository.save(creatorParticipation);

    return this.findById(savedGame.gameId);
  }

  async inviteFriendToGame(gameId: string, inviter: User, invited: User) {
    let status = ParticipationStatus.PENDING;
    const game = await this.gameRepository.findOne({
      where: { gameId },
      relations: ['gameParticipants'],
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }

    if (inviter.uid === game.creator.uid) {
      status = ParticipationStatus.APPROVED;
    }
    const newParticipation = this.gameParticipantRepository.create({
      game,
      user: invited,
      status,
    });

    return await this.gameParticipantRepository.save(newParticipation);
  }

  async joinGame(
    gameId: string,
    user: User,
    status: ParticipationStatus,
  ): Promise<GameParticipant> {
    const game = await this.gameRepository.findOne({
      where: { gameId },
      relations: ['gameParticipants'],
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }

    if (game.gameParticipants.length >= game.maxParticipants) {
      throw new BadRequestException('Game is already full');
    }

    const existingParticipation = await this.gameParticipantRepository.findOne({
      where: {
        game: { gameId: gameId },
        user: { uid: user.uid },
      },
    });

    if (existingParticipation) {
      throw new ConflictException('User is already participating in this game');
    }

    const newParticipation = this.gameParticipantRepository.create({
      game: game,
      user: user,
      status,
    });

    return await this.gameParticipantRepository.save(newParticipation);
  }

  async leaveGame(gameId: string, user: User): Promise<void> {
    const game = await this.gameRepository.findOne({
      where: { gameId },
      relations: ['gameParticipants'],
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }

    const existingParticipation = await this.gameParticipantRepository.findOne({
      where: {
        game: { gameId: gameId },
        user: { uid: user.uid },
      },
    });

    if (!existingParticipation) {
      throw new ConflictException('המשתמש אינו משתתף במשחק הזה');
    }

    if (game.creator.uid === user.uid) {
      throw new ConflictException('המנהל אינו יכול לעזוב את המשחק');
    }

    await this.gameParticipantRepository.delete(existingParticipation.id);
  }

  async queryGames(queryDto: QueryGameDto): Promise<Game[]> {
    const { gameType, startDate, endDate, city } = queryDto;
    const query = this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.field', 'field')
      .leftJoinAndSelect('game.creator', 'creator')
      .leftJoinAndSelect('game.gameParticipants', 'gameParticipant')
      .leftJoinAndSelect('gameParticipant.user', 'participantUser');

    if (gameType) {
      query.andWhere('game.gameType = :gameType', { gameType });
    }

    if (startDate) {
      query.andWhere('game.startDate >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('game.endDate <= :endDate', { endDate });
    }

    if (city) {
      query.andWhere('field.city = :city', { city });
    }

    return await query.getMany();
  }

  async findGamesByFieldAndDate(
    fieldId: string,
    dateString: string,
  ): Promise<Game[]> {
    const date = new Date(dateString);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Find games that overlap with the given day
    const games = await this.gameRepository.find({
      where: {
        field: { fieldId },
        // Game starts before the day ends AND game ends after the day starts
        startDate: LessThan(dayEnd),
        endDate: MoreThan(dayStart),
      },
      order: {
        startDate: 'ASC',
      },
    });

    return games;
  }

  async calculateAvailableSlots(
    fieldId: string,
    dateString: string,
    timezone: number,
  ): Promise<string[]> {
    const games = await this.findGamesByFieldAndDate(fieldId, dateString);
    const availableHalfHours: string[] = [];

    const targetDate = new Date(dateString);
    const dayStart = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    dayStart.setHours(dayStart.getHours() - timezone);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayStart.getUTCDate() + 1);
    // Iterate through each half-hour slot of the day
    let currentSlotStart = new Date(dayStart);
    while (currentSlotStart < dayEnd) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setUTCMinutes(currentSlotStart.getUTCMinutes() + 30);

      let isSlotAvailable = true;

      // Check for overlap with any game
      for (const game of games) {
        const gameStart = new Date(game.startDate);
        const gameEnd = new Date(game.endDate);

        // Overlap condition: (SlotStart < GameEnd) and (SlotEnd > GameStart)
        if (currentSlotStart < gameEnd && currentSlotEnd > gameStart) {
          isSlotAvailable = false;
          break; // No need to check other games for this slot
        }
      }
      // If the slot is completely free, add its start time
      currentSlotStart.setUTCHours(currentSlotStart.getUTCHours() - -timezone);
      if (isSlotAvailable) {
        const hours = currentSlotStart
          .getUTCHours()
          .toString()
          .padStart(2, '0');
        const minutes = currentSlotStart
          .getUTCMinutes()
          .toString()
          .padStart(2, '0');
        availableHalfHours.push(`${hours}:${minutes}`);
      }

      // Move to the next half-hour slot
      currentSlotStart = currentSlotEnd;
    }

    return availableHalfHours;
  }
}
