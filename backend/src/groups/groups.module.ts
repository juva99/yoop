import { Module } from '@nestjs/common';
import { Group } from './groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupMembersModule } from 'src/group-members/group-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), GroupMembersModule],
  controllers: [GroupController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
