import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../users/users.entity';
import { FriendReqStatus } from '../enums/friend-req-status.enum';

@Entity('friend-relations')
@Unique(['user1', 'user2'])
export class FriendRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  user1: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  user2: User;

  @Column('enum', {
    enum: FriendReqStatus,
    default: FriendReqStatus.PENDING,
  })
  status: FriendReqStatus;
}
