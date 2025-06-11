import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendSetStatusDto } from './dto/friendsSetStatus.dto';
import { FriendReqDto } from './dto/friendsReq.dto';
import { FriendRelation } from './friends.entity';
import { User } from '../users/users.entity';
import { Role } from '../enums/role.enum';
import { FriendReqStatus } from '../enums/friend-req-status.enum';

describe('FriendsController', () => {
  let controller: FriendsController;
  let friendsService: FriendsService;

  const mockUser: User = {
    uid: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: Role.USER,
    phoneNumber: '+1234567890',
    city: 'Berlin',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockFriend: User = {
    uid: '123e4567-e89b-12d3-a456-426614174001',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: Role.USER,
    phoneNumber: '+1234567891',
    city: 'Munich',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockFriendRelation: FriendRelation = {
    id: 'relation-123',
    requester: mockUser,
    addressee: mockFriend,
    status: FriendReqStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FriendRelation;

  const mockFriendsService = {
    setStatus: jest.fn(),
    sendReq: jest.fn(),
    deleteReq: jest.fn(),
    getPendingRequestsForUser: jest.fn(),
    getAllFriends: jest.fn(),
    checkUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: FriendsService,
          useValue: mockFriendsService,
        },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
    friendsService = module.get<FriendsService>(FriendsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setStatus', () => {
    it('should accept a friend request', async () => {
      const setStatusDto: FriendSetStatusDto = {
        req_uid: mockFriend.uid,
        status: FriendReqStatus.ACCEPTED,
      };

      const acceptedRelation = {
        ...mockFriendRelation,
        status: FriendReqStatus.ACCEPTED,
      };

      mockFriendsService.checkUser.mockResolvedValue(undefined);
      mockFriendsService.setStatus.mockResolvedValue(acceptedRelation);

      const result = await controller.setStatus(setStatusDto, mockUser);

      expect(result).toEqual(acceptedRelation);
      expect(mockFriendsService.checkUser).toHaveBeenCalledWith(
        mockUser,
        setStatusDto.req_uid,
      );
      expect(mockFriendsService.setStatus).toHaveBeenCalledWith(setStatusDto);
    });

    it('should decline a friend request', async () => {
      const setStatusDto: FriendSetStatusDto = {
        req_uid: mockFriend.uid,
        status: FriendReqStatus.DECLINED,
      };

      const declinedRelation = {
        ...mockFriendRelation,
        status: FriendReqStatus.DECLINED,
      };

      mockFriendsService.checkUser.mockResolvedValue(undefined);
      mockFriendsService.setStatus.mockResolvedValue(declinedRelation);

      const result = await controller.setStatus(setStatusDto, mockUser);

      expect(result).toEqual(declinedRelation);
      expect(mockFriendsService.checkUser).toHaveBeenCalledWith(
        mockUser,
        setStatusDto.req_uid,
      );
      expect(mockFriendsService.setStatus).toHaveBeenCalledWith(setStatusDto);
    });

    it('should handle unauthorized user access', async () => {
      const setStatusDto: FriendSetStatusDto = {
        req_uid: mockFriend.uid,
        status: FriendReqStatus.ACCEPTED,
      };

      mockFriendsService.checkUser.mockRejectedValue(
        new Error('Unauthorized access'),
      );

      await expect(
        controller.setStatus(setStatusDto, mockUser),
      ).rejects.toThrow('Unauthorized access');
      expect(mockFriendsService.checkUser).toHaveBeenCalledWith(
        mockUser,
        setStatusDto.req_uid,
      );
    });
  });

  describe('sendReq', () => {
    it('should send a friend request successfully', async () => {
      const friendReqDto: FriendReqDto = {
        addressee_uid: mockFriend.uid,
      };

      mockFriendsService.sendReq.mockResolvedValue(mockFriendRelation);

      const result = await controller.sendReq(friendReqDto, mockUser);

      expect(result).toEqual(mockFriendRelation);
      expect(mockFriendsService.sendReq).toHaveBeenCalledWith(
        friendReqDto,
        mockUser,
      );
    });

    it('should handle duplicate friend request', async () => {
      const friendReqDto: FriendReqDto = {
        addressee_uid: mockFriend.uid,
      };

      mockFriendsService.sendReq.mockRejectedValue(
        new Error('Friend request already exists'),
      );

      await expect(controller.sendReq(friendReqDto, mockUser)).rejects.toThrow(
        'Friend request already exists',
      );
    });

    it('should handle sending request to non-existent user', async () => {
      const friendReqDto: FriendReqDto = {
        addressee_uid: 'non-existent-uid',
      };

      mockFriendsService.sendReq.mockRejectedValue(new Error('User not found'));

      await expect(controller.sendReq(friendReqDto, mockUser)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('deleteReq', () => {
    it('should delete a friend request successfully', async () => {
      const friendId = mockFriend.uid;

      mockFriendsService.checkUser.mockResolvedValue(undefined);
      mockFriendsService.deleteReq.mockResolvedValue(undefined);

      const result = await controller.deleteReq(mockUser, friendId);

      expect(result).toBeUndefined();
      expect(mockFriendsService.checkUser).toHaveBeenCalledWith(
        mockUser,
        friendId,
      );
      expect(mockFriendsService.deleteReq).toHaveBeenCalledWith(friendId);
    });

    it('should handle unauthorized deletion attempt', async () => {
      const friendId = mockFriend.uid;

      mockFriendsService.checkUser.mockRejectedValue(
        new Error('Unauthorized access'),
      );

      await expect(controller.deleteReq(mockUser, friendId)).rejects.toThrow(
        'Unauthorized access',
      );
      expect(mockFriendsService.checkUser).toHaveBeenCalledWith(
        mockUser,
        friendId,
      );
    });
  });

  describe('getPendingRequests', () => {
    it('should return pending friend requests for user', async () => {
      const pendingRequests = [mockFriendRelation];

      mockFriendsService.getPendingRequestsForUser.mockResolvedValue(
        pendingRequests,
      );

      const result = await controller.getPendingRequests(mockUser);

      expect(result).toEqual(pendingRequests);
      expect(mockFriendsService.getPendingRequestsForUser).toHaveBeenCalledWith(
        mockUser,
      );
    });

    it('should return empty array when no pending requests', async () => {
      mockFriendsService.getPendingRequestsForUser.mockResolvedValue([]);

      const result = await controller.getPendingRequests(mockUser);

      expect(result).toEqual([]);
      expect(mockFriendsService.getPendingRequestsForUser).toHaveBeenCalledWith(
        mockUser,
      );
    });
  });

  describe('getAllFriends', () => {
    it('should return all friends for user', async () => {
      const friends = [
        { ...mockFriendRelation, status: FriendReqStatus.ACCEPTED },
      ];

      mockFriendsService.getAllFriends.mockResolvedValue(friends);

      const result = await controller.getAllFriends(mockUser);

      expect(result).toEqual(friends);
      expect(mockFriendsService.getAllFriends).toHaveBeenCalledWith(mockUser);
    });

    it('should return empty array when user has no friends', async () => {
      mockFriendsService.getAllFriends.mockResolvedValue([]);

      const result = await controller.getAllFriends(mockUser);

      expect(result).toEqual([]);
      expect(mockFriendsService.getAllFriends).toHaveBeenCalledWith(mockUser);
    });
  });
});
