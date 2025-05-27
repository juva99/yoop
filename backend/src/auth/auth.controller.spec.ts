import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Role } from '../enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    uid: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: Role.USER,
  };
  const mockAuthService = {
    login: jest.fn(),
    signOut: jest.fn(),
    refreshToken: jest.fn(),
    registerUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RefreshAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const tokens = {
        access_token: 'access.token.here',
        refresh_token: 'refresh.token.here',
      };
      
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(mockUser as any);

      expect(result).toEqual(tokens);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      mockAuthService.signOut.mockResolvedValue(undefined);

      const result = await controller.signOut(mockUser as any);

      expect(result).toBeUndefined();
      expect(mockAuthService.signOut).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens', async () => {
      const newTokens = {
        access_token: 'new.access.token',
        refresh_token: 'new.refresh.token',
      };
      
      const req = {
        user: {
          ...mockUser,
          refreshToken: 'old.refresh.token',
        },
      };      mockAuthService.refreshToken.mockResolvedValue(newTokens);

      const result = await controller.refreshToken(req as any);

      expect(result).toEqual(newTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        mockUser.uid,
        mockUser.role,
        'John Doe',
      );
    });  });
});
