import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { FriendReqStatus } from 'src/enums/friend-req-status.enum';

@Entity('friend-relations')
export class FriendRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  user1: User;
  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  user2: User;

  @Column('enum', {
    enum: FriendReqStatus,
    default: FriendReqStatus.PENDING,
  })
  status: FriendReqStatus;
}
