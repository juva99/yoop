import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from 'src/users/users.entity';
import { FriendReqStatus } from 'src/enums/friend-req-status.enum';

@Entity('friend-relations')
@Unique(['user1', 'user2'])
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
