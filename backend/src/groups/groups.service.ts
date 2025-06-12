import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UsersService } from 'src/users/users.service';

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

  //DTO
  async createGroup() {}

  //DTO
  async updateGroup() {}

  async deleteGroup(groupId: string) {
    const group = await this.findGroupById(groupId);

    await this.groupRepository.remove(group);
  }
}
