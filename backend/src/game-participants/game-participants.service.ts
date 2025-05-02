import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/games/games.entity';
import { GameParticipant } from './game-participants.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { use } from 'passport';
import { SetStatusDto } from './dto/set-status.dto';
@Injectable()
export class GameParticipantsService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private gameParticipantRepository: Repository<GameParticipant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async setStatus(setStatusDto: SetStatusDto): Promise<GameParticipant> {
    const { uid, gameId, newStatus } = setStatusDto;
    let participant = await this.gameParticipantRepository.findOne({
      where: { user: { uid }, game: { gameId } },
      relations: ['user', 'game'],
    });

    if (!participant) {
      const game = await this.gameRepository.findOne({ where: { gameId } });
      const user = await this.userRepository.findOne({ where: { uid } });
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
}
