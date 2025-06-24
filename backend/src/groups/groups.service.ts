import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { User } from 'src/users/users.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly groupMemberService: GroupMembersService,
  ) {}

  async findGroupById(groupId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { groupId: groupId },
      relations: ['groupMembers', 'groupMembers.user'],
    });

    if (!group) {
      throw new NotFoundException('אין קבוצה כזאת');
    }

    return group;
  }

  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      relations: ['groupMembers', 'groupMembers.user'],
    });
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

    return this.findGroupById(savedGroup.groupId);
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

  async deleteGroup(groupId: string, user: User): Promise<void> {
    const group = await this.findGroupById(groupId);
    const isManager = group.groupMembers.some(
      (member) => member.user.uid === user.uid && member.isManager,
    );

    if (!isManager && user.role !== Role.ADMIN) {
      throw new NotFoundException('אין לך הרשאות למחוק קבוצה זו');
    }

    await this.groupRepository.remove(group);
  }

  async updateGroupPicture(
    groupId: string,
    groupPicture: string | undefined,
  ): Promise<any> {
    const results = await this.groupRepository.update(
      { groupId },
      { groupPicture: groupPicture === undefined ? null : groupPicture },
    );
    if (results.affected === 0) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }
    return results.affected;
  }
}
