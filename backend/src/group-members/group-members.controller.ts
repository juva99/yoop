import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Group } from 'src/groups/groups.entity';
import { GroupMember } from './group-members.entity';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  // executed by manager check is needed?
  @Patch('/:groupId/setManager/:userId')
  async setManagerStatus(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body('status') status: boolean,
  ): Promise<GroupMember> {
    return await this.setManagerStatus(groupId, userId, status);
  }
}
