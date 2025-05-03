import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Field } from 'src/fields/fields.entity';
import { Game } from 'src/games/games.entity';
import { GameParticipant } from 'src/game-participants/game-participants.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  pass: string;

  @Column({ unique: true })
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

  @Column({ default: 'user' })
  role: string;

  //field managers
  @OneToMany(() => Field, (field) => field.manager)
  fieldsManage: Field[];

  //firend list
  @ManyToMany(() => User)
  @JoinTable({
    name: 'friend_list',
    joinColumn: {
      name: 'user1',
      referencedColumnName: 'uid',
    },
    inverseJoinColumn: {
      name: 'user2',
      referencedColumnName: 'uid',
    },
  })
  friendList: User[];

  // game participants
  @OneToMany(() => GameParticipant, (gameParticipant) => gameParticipant.user)
  gameParticipations: GameParticipant[];

  //created games
  @OneToMany(() => Game, (createdGames) => createdGames.creator)
  createdGames: Game[];

  //refresh token
  @Column({ nullable: true, select: false })
  hashedRefreshToken?: string;
}
