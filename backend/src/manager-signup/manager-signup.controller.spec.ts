import { Test, TestingModule } from '@nestjs/testing';
import { ManagerSignupController } from './manager-signup.controller';
import { ManagerSignupService } from './manager-signup.service';
import { ManagerContactDto } from './dto/manager-contact.dto';
import { ManagerSignup } from './manager-signup.entity';

describe('ManagerSignupController', () => {
  let controller: ManagerSignupController;
  let managerSignupService: ManagerSignupService;
  const mockManagerSignup: ManagerSignup = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Manager',
    email: 'john.manager@example.com',
    phoneNum: '+972501234567',
    message: 'I have experience managing sports facilities for 5 years',
  } as ManagerSignup;

  const mockManagerSignups: ManagerSignup[] = [
    mockManagerSignup,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      firstName: 'Jane',
      lastName: 'Administrator',
      email: 'jane.admin@example.com',
      phoneNum: '+972502345678',
      message: 'Sports management background with certification',
    } as ManagerSignup,
  ];

  const mockManagerSignupService = {
    getAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerSignupController],
      providers: [
        {
          provide: ManagerSignupService,
          useValue: mockManagerSignupService,
        },
      ],
    }).compile();

    controller = module.get<ManagerSignupController>(ManagerSignupController);
    managerSignupService = module.get<ManagerSignupService>(ManagerSignupService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all manager signups', async () => {
      mockManagerSignupService.getAll.mockResolvedValue(mockManagerSignups);

      const result = await controller.getAll();

      expect(result).toEqual(mockManagerSignups);
      expect(mockManagerSignupService.getAll).toHaveBeenCalled();
    });

    it('should return empty array when no signups exist', async () => {
      mockManagerSignupService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(mockManagerSignupService.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a manager signup by id', async () => {
      mockManagerSignupService.findById.mockResolvedValue(mockManagerSignup);

      const result = await controller.getById(mockManagerSignup.id);

      expect(result).toEqual(mockManagerSignup);
      expect(mockManagerSignupService.findById).toHaveBeenCalledWith(mockManagerSignup.id);
    });

    it('should handle non-existent signup', async () => {
      mockManagerSignupService.findById.mockRejectedValue(new Error('Manager signup not found'));

      await expect(controller.getById('non-existent-id')).rejects.toThrow('Manager signup not found');
    });
  });

  describe('create', () => {    it('should create a new manager signup', async () => {
      const managerContactDto: ManagerContactDto = {
        firstName: 'Alice',
        lastName: 'NewManager',
        email: 'alice.newmanager@example.com',
        phoneNum: '+972503456789',
        message: 'New to field management but eager to learn',
      };

      const createdSignup = { ...mockManagerSignup, ...managerContactDto };
      mockManagerSignupService.create.mockResolvedValue(createdSignup);

      const result = await controller.create(managerContactDto);

      expect(result).toEqual(createdSignup);
      expect(mockManagerSignupService.create).toHaveBeenCalledWith(managerContactDto);
    });

    it('should handle creation errors', async () => {
      const invalidDto: ManagerContactDto = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        phoneNum: 'invalid-phone',
        message: '',
      };

      mockManagerSignupService.create.mockRejectedValue(new Error('Invalid signup data'));

      await expect(controller.create(invalidDto)).rejects.toThrow('Invalid signup data');
    });

    it('should handle duplicate email registration', async () => {
      const duplicateDto: ManagerContactDto = {
        firstName: 'John',
        lastName: 'Duplicate',
        email: mockManagerSignup.email,
        phoneNum: '+972504567890',
        message: 'Some experience in field management',
      };

      mockManagerSignupService.create.mockRejectedValue(new Error('Email already registered'));

      await expect(controller.create(duplicateDto)).rejects.toThrow('Email already registered');
    });
  });

  describe('deleteContact', () => {
    it('should delete a manager signup by id', async () => {
      mockManagerSignupService.delete.mockResolvedValue(undefined);

      const result = await controller.deleteContact(mockManagerSignup.id);

      expect(result).toBeUndefined();
      expect(mockManagerSignupService.delete).toHaveBeenCalledWith(mockManagerSignup.id);
    });

    it('should handle deletion of non-existent signup', async () => {
      mockManagerSignupService.delete.mockRejectedValue(new Error('Manager signup not found'));

      await expect(controller.deleteContact('non-existent-id')).rejects.toThrow('Manager signup not found');
    });
  });
});
