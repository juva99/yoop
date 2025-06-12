import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-members/group-members.entity';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';

// add imports
@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])],
  exports: [TypeOrmModule, GroupMembersService],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}
