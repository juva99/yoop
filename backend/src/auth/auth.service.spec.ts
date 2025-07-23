import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/enums/role.enum';
import { MailService } from 'src/mail/mail.service';
import { ManagerSignupService } from 'src/manager-signup/manager-signup.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
import refreshConfig from 'src/auth/config/refresh.config';
import * as bcrypt from 'bcrypt';
import { CreateManagerDto } from 'src/users/dto/create-manager.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

describe('AuthService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let mailService: MailService;
  let managerSignupService: ManagerSignupService;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateRefreshToken: jest.fn(),
      createPasswordResetToken: jest.fn(),
      createManager: jest.fn(),
    };

    const mockManagerSignupService = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const mockMailService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordReset: jest.fn(),
      sendManagerInvite: jest.fn(),
    };

    const mockRefreshConfig = {
      secret: 'test-refresh-secret',
      expiresIn: '7d',
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ManagerSignupService,
          useValue: mockManagerSignupService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: refreshConfig.KEY,
          useValue: mockRefreshConfig,
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
    authService = moduleRef.get(AuthService);
    mailService = moduleRef.get(MailService);
    managerSignupService = moduleRef.get(ManagerSignupService);

    jest.clearAllMocks();
  });

  const userRes = {
    uid: 'test-uid',
    firstName: 'Leo',
    lastName: 'Messi',
    pass: 'hashedPassword',
    userEmail: 'bestplayer@fifa.com',
    birthDay: '2000-01-01',
    isMale: true,
    address: 'Miami',
    profilePic: null,
    phoneNum: '0522221111',
    role: Role.USER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    groupMemberIn: [],
  };

  const managerRes = {
    uid: 'test-uid',
    firstName: 'Leo',
    lastName: 'Messi',
    pass: 'hashedPassword',
    userEmail: 'bestplayer@fifa.com',
    birthDay: '2000-01-01',
    isMale: true,
    address: 'Miami',
    profilePic: null,
    phoneNum: '0522221111',
    role: Role.FIELD_MANAGER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    groupMemberIn: [],
  };

  // test register
  describe('registerUser', () => {
    const userDto = {
      firstName: 'Leo',
      lastName: 'Messi',
      pass: 'Aa12345678!',
      passConfirm: 'Aa12345678!',
      userEmail: 'bestPlayer@FIFA.com',
      birthDay: '2000-01-01',
      address: 'Miami',
      phoneNum: '0522221111',
    } as CreateUserDto;

    it('Should return a user object ', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(userRes);

      const result = await authService.registerUser(userDto);

      expect(result).toEqual(userRes);
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'bestplayer@fifa.com',
      );
      expect(usersService.create).toHaveBeenCalled();
    });

    it('Should throw ConflictException when user already exists ', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(userRes);

      await expect(authService.registerUser(userDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'bestplayer@fifa.com',
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  // test validateLocalUser
  describe('validateLocalUser', () => {
    const password = userRes.pass;
    const hashedPasswod = 'hashedPassword';
    const email = userRes.userEmail;
    const lowerEmail = 'bestplayer@fifa.com';
    it('Should return a user uid, fullname and role', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(userRes);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateLocalUser(email, password),
      ).resolves.toEqual({
        uid: userRes.uid,
        name: `${userRes.firstName} ${userRes.lastName}`,
        role: userRes.role,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(lowerEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPasswod);
    });

    it('Should throw unauthorized exception when user email is wrong', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateLocalUser(email, password),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(lowerEmail);
      expect(bcrypt.compare).not.toHaveBeenCalledWith();
    });

    it('Should throw unauthorized exception when user password is wrong', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(userRes);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateLocalUser(email, password),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(lowerEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPasswod);
    });
  });

  // test login
  describe('login', () => {
    it('Should return authenticatedUser values - uid, name, role, access and refresh tokens', async () => {
      const userLogin = {
        uid: 'user-id',
        role: Role.USER,
        name: 'Leo Messi',
      };

      const mockTokens = {
        accessToken: 'a-token',
        refreshToken: 'r-token',
      };

      jest.spyOn(authService, 'generateTokens').mockResolvedValue(mockTokens);

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('saltMock');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedRefreshToken');

      (usersService.updateRefreshToken as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        authService.login(userLogin.uid, userLogin.role, userLogin.name),
      ).resolves.toEqual({
        uid: userLogin.uid,
        name: userLogin.name,
        role: userLogin.role,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });

      expect(authService.generateTokens).toHaveBeenCalledWith(userLogin.uid);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockTokens.refreshToken,
        'saltMock',
      );
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        userLogin.uid,
        'hashedRefreshToken',
      );
    });
  });

  // test refreshToken
  describe('refreshToken', () => {
    it('Should return authenticatedUser values - uid, name, role, access and refresh tokens', async () => {
      const userLogin = {
        uid: 'user-id',
        role: Role.USER,
        name: 'Leo Messi',
      };

      const mockTokens = {
        accessToken: 'a-token',
        refreshToken: 'r-token',
      };

      jest.spyOn(authService, 'generateTokens').mockResolvedValue(mockTokens);

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('saltMock');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedRefreshToken');

      (usersService.updateRefreshToken as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        authService.refreshToken(userLogin.uid, userLogin.role, userLogin.name),
      ).resolves.toEqual({
        uid: userLogin.uid,
        name: userLogin.name,
        role: userLogin.role,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });

      expect(authService.generateTokens).toHaveBeenCalledWith(userLogin.uid);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockTokens.refreshToken,
        'saltMock',
      );
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        userLogin.uid,
        'hashedRefreshToken',
      );
    });
  });

  // test forgot password
  describe('forgotPassword', () => {
    it('Should call necessary services and send reset email', async () => {
      const email = userRes.userEmail;
      const token = 'reset-token';
      (usersService.findByEmail as jest.Mock).mockResolvedValue(userRes);
      (usersService.createPasswordResetToken as jest.Mock).mockResolvedValue(
        token,
      );
      (mailService.sendPasswordReset as jest.Mock).mockResolvedValue(undefined);

      expect(await authService.forgotPassword(email)).toBeUndefined();
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        email.toLowerCase(),
      );
      expect(usersService.createPasswordResetToken).toHaveBeenCalledWith(
        userRes.uid,
        1,
      );
      expect(mailService.sendPasswordReset).toHaveBeenCalledWith(
        userRes.userEmail,
        token,
        userRes.firstName,
      );
    });

    it('Should throw NotFoundException when user not found', async () => {
      const email = 'email@doesNotExist.com';
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.forgotPassword(email)).rejects.toThrow(
        `user with email address${email} not found`,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        email.toLowerCase(),
      );
      expect(usersService.createPasswordResetToken).not.toHaveBeenCalled();
      expect(mailService.sendPasswordReset).not.toHaveBeenCalled();
    });
  });

  // test approve manager
  describe('approve manager', () => {
    it('Should create manager, delete signup request and return user', async () => {
      const managerSignup = {
        uid: 'test-uid',
        firstName: 'Leo',
        lastName: 'Messi',
        email: 'bestPlayer@FIFA.com',
        phoneNum: '0522221111',
        message: "Please approve me i'm best player!",
      };

      const createManagerDto = {
        firstName: managerSignup.firstName,
        lastName: managerSignup.lastName,
        userEmail: managerSignup.email,
        phoneNum: managerSignup.phoneNum,
      } as CreateManagerDto;

      const token = 'reset-token';

      (managerSignupService.findById as jest.Mock).mockResolvedValue(
        managerSignup,
      );
      (usersService.createManager as jest.Mock).mockResolvedValue(managerRes);
      (usersService.createPasswordResetToken as jest.Mock).mockResolvedValue(
        token,
      );
      (mailService.sendManagerInvite as jest.Mock).mockResolvedValue(null);
      (managerSignupService.delete as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.approveManager(managerSignup.uid),
      ).resolves.toEqual(managerRes);
      expect(managerSignupService.findById).toHaveBeenCalledWith(
        managerSignup.uid,
      );
      expect(usersService.createManager).toHaveBeenCalledWith(createManagerDto);
      expect(usersService.createPasswordResetToken).toHaveBeenCalledWith(
        managerRes.uid,
        72,
      );
      expect(mailService.sendManagerInvite).toHaveBeenCalledWith(
        managerRes.userEmail,
        token,
        managerRes.firstName + ' ' + managerRes.lastName,
      );
      expect(managerSignupService.delete).toHaveBeenCalledWith(
        managerSignup.uid,
      );
    });
  });
});
