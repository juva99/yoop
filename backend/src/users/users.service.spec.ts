import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Role } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
  createHash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    uid: 'test-uid',
    firstName: 'יוסי',
    lastName: 'כהן',
    pass: 'hashedPassword',
    userEmail: 'yossi.cohen@example.com',
    birthDay: '1990-01-01',
    isMale: true,
    address: 'רחוב הרצל 15, תל אביב',
    profilePic: null,
    phoneNum: '0521234567',
    role: Role.USER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    passwordResetExpires: undefined,
    hashedRefreshToken: null,
    groupMemberIn: [],
  };

  const mockCreateUserDto: CreateUserDto = {
    firstName: 'דני',
    lastName: 'לוי',
    pass: 'Password123!',
    passConfirm: 'Password123!',
    userEmail: 'danny.levy@example.com',
    birthDay: '1990-01-01',
    address: 'רחוב בן יהודה 22, ירושלים',
    phoneNum: '0521234567',
    role: Role.USER,
  };

  const mockCreateManagerDto: CreateManagerDto = {
    firstName: 'אבי',
    lastName: 'פרידמן',
    userEmail: 'avi.friedman@example.com',
    phoneNum: '0521234567',
    address: 'שדרות רוטשילד 45, תל אביב',
    profilePic: undefined,
  };

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

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
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    });

    it('should create a new user successfully', async () => {
      const createdUser = { ...mockCreateUserDto };
      jest.spyOn(repository, 'create').mockReturnValue(createdUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserDto.pass, 'salt');
      expect(repository.create).toHaveBeenCalledWith(mockCreateUserDto);

      const { pass: originalPass, ...userWithoutPass } = createdUser;
      expect(repository.save).toHaveBeenCalledWith({
        pass: 'hashedPassword',
        ...userWithoutPass,
        role: Role.USER,
      });
    });

    it('should throw HttpException when passwords do not match', async () => {
      const invalidDto = {
        ...mockCreateUserDto,
        passConfirm: 'DifferentPassword!',
      };

      await expect(service.create(invalidDto)).rejects.toThrow(
        'Conifrm pass is not equal to password',
      );

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw error when repository save fails', async () => {
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(mockCreateUserDto as any);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete user successfully', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteOne('test-uid');

      expect(repository.delete).toHaveBeenCalledWith('test-uid');
    });

    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.deleteOne('non-existent-uid')).rejects.toThrow(
        new NotFoundException('user with id non-existent-uid not found'),
      );
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findById('test-uid');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { uid: 'test-uid' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById('non-existent-uid')).rejects.toThrow(
        new NotFoundException('User with id non-existent-uid not found'),
      );
    });
  });

  describe('findByIds', () => {
    it('should return users when found', async () => {
      const users = [mockUser];
      const uids = ['test-uid'];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findByIds(uids);

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalledWith({
        where: { uid: expect.any(Object) },
      });
    });

    it('should throw NotFoundException when no users found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(undefined as any);

      await expect(service.findByIds(['non-existent-uid'])).rejects.toThrow(
        new NotFoundException('אף משתמש לא נמצא'),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user with password and refresh token when found', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findByEmail('yossi.cohen@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith([
        'user.pass',
        'user.hashedRefreshToken',
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.userEmail = :email',
        { email: 'yossi.cohen@example.com' },
      );
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findByEmail('non-existent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token successfully', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await service.updateRefreshToken('test-uid', 'hashed-refresh-token');

      expect(repository.update).toHaveBeenCalledWith(
        { uid: 'test-uid' },
        { hashedRefreshToken: 'hashed-refresh-token' },
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedFields = { firstName: 'משה' };
      const updatedUser = { ...mockUser, ...updatedFields };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      const result = await service.updateUser('test-uid', updatedFields);

      expect(result).toEqual(updatedUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ uid: 'test-uid' });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updatedFields,
      });
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.updateUser('non-existent-uid', { firstName: 'רחל' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('createPasswordResetToken', () => {
    beforeEach(() => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed-token'),
      };
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn().mockReturnValue('random-token'),
      });
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);
    });

    it('should create password reset token successfully', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await service.createPasswordResetToken('test-uid', 24);

      expect(result).toBe('random-token');
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(repository.update).toHaveBeenCalledWith(
        { uid: 'test-uid' },
        {
          passwordResetToken: 'hashed-token',
          passwordResetExpires: expect.any(Date),
        },
      );
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed-token'),
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
    });

    it('should change password successfully with valid token', async () => {
      const userWithResetToken = {
        ...mockUser,
        passwordResetToken: 'hashed-token',
        passwordResetExpires: new Date(Date.now() + 3600000),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(userWithResetToken);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await service.changePassword('reset-token', 'NewPassword123!');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          passwordResetToken: 'hashed-token',
          passwordResetExpires: expect.any(Object),
        },
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 'salt');
      expect(repository.update).toHaveBeenCalledWith(userWithResetToken.uid, {
        pass: 'new-hashed-password',
        passwordResetToken: null,
        hashedRefreshToken: null,
      });
    });

    it('should throw NotFoundException with invalid token', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.changePassword('invalid-token', 'NewPassword123!'),
      ).rejects.toThrow(
        new NotFoundException("password reset token isn't valid"),
      );
    });
  });

  describe('createManager', () => {
    beforeEach(() => {
      const mockRandomBytes = {
        toString: jest.fn().mockReturnValue('randomPassword123ABAfsdefsd'),
        replace: jest.fn().mockReturnValue('randomPassword123'),
        slice: jest.fn().mockReturnValue('randomPasswo'),
      };
      (crypto.randomBytes as jest.Mock).mockReturnValue(mockRandomBytes);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-random-password');
    });

    it('should create manager with random password', async () => {
      const managerUser = { ...mockUser, role: Role.FIELD_MANAGER };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(mockCreateManagerDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(managerUser);

      const result = await service.createManager(mockCreateManagerDto);

      expect(result).toEqual(managerUser);
      expect(crypto.randomBytes).toHaveBeenCalledWith(Math.ceil(12 * 1.5));
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('randomPasswo', 'salt');
      expect(repository.save).toHaveBeenCalledWith({
        pass: 'hashed-random-password',
        ...mockCreateManagerDto,
        role: Role.FIELD_MANAGER,
      });
    });
  });

  describe('updateProfilePicture', () => {
    it('should update profile picture successfully', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await service.updateProfilePicture(
        'test-uid',
        'new-profile-pic-url',
      );

      expect(result).toBe(1);
      expect(repository.update).toHaveBeenCalledWith(
        { uid: 'test-uid' },
        { profilePic: 'new-profile-pic-url' },
      );
    });

    it('should set profile picture to null when undefined provided', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await service.updateProfilePicture('test-uid', undefined);

      expect(result).toBe(1);
      expect(repository.update).toHaveBeenCalledWith(
        { uid: 'test-uid' },
        { profilePic: null },
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });

      await expect(
        service.updateProfilePicture('non-existent-uid', 'pic-url'),
      ).rejects.toThrow(
        new NotFoundException('user with id non-existent-uid not found'),
      );
    });
  });

  describe('findByName', () => {
    it('should return users matching name search excluding current user and friends', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
        subQuery: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue('subquery'),
      };

      const mockSubQueryBuilder = {
        subQuery: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getQuery: jest.fn().mockReturnValue('subquery'),
        }),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any)
        .mockReturnValueOnce(mockSubQueryBuilder as any);

      const currentUser = { ...mockUser, uid: 'current-user-uid' };
      const result = await service.findByName('יוסי', currentUser);

      expect(result).toEqual([mockUser]);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(user.firstName ILIKE :name OR user.lastName ILIKE :name)',
        { name: '%יוסי%' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.uid != :currentUserId',
        {
          currentUserId: 'current-user-uid',
        },
      );
    });

    it('should return users matching last name search', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
        subQuery: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue('subquery'),
      };

      const mockSubQueryBuilder = {
        subQuery: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getQuery: jest.fn().mockReturnValue('subquery'),
        }),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any)
        .mockReturnValueOnce(mockSubQueryBuilder as any);

      const currentUser = {
        ...mockUser,
        uid: 'current-user-uid',
        firstName: 'שרה',
        lastName: 'אברהם',
      };
      const result = await service.findByName('כהן', currentUser);

      expect(result).toEqual([mockUser]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(user.firstName ILIKE :name OR user.lastName ILIKE :name)',
        { name: '%כהן%' },
      );
    });
  });
});
