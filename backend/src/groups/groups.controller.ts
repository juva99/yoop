import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Group } from './groups.entity';
import { GroupMember } from 'src/group-members/group-members.entity';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  // get group by id
  @Get('/:id')
  async getGroupById(@Param('id') groupId: string) {
    return await this.groupsService.findGroupById(groupId);
  }

  @Get('/mygroups')
  async getMyGroups(@GetUser() user: User): Promise<Group[]> {
    return await this.groupMembersService.findMyGroups(user);
  }

  @Roles(Role.ADMIN)
  @Get('/allgroups')
  async getAllGroups(): Promise<Group[]> {
    return await this.groupsService.findAllGroups();
  }

  @Post('/create')
  async createGroup(
    @GetUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return await this.groupsService.createGroup(user.uid, createGroupDto);
  }

  @Roles(Role.ADMIN)
  @Delete('/delete/:id')
  async deleteGroup(@Param('id') groupId: string): Promise<void> {
    return await this.groupsService.deleteGroup(groupId);
  }

  @Put('/update')
  async updateGroup(@Body() updateGroupDto: UpdateGroupDto): Promise<Group> {
    return await this.groupsService.updateGroup(updateGroupDto);
  }

  @Get('/:id/members')
  async getGroupMembers(@Param('id') groupId: string): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupMembers(groupId);
  }

  @Get('/:id/users')
  async getGroupUsers(@Param('id') groupId: string): Promise<User[]> {
    return await this.groupMembersService.findAllGroupUsers(groupId);
  }

  @Get('/:groupId/managers')
  async getGroupManagers(
    @Param('groupId') groupId: string,
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupManagers(groupId);
  }

  @Post('/:id/add/:userId')
  async addUserToGroup(
    @Param('id') groupId: string,
    @Body() userIds: string[],
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.addUsersToGroup(groupId, userIds);
  }

  @Delete('/:id/remove/:userId')
  async removeMemeberFromGroup(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return await this.groupMembersService.removeMemeberFromGroup(
      groupId,
      userId,
    );
  }
}
