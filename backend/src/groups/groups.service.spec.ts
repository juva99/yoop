import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { User } from 'src/users/users.entity';
import { Role } from 'src/enums/role.enum';
import { NotFoundException } from '@nestjs/common';

//mock repository
const mockGroupRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
});

//mock groupMembersService
const mockGroupMembersService = () => ({
  addUsersToGroup: jest.fn(),
  setManagerStatus: jest.fn(),
});

describe('GroupsService', () => {
  //for all tests
  let service: GroupsService;
  let groupRepository: jest.Mocked<Repository<Group>>;
  let groupMembersService: ReturnType<typeof mockGroupMembersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: getRepositoryToken(Group), useFactory: mockGroupRepository },
        { provide: GroupMembersService, useFactory: mockGroupMembersService },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get(getRepositoryToken(Group));
    groupMembersService = module.get(GroupMembersService);
  });

  //tests for findGroupById func
  describe('findGroupById', () => {
    it('should return a group if found', async () => {
      //dummy group data
      const mockGroup = {
        groupId: '123',
        groupMembers: [],
        groupName: 'aaa',
        gameTypes: [],
      } as Group;
      //mock value from findOne
      groupRepository.findOne.mockResolvedValue(mockGroup);

      //run test func (runs with mocks, doesnt send request to db)
      const result = await service.findGroupById('123');
      //what test should return in this case
      expect(result).toEqual(mockGroup);
      //thats another test for the same data
      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { groupId: '123' },
        relations: ['groupMembers', 'groupMembers.user'],
      });
    });

    it('should throw NotFoundException if group not found', async () => {
      groupRepository.findOne.mockResolvedValue(null);

      await expect(service.findGroupById('124')).rejects.toThrow(
        'אין קבוצה כזאת',
      );
    });
  });

  //tests for delete group func
  describe('deleteGroup', () => {
    const groupId = 'group-123';
    const adminUser = { uid: 'admin', role: Role.ADMIN } as User;
    const managerUser = { uid: 'manager', role: Role.USER } as User;
    const regularUser = { uid: 'regular', role: Role.USER } as User;

    const groupWithManager = {
      groupId,
      groupMembers: [
        {
          user: { uid: 'manager' },
          isManager: true,
        },
        {
          user: { uid: 'regular' },
          isManager: false,
        },
      ],
    } as unknown as Group;

    it('should delete group if user is manager', async () => {
      groupRepository.findOne.mockResolvedValue(groupWithManager);
      groupRepository.remove.mockResolvedValue(groupWithManager);

      await expect(
        service.deleteGroup(groupId, managerUser),
      ).resolves.toBeUndefined();
      expect(groupRepository.remove).toHaveBeenCalledWith(groupWithManager);
    });

    it('should delete group if user is admin', async () => {
      groupRepository.findOne.mockResolvedValue(groupWithManager);
      groupRepository.remove.mockResolvedValue(groupWithManager);

      await expect(
        service.deleteGroup(groupId, adminUser),
      ).resolves.toBeUndefined();
      expect(groupRepository.remove).toHaveBeenCalledWith(groupWithManager);
    });

    it('should throw if user is not group manager or admin', async () => {
      groupRepository.findOne.mockResolvedValue(groupWithManager);

      await expect(service.deleteGroup(groupId, regularUser)).rejects.toThrow(
        new NotFoundException('אין לך הרשאות למחוק קבוצה זו'),
      );

      expect(groupRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw if group does not exist', async () => {
      groupRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteGroup('nonexistent-group', adminUser),
      ).rejects.toThrow(new NotFoundException('אין קבוצה כזאת'));

      expect(groupRepository.remove).not.toHaveBeenCalled();
    });
  });
});
