import { Test, TestingModule } from '@nestjs/testing';
import { ManagerSignupService } from './manager-signup.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.entity';
import { Role } from '../enums/role.enum';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ManagerContactDto } from './dto/manager-contact.dto';

// Mock the external services
jest.mock('../users/users.service');
jest.mock('../mail/mail.service');
// jest.mock('@nestjs/config'); // ConfigService is often used for env vars, can be mocked if needed

describe('ManagerSignupService', () => {
  let service: ManagerSignupService;
  let usersService: jest.Mocked<UsersService>;
  let mailService: jest.Mocked<MailService>;
  // let configService: jest.Mocked<ConfigService>;

  const mockCreateManagerDto: ManagerContactDto = {
    email: 'manager@example.com',
    firstName: 'Test',
    lastName: 'Manager',
    phoneNum: '1234567890',
    message: 'I want to be a manager',
  };

  const mockManagerUser: User = {
    uid: 'manager-uid-123',
    userEmail: 'manager@example.com',
    firstName: 'Test',
    lastName: 'Manager',
    phoneNum: '1234567890',
    role: Role.FIELD_MANAGER,
    pass: 'hashedPassword', // Usually set by UsersService
    // ... other user fields
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagerSignupService,
        UsersService, // Use the mocked version
        MailService,  // Use the mocked version
        // { provide: ConfigService, useValue: { get: jest.fn() } }, // Example if ConfigService is used
      ],
    }).compile();

    service = module.get<ManagerSignupService>(ManagerSignupService);
    usersService = module.get(UsersService);
    mailService = module.get(MailService);
    // configService = module.get(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully sign up a manager and send an invite email', async () => {
      usersService.createManager.mockResolvedValue(mockManagerUser);
      mailService.sendManagerInvite.mockResolvedValue(undefined); // Assuming it returns void or some success indicator

      const result = await service.create(mockCreateManagerDto);

      expect(usersService.createManager).toHaveBeenCalledWith(mockCreateManagerDto);
      expect(mailService.sendManagerInvite).toHaveBeenCalledWith(
        mockManagerUser.userEmail,
        expect.any(String), // For the generated token
        `${mockManagerUser.firstName} ${mockManagerUser.lastName}`,
      );
      expect(result).toEqual(mockManagerUser);
    });
    

    // Add more tests if there's specific token generation logic to test, or other edge cases.
  });
});
