import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Field } from 'src/fields/fields.entity';
import { GameType } from 'src/enums/game-type.enum';
import { GameStatus } from 'src/enums/game-status.enum';
import { GameParticipant } from 'src/game-participants/game-participants.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column('enum', { enum: GameType })
  gameType: GameType;

  @Column({type: 'timestamptz'})
  startDate: Date;

  @Column({type: 'timestamptz'})
  endDate: Date;

  @Column()
  maxParticipants: number;

  @Column('enum', { enum: GameStatus })
  status: GameStatus;
  
  @Column()
  weatherTemp: number;

  @Column()
  weatherCondition: string;

  @Column()
  weatherIcon: string;

  //game participants
  @OneToMany(() => GameParticipant, (gameParticipant) => gameParticipant.game, {
    eager: true,
    cascade: true,
  })
  gameParticipants: GameParticipant[];

  //game creator
  @ManyToOne(() => User, (creator) => creator.createdGames, { eager: true })
  creator: User;

  //field where game happens
  @ManyToOne(() => Field, (field) => field.gamesInField, { eager: true })
  field: Field;
}
