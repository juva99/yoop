import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/games/games.entity';
import { GameParticipant } from './game-participants.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { SetStatusDto } from './dto/set-status.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GameParticipantsService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private gameParticipantRepository: Repository<GameParticipant>,
    private readonly userService: UsersService,
  ) {}
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

  async setStatus(setStatusDto: SetStatusDto): Promise<GameParticipant> {
    const { uid, gameId, newStatus } = setStatusDto;
    let participant = await this.gameParticipantRepository.findOne({
      where: { user: { uid }, game: { gameId } },
      relations: ['user', 'game'],
    });

    if (!participant) {
      const game = await this.gameRepository.findOne({ where: { gameId } });
      const user = await this.userService.findById(uid);
      if (user && game) {
        participant = this.gameParticipantRepository.create({
          user: user,
          game: game,
          status: newStatus,
        });
      } else throw new NotFoundException('no user or game with id found');
    } else {
      participant.status = newStatus;
    }

    return this.gameParticipantRepository.save(participant);
  }

  ////////////////////////////
  // Todo: change to only approved
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


    const results = await this.gameRepository.delete(gameId);

    if (results.affected === 0) {
      throw new NotFoundException(`Game with id "${gameId}" not found`);
    }
  }
}
