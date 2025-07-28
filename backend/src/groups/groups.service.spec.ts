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
import { GameType } from 'src/enums/game-type.enum';

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

  describe('createGroup', () => {
    it('should create a group and add members', async () => {
      const createGroupDto: CreateGroupDto = {
        groupName: 'Test Group',
        groupPicture: 'url',
        gameTypes: [GameType.FootBall],
        userIds: ['user1'],
      };
      const mockGroup: Group = {
        groupId: '1',
        groupName: 'Test Group',
        groupPicture: 'url',
        gameTypes: [GameType.FootBall],
        groupMembers: [],
      } as Group;

      groupRepository.create.mockReturnValue(mockGroup);
      groupRepository.save.mockResolvedValue(mockGroup);
      groupRepository.findOne.mockResolvedValue(mockGroup);

      const result = await service.createGroup('creatorId', createGroupDto);

      expect(groupRepository.create).toHaveBeenCalledWith({
        groupName: 'Test Group',
        groupPicture: 'url',
        gameTypes: [GameType.FootBall],
      });

      expect(groupRepository.save).toHaveBeenCalled();
      expect(groupMembersService.addUsersToGroup).toHaveBeenCalledWith(
        '1',
        expect.arrayContaining(['creatorId', 'user1']),
      );
      expect(groupMembersService.setManagerStatus).toHaveBeenCalledWith(
        '1',
        'creatorId',
        true,
      );
      expect(result).toEqual(mockGroup);
    });
  });

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

    it('should throw if user is not manager or admin', async () => {
      groupRepository.findOne.mockResolvedValue(groupWithManager);

      await expect(service.deleteGroup(groupId, regularUser)).rejects.toThrow(
        new NotFoundException('אין לך הרשאות למחוק קבוצה זו'),
      );

      expect(groupRepository.remove).not.toHaveBeenCalled();
    });
  });
  describe('updateGroup', () => {
    const existingGroup = {
      groupId: 'group-1',
      groupName: 'Old Name',
      groupPicture: 'old.png',
      gameTypes: [GameType.BasketBall],
    } as Group;

    beforeEach(() => {
      groupRepository.save.mockClear();
    });

    it('should update all fields and save group', async () => {
      const dto: UpdateGroupDto = {
        groupId: 'group-1',
        groupName: 'New Name',
        groupPicture: 'new.png',
        gameTypes: [GameType.BasketBall],
      };

      groupRepository.findOne.mockResolvedValue(existingGroup);
      groupRepository.save.mockResolvedValue({
        ...existingGroup,
        ...dto,
      });

      const result = await service.updateGroup(dto);

      expect(result.groupName).toBe('New Name');
      expect(result.groupPicture).toBe('new.png');
      expect(result.gameTypes).toEqual([GameType.BasketBall]);
      expect(groupRepository.save).toHaveBeenCalledWith({
        ...existingGroup,
        ...dto,
      });
    });

    it('should update only specified fields', async () => {
      const dto: UpdateGroupDto = {
        groupId: 'group-1',
        groupName: 'Partial Update',
        gameTypes: [GameType.BasketBall, GameType.FootBall],
      };

      groupRepository.findOne.mockResolvedValue(existingGroup);
      groupRepository.save.mockResolvedValue({
        ...existingGroup,
        groupName: 'Partial Update',
        gameTypes: [GameType.BasketBall, GameType.FootBall],
      });

      const result = await service.updateGroup(dto);
      expect(result.groupName).toBe('Partial Update');
      expect(result.gameTypes).toEqual([
        GameType.BasketBall,
        GameType.FootBall,
      ]);
      expect(groupRepository.save).toHaveBeenCalled();
    });
  });
});
