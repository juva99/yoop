import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Field } from 'src/fields/fields.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column({ nullable: true })
  gameType: number;

  @Column({nullable: true })
  fieldId: string;

  @Column()
  mid: string;

  @Column()
  date: Date;

  @Column()
  maxParticipants: number;

  //game participants
  @ManyToMany(game => User)
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
  @ManyToOne(() => User, creator => creator.createdGames)
  creator: User;

  //field where game happens
  @ManyToOne(() => Field, field => field.gamesInField)
  field: Field;
}