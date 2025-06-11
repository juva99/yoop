import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    uid: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    pass: 'hashedPassword',
    role: Role.USER,
    refreshToken: null,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
    mockedBcrypt.compare.mockResolvedValue(true as never);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateLocalUser(
        'john@example.com',
        'password123',
      );

      expect(result).toEqual({
        uid: mockUser.uid,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateLocalUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateLocalUser(
        'john@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword',
      );
    });
  });

  describe('login', () => {
    const mockPayload = {
      uid: mockUser.uid,
      email: mockUser.email,
      role: mockUser.role,
    };

    it('should return access and refresh tokens', async () => {
      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      mockConfigService.get
        .mockReturnValueOnce('access-secret')
        .mockReturnValueOnce('15m')
        .mockReturnValueOnce('refresh-secret')
        .mockReturnValueOnce('7d');

      const result = await service.login(
        mockUser.uid,
        mockUser.role,
        mockUser.firstName,
      );

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.uid,
        refreshToken,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const oldRefreshToken = 'old.refresh.token';
      const newAccessToken = 'new.access.token';
      const newRefreshToken = 'new.refresh.token';

      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: oldRefreshToken,
      });

      mockedBcrypt.compare.mockResolvedValue(true as never);

      mockJwtService.signAsync
        .mockResolvedValueOnce(newAccessToken)
        .mockResolvedValueOnce(newRefreshToken);

      const result = await service.refreshToken(
        mockUser.uid,
        mockUser.role,
        mockUser.firstName,
      );

      expect(result).toEqual({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.refreshToken('non-existent-id', Role.USER),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token does not match', async () => {
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: 'stored.refresh.token',
      });

      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        service.refreshToken(mockUser.uid, Role.USER),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('signOut', () => {
    it('should clear refresh token', async () => {
      await service.signOut(mockUser.uid);

      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.uid,
        'null',
      );
    });
  });
});
