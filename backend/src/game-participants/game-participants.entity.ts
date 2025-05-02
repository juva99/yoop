import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from 'src/games/games.entity';
import { User } from 'src/users/users.entity';
import { ParticipationStatus } from 'src/enums/participation-status.enum';

@Entity('participating_games')
export class GameParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.gameParticipants)
  // @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => User, (user) => user.gameParticipations)
  // @JoinColumn({ name: 'userId' })
  user: User;

  @Column('enum', {
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  status: ParticipationStatus;
}
