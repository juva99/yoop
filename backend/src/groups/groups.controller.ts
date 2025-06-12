import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Group } from './groups.entity';
import { GroupMember } from 'src/group-members/group-members.entity';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  // get all groups

  // create group

  // delete group

  // edit group

  // get group by id

  @Get('/mygroups')
  async getMyGroups(@GetUser() user: User): Promise<Group[]> {
    return await this.groupMembersService.findMyGroups(user);
  }

  @Get('/:groupId/members')
  async getGroupMembers(
    @Param('groupId') groupId: string,
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupMembers(groupId);
  }

  @Get('/:groupId/users')
  async getGroupUsers(@Param('groupId') groupId: string): Promise<User[]> {
    return await this.groupMembersService.findAllGroupUsers(groupId);
  }

  @Get('/:groupId/managers')
  async getGroupManagers(
    @Param('groupId') groupId: string,
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupManagers(groupId);
  }

  @Post('/:groupId/add/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<GroupMember> {
    return await this.groupMembersService.addUserToGroup(groupId, userId);
  }

  @Delete('/:groupId/remove/:userId')
  async removeMemeberFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return await this.groupMembersService.removeMemeberFromGroup(
      groupId,
      userId,
    );
  }
}
