import { Group } from 'src/groups/groups.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('group_member')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.groupMembers, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMemberIn, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  isManager: boolean;
}
