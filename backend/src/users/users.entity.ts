import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Field } from 'src/fields/fields.entity';
import { Game } from 'src/games/games.entity';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { FriendRelation } from 'src/friends/friends.entity';
import { Role } from 'src/enums/role.enum';


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

  @Column('enum', { enum: Role, default: Role.USER })
  role: Role;

  //field managers
  @OneToMany(() => Field, (field) => field.manager)
  fieldsManage: Field[];

  // Sent friend requests by this user
  @OneToMany(() => FriendRelation, (friendRelation) => friendRelation.user1)
  sentFriendRequests: FriendRelation[];

  // Received friend requests for this user
  @OneToMany(() => FriendRelation, (friendRelation) => friendRelation.user2)
  receivedFriendRequests: FriendRelation[];

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
