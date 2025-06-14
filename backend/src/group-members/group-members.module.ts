import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-members/group-members.entity';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
import { Group } from 'src/groups/groups.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Group]), UsersModule],
  exports: [TypeOrmModule, GroupMembersService],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}
