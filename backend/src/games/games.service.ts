import {
  ConflictException,
  Injectable,
  NotFoundException,
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
import { User } from 'src/users/users.entity';
import { GameStatus } from 'src/enums/game-status.enum';
import { QueryGameDto } from './dto/query-game.dto';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { WeatherApiService } from 'src/weather-api/weather-api.service';
import { GameParticipantsService } from 'src/game-participants/game-participants.service';
import { FieldsService } from 'src/fields/fields.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private readonly fieldService: FieldsService,
    private readonly gameParticipantService: GameParticipantsService,
    private readonly weatherApiService: WeatherApiService,
    private readonly mailService: MailService,
  ) {}

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find({
      where: { status: GameStatus.APPROVED },
    });
  }

  async findById(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { gameId, status: GameStatus.APPROVED },
    });
    if (!game) {
      throw new NotFoundException(`game with id ${gameId} not found`);
    }
    return game;
  }

  async deleteOne(gameId: string): Promise<void> {
    const results = await this.gameRepository.delete(gameId);
    if (results.affected === 0) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Todo: change to create as pending or approved depending if field is private
  async create(createGameDto: CreateGameDto, user: User): Promise<Game> {
    const { gameType, startDate, endDate, maxParticipants, field } =
      createGameDto;

    // Check if the field exists and pull entity
    const fieldd = await this.fieldService.findById(field);

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

    const status: GameStatus = fieldd.isManaged
      ? GameStatus.PENDING
      : GameStatus.APPROVED;

    const game = this.gameRepository.create({
      gameType,
      startDate,
      endDate,
      maxParticipants,
      creator: user,
      field: fieldd,
      status: status,
      gameParticipants: [],
      weatherTemp: parseInt(weatherData.temp_c),
      weatherCondition: weatherData.condition.text,
      weatherIcon: weatherData.condition.icon,
    });

    const savedGame = await this.gameRepository.save(game);
    //create game participant for the creator
    await this.gameParticipantService.joinGame(
      savedGame.gameId,
      user,
      ParticipationStatus.APPROVED,
    );

    return savedGame;
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
    const newParticipation = await this.gameParticipantService.joinGame(
      game.gameId,
      invited,
      status,
    );

    return newParticipation;
  }

  ///////////////////////////////////////////////
  /// if used to show the free games slots, need to return pending too
  async queryGames(queryDto: QueryGameDto): Promise<Game[]> {
    const { gameType, startDate, endDate, city } = queryDto;
    const query = this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.field', 'field')
      .leftJoinAndSelect('game.creator', 'creator')
      .leftJoinAndSelect('game.gameParticipants', 'gameParticipant')
      .leftJoinAndSelect('gameParticipant.user', 'participantUser')
      .where('game.status = :status', { status: GameStatus.APPROVED });

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

  ///////////////////////////////////////////////
  /// this used to calculate available slots, should also get the pending games
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

  async approveGame(gameId: string, status: GameStatus): Promise<Game> {
    const game = await this.findById(gameId);
    game.status = status;

    const gameRes = await this.gameRepository.save(game);

    this.mailService.sendNewGameStatus(
      gameRes.creator.userEmail,
      gameRes.creator.firstName,
      status,
      gameRes.field.fieldName,
    );

    return gameRes;
  }

  async declineGame(gameId: string): Promise<void> {
    const game = await this.findById(gameId);
    await this.deleteOne(gameId);

    this.mailService.sendNewGameStatus(
      game.creator.userEmail,
      game.creator.firstName,
      GameStatus.DELETED,
      game.field.fieldName,
    );
  }

  // Todo: get only future games
  async findAllGamesByField(fieldId: string): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: ['field'],
      where: {
        field: { fieldId },
      },
      order: { startDate: 'ASC' },
    });

    if (!games) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }

    return games;
  }

  // Todo: get only future games
  async findPendingGamesByField(fieldId: string): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: ['field'],
      where: {
        field: { fieldId },
        status: GameStatus.PENDING,
      },
      order: { startDate: 'ASC' },
    });

    if (!games) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }

    return games;
  }

  async findApprovedGamesByField(fieldId: string): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: ['field'],
      where: {
        field: {
          fieldId,
        },
        status: GameStatus.APPROVED,
      },
    });
    if (!games) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }
    return games;
  }
}
