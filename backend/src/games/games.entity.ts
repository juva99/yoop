import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Field } from 'src/fields/fields.entity';
import { GameType } from 'src/enums/game-type.enum';
import { GameStatus } from 'src/enums/game-status.enum';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column("enum", {enum: GameType})
  gameType: GameType;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  maxParticipants: number;

  @Column("enum", {enum: GameStatus})
  status: GameStatus;

  //game participants
  @ManyToMany(game => User, { eager: true })
  @JoinTable({
    name: "participating_games",
    joinColumn: {
      name: "game",
      referencedColumnName:"gameId"
    },
    inverseJoinColumn: {
      name: "user",
      referencedColumnName: "uid"
    }
  })
  participants: User[];

  //game creator
  @ManyToOne(() => User, creator => creator.createdGames, { eager: true })
  creator: User;

  //field where game happens
  @ManyToOne(() => Field, field => field.gamesInField)
  field: Field;
}