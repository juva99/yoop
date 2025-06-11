import { Test, TestingModule } from '@nestjs/testing';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { Field } from './fields.entity';
import { Role } from '../enums/role.enum';

describe('FieldsController', () => {
  let controller: FieldsController;
  let fieldsService: FieldsService;

  const mockField: Field = {
    fieldId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Central Football Field',
    address: '123 Main St, Berlin',
    city: 'Berlin',
    latitude: 52.52,
    longitude: 13.405,
    isPublic: true,
    price: 50,
    manager: {
      uid: 'manager-123',
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      role: Role.FIELD_MANAGER,
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Field;

  const mockFields: Field[] = [
    mockField,
    {
      fieldId: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Sports Complex Field',
      address: '456 Sports Ave, Munich',
      city: 'Munich',
      latitude: 48.1351,
      longitude: 11.582,
      isPublic: false,
      price: 75,
      manager: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Field,
  ];

  const mockFieldsService = {
    findAll: jest.fn(),
    findByCity: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    setManagerToField: jest.fn(),
    setFieldPublic: jest.fn(),
    getFieldsByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldsController],
      providers: [
        {
          provide: FieldsService,
          useValue: mockFieldsService,
        },
      ],
    }).compile();

    controller = module.get<FieldsController>(FieldsController);
    fieldsService = module.get<FieldsService>(FieldsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all fields', async () => {
      mockFieldsService.findAll.mockResolvedValue(mockFields);

      const result = await controller.getAll();

      expect(result).toEqual(mockFields);
      expect(mockFieldsService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no fields exist', async () => {
      mockFieldsService.findAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(mockFieldsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getByCity', () => {
    it('should return fields in specified city', async () => {
      const city = 'Berlin';
      const berlinFields = [mockFields[0]];

      mockFieldsService.findByCity.mockResolvedValue(berlinFields);

      const result = await controller.getByCity(city);

      expect(result).toEqual(berlinFields);
      expect(mockFieldsService.findByCity).toHaveBeenCalledWith(city);
    });

    it('should return empty array when no fields in city', async () => {
      const city = 'Hamburg';

      mockFieldsService.findByCity.mockResolvedValue([]);

      const result = await controller.getByCity(city);

      expect(result).toEqual([]);
      expect(mockFieldsService.findByCity).toHaveBeenCalledWith(city);
    });
  });

  describe('getById', () => {
    it('should return a field by id', async () => {
      mockFieldsService.findById.mockResolvedValue(mockField);

      const result = await controller.getById(mockField.fieldId);

      expect(result).toEqual(mockField);
      expect(mockFieldsService.findById).toHaveBeenCalledWith(
        mockField.fieldId,
      );
    });

    it('should handle non-existent field', async () => {
      mockFieldsService.findById.mockRejectedValue(
        new Error('Field not found'),
      );

      await expect(controller.getById('non-existent-id')).rejects.toThrow(
        'Field not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new field', async () => {
      const createFieldDto: CreateFieldDto = {
        name: 'New Football Field',
        address: '789 New St, Frankfurt',
        city: 'Frankfurt',
        latitude: 50.1109,
        longitude: 8.6821,
        price: 60,
      };

      const createdField = { ...mockField, ...createFieldDto };
      mockFieldsService.create.mockResolvedValue(createdField);

      const result = await controller.create(createFieldDto);

      expect(result).toEqual(createdField);
      expect(mockFieldsService.create).toHaveBeenCalledWith(createFieldDto);
    });

    it('should handle creation errors', async () => {
      const createFieldDto: CreateFieldDto = {
        name: '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
        price: -10,
      };

      mockFieldsService.create.mockRejectedValue(
        new Error('Invalid field data'),
      );

      await expect(controller.create(createFieldDto)).rejects.toThrow(
        'Invalid field data',
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a field by id', async () => {
      mockFieldsService.deleteOne.mockResolvedValue(undefined);

      const result = await controller.deleteOne(mockField.fieldId);

      expect(result).toBeUndefined();
      expect(mockFieldsService.deleteOne).toHaveBeenCalledWith(
        mockField.fieldId,
      );
    });

    it('should handle deletion of non-existent field', async () => {
      mockFieldsService.deleteOne.mockRejectedValue(
        new Error('Field not found'),
      );

      await expect(controller.deleteOne('non-existent-id')).rejects.toThrow(
        'Field not found',
      );
    });
  });

  describe('setManagerToField', () => {
    it('should assign a manager to a field', async () => {
      const fieldId = mockField.fieldId;
      const userId = 'manager-456';

      const updatedField = {
        ...mockField,
        manager: { uid: userId, role: Role.FIELD_MANAGER } as any,
      };

      mockFieldsService.setManagerToField.mockResolvedValue(updatedField);

      const result = await controller.setManagerToField(fieldId, userId);

      expect(result).toEqual(updatedField);
      expect(mockFieldsService.setManagerToField).toHaveBeenCalledWith(
        fieldId,
        userId,
      );
    });

    it('should handle invalid field or user', async () => {
      mockFieldsService.setManagerToField.mockRejectedValue(
        new Error('Field or user not found'),
      );

      await expect(
        controller.setManagerToField('invalid-field', 'invalid-user'),
      ).rejects.toThrow('Field or user not found');
    });
  });

  describe('setFieldPublic', () => {
    it('should set a field as public', async () => {
      const fieldId = mockField.fieldId;
      const publicField = { ...mockField, isPublic: true };

      mockFieldsService.setFieldPublic.mockResolvedValue(publicField);

      const result = await controller.setFieldPublic(fieldId);

      expect(result).toEqual(publicField);
      expect(mockFieldsService.setFieldPublic).toHaveBeenCalledWith(fieldId);
    });

    it('should handle non-existent field', async () => {
      mockFieldsService.setFieldPublic.mockRejectedValue(
        new Error('Field not found'),
      );

      await expect(
        controller.setFieldPublic('non-existent-id'),
      ).rejects.toThrow('Field not found');
    });
  });

  describe('getFieldsByUser', () => {
    it('should return fields managed by a user', async () => {
      const userId = 'manager-123';
      const userFields = [mockField];

      mockFieldsService.getFieldsByUser.mockResolvedValue(userFields);

      const result = await controller.getFieldsByUser(userId);

      expect(result).toEqual(userFields);
      expect(mockFieldsService.getFieldsByUser).toHaveBeenCalledWith(userId);
    });

    it('should return empty array when user manages no fields', async () => {
      const userId = 'user-with-no-fields';

      mockFieldsService.getFieldsByUser.mockResolvedValue([]);

      const result = await controller.getFieldsByUser(userId);

      expect(result).toEqual([]);
      expect(mockFieldsService.getFieldsByUser).toHaveBeenCalledWith(userId);
    });
  });
});
