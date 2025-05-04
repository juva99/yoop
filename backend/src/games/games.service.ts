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
import { QueryAvailableSlotsDto } from './dto/query-available-slots.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,

    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,

    @InjectRepository(GameParticipant)
    private gameParticipantRepository: Repository<GameParticipant>,
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
    const fieldd = await this.fieldRepository.findOne({
      where: { fieldId: field },
    });
    if (!fieldd) {
      throw new NotFoundException(`field with id ${field} not found`);
    }

    const game = this.gameRepository.create({
      gameType,
      startDate,
      endDate,
      maxParticipants,
      creator: user,
      field: fieldd,
      status: GameStatus.AVAILABLE,
      gameParticipants: [],
    });

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

  async joinGame(gameId: string, user: User): Promise<GameParticipant> {
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
      status: ParticipationStatus.PENDING,
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
      throw new ConflictException('User is not participating in this game');
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
