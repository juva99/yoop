import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UsersService } from 'src/users/users.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly groupMemberService: GroupMembersService,
    private readonly userService: UsersService,
  ) {}

  async findGroupById(groupId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { groupId: groupId },
    });

    if (!group) {
      throw new NotFoundException('אין קבוצה כזאת');
    }

    return group;
  }

  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async createGroup(
    creatorId: string,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const { groupName, groupPicture, gameTypes, userIds } = createGroupDto;

    const group = await this.groupRepository.create({
      groupName: groupName,
      groupPicture: groupPicture,
      gameTypes: gameTypes,
    });

    const savedGroup = await this.groupRepository.save(group);

    if (!userIds.includes(creatorId)) {
      userIds.push(creatorId);
    }

    await this.groupMemberService.addUsersToGroup(savedGroup.groupId, userIds);
    await this.groupMemberService.setManagerStatus(
      savedGroup.groupId,
      creatorId,
      true,
    );

    return savedGroup;
  }

  async updateGroup(updateGroupDto: UpdateGroupDto): Promise<Group> {
    const { groupId, groupName, groupPicture, gameTypes } = updateGroupDto;

    const group = await this.findGroupById(groupId);

    if (groupName !== undefined) {
      group.groupName = groupName;
    }
    if (groupPicture !== undefined) {
      group.groupPicture = groupPicture;
    }
    if (gameTypes !== undefined) {
      group.gameTypes = [...gameTypes];
    }

    return await this.groupRepository.save(group);
  }

  async deleteGroup(groupId: string): Promise<void> {
    const group = await this.findGroupById(groupId);

    await this.groupRepository.remove(group);
  }
}
