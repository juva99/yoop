import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Field } from 'src/fields/fields.entity';
import { Game } from 'src/games/games.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  pass: string;

  @Column({unique: true})
  userEmail: string;

  @Column({ type: 'date', nullable: true })
  birthDay: string;

  @Column({ nullable: true })
  isMale: boolean;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ nullable: true })
  phoneNum?: string;

  @Column()
  role: string;

  //field managers
  @OneToMany(() => Field, field => field.manager)
  fieldsManage: Field[];

  //firend list
  @ManyToMany(() => User)
  @JoinTable({
    name: "friend_list",
    joinColumn: {
      name: "user1",
      referencedColumnName: "uid"
    },
    inverseJoinColumn: {
      name: "user2",
      referencedColumnName: "uid"
    }
  })
  friendList: User[];

  // game participants
  @ManyToMany(() => Game, (game) => game.participants)
  participatingGames: Game[];
  
  //created games
  @OneToMany(() => Game, (createdGames) => createdGames.creator)
  createdGames: Game[];

}