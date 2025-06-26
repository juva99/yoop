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
import { GroupMember } from './group-members.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Get('/:groupId/:userId')
  async getGroupMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<GroupMember> {
    return await this.groupMembersService.findGroupMember(groupId, userId);
  }

  @Patch('/:groupId/setManager/:userId')
  async setManagerStatus(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body('status') status: boolean,
  ): Promise<GroupMember> {
    return await this.groupMembersService.setManagerStatus(
      groupId,
      userId,
      status,
    );
  }

  @Post('/:groupId/add')
  async addMembers(
    @Param('groupId') groupId: string,
    @GetUser() user: User,
    @Body('userIds') userIds: string[],
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.addUsersToGroup(
      user.uid,
      groupId,
      userIds,
    );
  }
}
