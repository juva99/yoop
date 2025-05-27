import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Game } from '../games/games.entity';
import { User } from '../users/users.entity';
import { ParticipationStatus } from '../enums/participation-status.enum';

@Entity('participating_games')
export class GameParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.gameParticipants, {
    onDelete: 'CASCADE', // Add this
  })
  game: Game;

  @ManyToOne(() => User, (user) => user.gameParticipations, { eager: true })
  user: User;

  @Column('enum', {
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  status: ParticipationStatus;
}
