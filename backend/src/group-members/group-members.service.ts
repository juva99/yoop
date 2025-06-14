import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/groups.entity';
import { In, Repository } from 'typeorm';
import { GroupMember } from './group-members.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private groupMemberRepository: Repository<GroupMember>,
    private readonly userService: UsersService,
  ) {}

  async findGroupMember(groupId: string, userId: string): Promise<GroupMember> {
    const groupMember = await this.groupMemberRepository.findOne({
      where: {
        group: { groupId: groupId },
        user: { uid: userId },
      },
      relations: ['user', 'group'],
    });

    if (!groupMember) {
      throw new NotFoundException('אין משתמש כזה בקבוצה הזאת');
    }

    return groupMember;
  }

  async findMyGroups(user: User): Promise<Group[]> {
    const groupMembers = await this.groupMemberRepository.find({
      where: { user: { uid: user.uid } },
      relations: ['group'],
    });

    return groupMembers.map((gm) => gm.group);
  }

  async findAllGroupMembers(groupId: string): Promise<GroupMember[]> {
    const groupMembers = await this.groupMemberRepository.find({
      where: {
        group: { groupId: groupId },
      },
      relations: ['user', 'group'],
    });

    return groupMembers;
  }

  async findAllGroupUsers(groupId: string): Promise<User[]> {
    const groupMembers = await this.findAllGroupMembers(groupId);

    return groupMembers.map((gm) => gm.user);
  }

  async findAllGroupManagers(groupId: string): Promise<GroupMember[]> {
    return await this.groupMemberRepository.find({
      where: {
        group: { groupId: groupId },
        isManager: true,
      },
      relations: ['user', 'group'],
    });
  }

  async addUsersToGroup(
    groupId: string,
    userIds: string[],
  ): Promise<GroupMember[]> {
    const group = await this.groupRepository.findOne({
      where: {
        groupId: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('אין קבוצה כזאת!');
    }

    const existingMembers = await this.groupMemberRepository.find({
      where: {
        group: { groupId: groupId },
        user: { uid: In(userIds) },
      },
      relations: ['user'],
    });

    const existingMembersIds = existingMembers.map((gm) => gm.user.uid);
    const newUserIds = userIds.filter(
      (uid) => !existingMembersIds.includes(uid),
    );

    if (newUserIds.length === 0) {
      throw new ConflictException('כל המשתמשים כבר בקבוצה!');
    }

    const newUsers = await this.userService.findByIds(newUserIds);

    const newMembers = newUsers.map((user) =>
      this.groupMemberRepository.create({
        group: group,
        user: user,
        isManager: false,
      }),
    );

    return await this.groupMemberRepository.save(newMembers);
  }

  async removeMemeberFromGroup(groupId: string, userId: string): Promise<void> {
    const groupMember = await this.findGroupMember(groupId, userId);

    const managers = await this.findAllGroupManagers(groupId);
    if (managers.length === 1) {
      throw new ConflictException('לא ניתן להשאיר את הקבוצה ללא מנהל');
    }

    await this.groupMemberRepository.delete(groupMember);
  }

  // currently not necessary
  // async joinGroup() {}
  // async leaveGroup() {}

  async setManagerStatus(
    groupId: string,
    userId: string,
    status: boolean,
  ): Promise<GroupMember> {
    const groupMember = await this.findGroupMember(groupId, userId);

    if (!status) {
      if (!groupMember.isManager) {
        throw new ConflictException('המשתמש אינו מנהל!');
      }
      const managers = await this.findAllGroupManagers(groupId);
      if (managers.length === 1) {
        throw new ConflictException('לא ניתן להשאיר את הקבוצה ללא מנהל');
      }
    } else {
      if (groupMember.isManager) {
        throw new ConflictException('המשתמש כבר מנהל!');
      }
    }

    groupMember.isManager = status;

    return this.groupMemberRepository.save(groupMember);
  }

  async isManager(groupId: string, userId: string): Promise<Boolean> {
    const groupMember = await this.findGroupMember(groupId, userId);

    return groupMember.isManager;
  }
}
