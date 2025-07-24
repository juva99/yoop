import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Role } from 'src/enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    uid: '1',
    firstName: 'John',
    lastName: 'Doe',
    userEmail: 'john.doe@example.com',
    pass: 'hashedPassword',
    birthDay: '1990-01-01',
    isMale: true,
    address: '123 Main St',
    profilePic: null,
    phoneNum: '1234567890',
    role: Role.USER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    passwordResetExpires: undefined,
    groupMemberIn: [],
  };

  const currentUser: User = {
    uid: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    userEmail: 'jane.smith@example.com',
    pass: 'hashedPassword',
    birthDay: '1992-01-01',
    isMale: false,
    address: '456 Oak St',
    profilePic: null,
    phoneNum: '0987654321',
    role: Role.USER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    passwordResetExpires: undefined,
    groupMemberIn: [],
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    subQuery: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    getQuery: jest.fn().mockReturnValue('subquery'),
    getMany: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should find users by first name', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockUser]);

      const result = await service.findByName('John', currentUser);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "CONCAT(user.firstName, ' ', user.lastName) ILIKE :name",
        { name: '%John%' },
      );
      expect(result).toEqual([mockUser]);
    });

    it('should find users by last name', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockUser]);

      const result = await service.findByName('Doe', currentUser);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "CONCAT(user.firstName, ' ', user.lastName) ILIKE :name",
        { name: '%Doe%' },
      );
      expect(result).toEqual([mockUser]);
    });

    it('should find users by full name after the fix', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockUser]);

      const result = await service.findByName('John Doe', currentUser);

      // Simplified implementation using only concatenated full name search
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "CONCAT(user.firstName, ' ', user.lastName) ILIKE :name",
        { name: '%John Doe%' },
      );

      // Should now find the user with firstName="John" and lastName="Doe"
      expect(result).toEqual([mockUser]);
    });

    it('should exclude current user from results', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findByName('John', currentUser);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.uid != :currentUserId',
        { currentUserId: currentUser.uid },
      );
    });

    it('should exclude existing friends from results', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findByName('John', currentUser);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.uid NOT IN (subquery)',
      );
    });
  });
});
