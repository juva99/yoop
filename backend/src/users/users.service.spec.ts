import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(), // Add the missing create method
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          uid: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'John',
          lastName: 'Doe',
          userEmail: 'john@example.com',
          birthDay: '1990-01-01',
          pass: 'hashedPassword',
          role: Role.USER,
          isMale: true,
          address: undefined,
          profilePic: undefined,
          phoneNum: undefined,
          fieldsManage: [],
          sentFriendRequests: [],
          receivedFriendRequests: [],
          gameParticipations: [],
          createdGames: [],
          passwordResetToken: null,
          passwordResetExpires: undefined,
          hashedRefreshToken: null,
        },
      ];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no users found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        userEmail: 'john@example.com',
        phoneNum: '123-456-7890',
        birthDay: '1990-01-01',
        address: '123 Main St',
        pass: 'password123',
        passConfirm: 'password123',
        role: Role.USER,
        isMale: true,
        profilePic: undefined,
      };

      // userWithoutPass is what we expect after removing pass and passConfirm for hashing
      const { pass, passConfirm, ...userWithoutPass } = createUserDto;

      // This is the object that the service will likely try to save.
      // It starts with what userRepository.create returns (which we mocked to include passConfirm),
      // and then the service updates the 'pass' field.
      const userObjectFromCreateStep = { ...createUserDto }; // What mockRepository.create returns
      const userToSave = {
        ...userObjectFromCreateStep, // Includes original pass and passConfirm from DTO
        pass: 'hashedPassword', // Password is then updated to hashed version
      };
      // If the service explicitly deletes passConfirm before saving, then userToSave should not have it.
      // Based on the error, it seems passConfirm is still present.

      // This is the final user object returned by the service after save (usually includes DB-generated ID)
      const createdUser = { uid: 'new-user-id', ...userToSave };

      mockedBcrypt.genSalt.mockResolvedValue('salt' as never);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      // userRepository.create is called with the DTO (or similar)
      // It returns an entity instance that the service then modifies
      mockRepository.create.mockReturnValue(userObjectFromCreateStep);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        createUserDto.pass,
        'salt',
      ); // Service uses createUserDto.pass

      // Expect userRepository.create to be called with the DTO
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);

      // Adjust userToSave to match what the error shows is being received
      // The error shows that the received object for save includes passConfirm
      const expectedObjectForSave = {
        ...userWithoutPass, // Contains all fields from DTO except pass and passConfirm
        pass: 'hashedPassword', // The hashed password
        passConfirm: createUserDto.passConfirm, // passConfirm is still there
      };
      expect(mockRepository.save).toHaveBeenCalledWith(expectedObjectForSave);
    });

    it('should throw HttpException when passwords do not match', async () => {
      const invalidDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        userEmail: 'john@example.com',
        phoneNum: '123-456-7890',
        birthDay: '1990-01-01',
        address: '123 Main St',
        pass: 'password123',
        passConfirm: 'differentPassword',
        role: Role.USER,
        isMale: true,
        profilePic: undefined,
      };

      // The service throws a generic Error wrapping the HttpException
      await expect(service.create(invalidDto)).rejects.toThrow(Error);
      await expect(service.create(invalidDto)).rejects.toThrow(
        'HttpException: Conifrm pass is not equal to password',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const email = 'john@example.com';
      const mockUser = { uid: 'user-123', userEmail: email };

      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith([
        'user.pass',
        'user.hashedRefreshToken',
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.userEmail = :email',
        { email },
      );
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const email = 'notfound@example.com';

      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('createManager', () => {
    it('should create a manager successfully', async () => {
      const createManagerDto = {
        firstName: 'Manager',
        lastName: 'User',
        userEmail: 'manager@example.com',
        phoneNum: '0501234567',
      };

      mockedBcrypt.genSalt.mockResolvedValue('salt' as never);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockRepository.create.mockReturnValue(createManagerDto);

      const createdManager = {
        uid: 'manager-123',
        ...createManagerDto,
        role: Role.FIELD_MANAGER,
        pass: 'hashedPassword',
      };

      mockRepository.save.mockResolvedValue(createdManager);

      const result = await service.createManager(createManagerDto);

      expect(result).toEqual(createdManager);
      expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(10);
      // The service generates a random password, so we expect any string
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        expect.any(String),
        'salt',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(createManagerDto);
      expect(mockRepository.save).toHaveBeenCalledWith({
        pass: 'hashedPassword',
        ...createManagerDto,
        role: Role.FIELD_MANAGER,
      });
    });
  });
});
