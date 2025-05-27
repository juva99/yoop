import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldsService } from './fields.service';
import { Field } from './fields.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { City } from '../enums/city.enum';
import { GameType } from '../enums/game-type.enum';

describe('FieldsService', () => {
  let service: FieldsService;
  let fieldRepository: Repository<Field>;
  let usersService: UsersService;
  const mockField: Field = {
    fieldId: 'field-123',
    fieldName: 'Central Park Football Field',
    fieldAddress: '123 Park Avenue, New York',
    fieldLat: 40.7829,
    fieldLng: -73.9654,
    gameTypes: [GameType.FootBall],
    city: City.TEL_AVIV_YAFO,
    isManaged: false,
    fieldPhoto: 'photo-url.jpg',
    manager: null,
    gamesInField: [],
  };

  const mockUser = {
    uid: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    userEmail: 'john@example.com',
    fieldsManage: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldsService,
        {
          provide: getRepositoryToken(Field),
          useValue: mockRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<FieldsService>(FieldsService);
    fieldRepository = module.get<Repository<Field>>(getRepositoryToken(Field));
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all fields', async () => {
      const fields = [mockField];
      mockRepository.find.mockResolvedValue(fields);

      const result = await service.findAll();

      expect(result).toEqual(fields);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no fields found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
  describe('findById', () => {
    it('should return a field when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockField);

      const result = await service.findById('field-123');

      expect(result).toEqual(mockField);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { fieldId: 'field-123' },
      });
    });

    it('should throw NotFoundException when field not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { fieldId: 'non-existent-id' },
      });
    });
  });
  describe('create', () => {
    const createFieldDto: CreateFieldDto = {
      fieldName: 'New Football Field',
      fieldAddress: '456 Sports Avenue, City',
      fieldLat: 40.7580,
      fieldLng: -73.9855,
      gameTypes: [GameType.FootBall],
      city: City.TEL_AVIV_YAFO,
      isManaged: false,
      fieldPhoto: 'new-photo.jpg',
    };

    it('should create a field successfully', async () => {
      const createdField = { ...mockField, ...createFieldDto };
      mockRepository.create.mockReturnValue(createdField);
      mockRepository.save.mockResolvedValue(createdField);

      const result = await service.create(createFieldDto);

      expect(result).toEqual(createdField);
      expect(mockRepository.create).toHaveBeenCalledWith(createFieldDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdField);
    });

    it('should handle repository errors', async () => {
      mockRepository.create.mockReturnValue(mockField);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createFieldDto)).rejects.toThrow('Database error');
    });
  });

  describe('createMany', () => {
    const createFieldDtos: CreateFieldDto[] = [
      {
        fieldName: 'Field 1',
        fieldAddress: 'Address 1',
        fieldLat: 40.7580,
        fieldLng: -73.9855,
        gameTypes: [GameType.FootBall],
        city: City.TEL_AVIV_YAFO,
        isManaged: false,
      },
      {
        fieldName: 'Field 2',
        fieldAddress: 'Address 2',
        fieldLat: 40.7590,
        fieldLng: -73.9865,
        gameTypes: [GameType.BasketBall],
        city: City.TEL_AVIV_YAFO,
        isManaged: true,
      },
    ];

    it('should create multiple fields successfully', async () => {
      const createdFields = createFieldDtos.map((dto, index) => ({ ...mockField, ...dto, fieldId: `field-${index}` }));
      mockRepository.create.mockReturnValue(createdFields);
      mockRepository.save.mockResolvedValue(createdFields);

      const result = await service.createMany(createFieldDtos);

      expect(result).toEqual(createdFields);
      expect(mockRepository.create).toHaveBeenCalledWith(createFieldDtos);
      expect(mockRepository.save).toHaveBeenCalledWith(createdFields);
    });
  });

  describe('findByCity', () => {
    it('should return fields in specified city', async () => {
      const cityFields = [mockField];
      mockRepository.find.mockResolvedValue(cityFields);

      const result = await service.findByCity('TEL_AVIV_YAFO');

      expect(result).toEqual(cityFields);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { city: City.TEL_AVIV_YAFO },
      });
    });

    it('should throw NotFoundException when no fields found in city', async () => {
      mockRepository.find.mockResolvedValue([]);

      await expect(
        service.findByCity('TEL_AVIV_YAFO'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete a field successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteOne('field-123');

      expect(mockRepository.delete).toHaveBeenCalledWith('field-123');
    });

    it('should throw NotFoundException when field not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setManagerToField', () => {
    it('should set manager to field successfully', async () => {
      const fieldWithManager = { ...mockField, isManaged: true, manager: mockUser };
      mockRepository.findOne.mockResolvedValue(mockField);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(fieldWithManager);

      const result = await service.setManagerToField('field-123', 'user-123');

      expect(result).toEqual(fieldWithManager);
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-123');
      expect(mockRepository.save).toHaveBeenCalledWith(fieldWithManager);
    });
  });

  describe('setFieldPublic', () => {
    it('should set field as public successfully', async () => {
      const managedField = { ...mockField, isManaged: true, manager: mockUser };
      const publicField = { ...mockField, isManaged: false, manager: null };
      mockRepository.findOne.mockResolvedValue(managedField);
      mockRepository.save.mockResolvedValue(publicField);

      const result = await service.setFieldPublic('field-123');

      expect(result).toEqual(publicField);
      expect(mockRepository.save).toHaveBeenCalledWith(publicField);
    });
  });

  describe('getFieldsByUser', () => {
    it('should return fields managed by user', async () => {
      const userFields = [mockField];
      mockRepository.find.mockResolvedValue(userFields);

      const result = await service.getFieldsByUser('user-123');

      expect(result).toEqual(userFields);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { manager: { uid: 'user-123' } },
      });
    });
  });
});
