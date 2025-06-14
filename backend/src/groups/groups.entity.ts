import { IsOptional } from 'class-validator';
import { GameType } from 'src/enums/game-type.enum';
import { GroupMember } from 'src/group-members/group-members.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  groupId: string;

  @Column()
  groupName: string;

  @Column({ nullable: true })
  groupPicture?: string;

  @Column('enum', { enum: GameType, array: true })
  gameTypes: GameType[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group, {
    eager: true,
  })
  groupMembers: GroupMember[];
}
