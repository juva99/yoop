import { Module } from '@nestjs/common';
import { Group } from './groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { AzureStorageModule } from 'src/azure-storage/azure-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    GroupMembersModule,
    AzureStorageModule,
  ],
  controllers: [GroupController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
