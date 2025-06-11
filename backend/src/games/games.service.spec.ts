import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameStatus } from '../enums/game-status.enum';
import { GameType } from '../enums/game-type.enum';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { GameParticipantsService } from '../game-participants/game-participants.service';
import { FieldsService } from '../fields/fields.service';
import { MailService } from '../mail/mail.service';
import { User } from '../users/users.entity';
import { Field } from '../fields/fields.entity';
import { ParticipationStatus } from '../enums/participation-status.enum';

describe('GamesService', () => {
  let service: GamesService;
  let gameRepository: Repository<Game>;
  let fieldsService: FieldsService;
  let gameParticipantsService: GameParticipantsService;
  let weatherApiService: WeatherApiService;
  let mailService: MailService;
  const mockGame: Game = {
    gameId: '123e4567-e89b-12d3-a456-426614174000',
    gameType: GameType.FootBall,
    startDate: new Date('2025-06-01T10:00:00Z'),
    endDate: new Date('2025-06-01T12:00:00Z'),
    maxParticipants: 10,
    field: { fieldId: 'test-field-id' } as any,
    price: 25,
    status: GameStatus.APPROVED,
    creator: { uid: 'test-creator-id' } as any,
    gameParticipants: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  const mockFieldsService = {
    findById: jest.fn(), // Changed from findByFieldId to findById
  };

  const mockGameParticipantsService = {
    joinGame: jest.fn(), // Added joinGame method
    findParticipantsByGameId: jest.fn(),
    addParticipant: jest.fn(),
  };

  const mockWeatherApiService = {
    getWeather: jest.fn(),
  };

  const mockMailService = {
    sendNewGameStatus: jest.fn(), // Added method used in service
    sendGameCancellationEmail: jest.fn(),
    sendGameConfirmationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockRepository,
        },
        {
          provide: FieldsService,
          useValue: mockFieldsService,
        },
        {
          provide: GameParticipantsService,
          useValue: mockGameParticipantsService,
        },
        {
          provide: WeatherApiService,
          useValue: mockWeatherApiService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    fieldsService = module.get<FieldsService>(FieldsService);
    gameParticipantsService = module.get<GameParticipantsService>(
      GameParticipantsService,
    );
    weatherApiService = module.get<WeatherApiService>(WeatherApiService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all approved games', async () => {
      const games = [mockGame];
      mockRepository.find.mockResolvedValue(games);

      const result = await service.findAll();

      expect(result).toEqual(games);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: GameStatus.APPROVED },
      });
    });

    it('should return empty array when no games found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a game when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockGame);

      const result = await service.findById(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual(mockGame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should throw NotFoundException when game not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: 'non-existent-id' },
      });
    });
  });

  describe('create', () => {
    const createGameDto: CreateGameDto = {
      gameType: GameType.FootBall,
      startDate: new Date('2025-06-01T10:00:00Z'),
      endDate: new Date('2025-06-01T12:00:00Z'),
      maxParticipants: 10,
      field: 'test-field-id',
      price: 25,
    };

    const mockUser: User = {
      uid: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      userEmail: 'john@example.com',
    } as User;

    const mockField: Field = {
      fieldId: 'test-field-id',
      fieldName: 'Test Field',
      isManaged: false,
      fieldLat: 32.0853,
      fieldLng: 34.7818,
    } as Field;

    const mockWeatherResponse = {
      temp_c: '25',
      condition: { text: 'Sunny', icon: 'sunny.png' },
    };

    it('should create a game successfully', async () => {
      mockFieldsService.findById.mockResolvedValue(mockField);
      mockWeatherApiService.getWeather.mockResolvedValue(mockWeatherResponse);

      const gameData = {
        gameType: createGameDto.gameType,
        startDate: createGameDto.startDate,
        endDate: createGameDto.endDate,
        maxParticipants: createGameDto.maxParticipants,
        creator: mockUser,
        field: mockField,
        status: GameStatus.APPROVED, // Because field.isManaged is false
        gameParticipants: [],
        weatherTemp: parseInt(mockWeatherResponse.temp_c),
        weatherCondition: mockWeatherResponse.condition.text,
        weatherIcon: mockWeatherResponse.condition.icon,
      };

      const createdGame = { ...gameData, gameId: 'new-game-id' };
      mockRepository.create.mockReturnValue(gameData);
      mockRepository.save.mockResolvedValue(createdGame);
      mockGameParticipantsService.joinGame.mockResolvedValue({} as any);

      const result = await service.create(createGameDto, mockUser);

      expect(mockFieldsService.findById).toHaveBeenCalledWith(
        createGameDto.field,
      );
      expect(mockWeatherApiService.getWeather).toHaveBeenCalledWith({
        lat: mockField.fieldLat,
        lon: mockField.fieldLng,
        dt: createGameDto.startDate.toISOString().split('T')[0],
        hour: parseInt(
          createGameDto.startDate.toISOString().split('T')[1].split(':')[0],
        ),
      });
      expect(mockRepository.create).toHaveBeenCalledWith(gameData);
      expect(mockRepository.save).toHaveBeenCalledWith(gameData);
      expect(mockGameParticipantsService.joinGame).toHaveBeenCalledWith(
        createdGame.gameId,
        mockUser,
        ParticipationStatus.APPROVED,
      );
      expect(result).toEqual(createdGame);
    });

    it('should create a game with PENDING status for managed field', async () => {
      const managedField = { ...mockField, isManaged: true };
      mockFieldsService.findById.mockResolvedValue(managedField);
      mockWeatherApiService.getWeather.mockResolvedValue(mockWeatherResponse);

      const gameData = {
        gameType: createGameDto.gameType,
        startDate: createGameDto.startDate,
        endDate: createGameDto.endDate,
        maxParticipants: createGameDto.maxParticipants,
        creator: mockUser,
        field: managedField,
        status: GameStatus.PENDING, // Because field.isManaged is true
        gameParticipants: [],
        weatherTemp: parseInt(mockWeatherResponse.temp_c),
        weatherCondition: mockWeatherResponse.condition.text,
        weatherIcon: mockWeatherResponse.condition.icon,
      };

      const createdGame = { ...gameData, gameId: 'new-game-id' };
      mockRepository.create.mockReturnValue(gameData);
      mockRepository.save.mockResolvedValue(createdGame);
      mockGameParticipantsService.joinGame.mockResolvedValue({} as any);

      const result = await service.create(createGameDto, mockUser);

      expect(result.status).toBe(GameStatus.PENDING);
    });

    it('should handle repository errors', async () => {
      mockFieldsService.findById.mockResolvedValue(mockField);
      mockWeatherApiService.getWeather.mockResolvedValue(mockWeatherResponse);
      mockRepository.create.mockReturnValue({} as any);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createGameDto, mockUser)).rejects.toThrow(
        'Database error',
      );
    });

    it('should throw error if field not found', async () => {
      mockFieldsService.findById.mockRejectedValue(
        new NotFoundException('Field not found'),
      );

      await expect(service.create(createGameDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error if weather service fails', async () => {
      mockFieldsService.findById.mockResolvedValue(mockField);
      mockWeatherApiService.getWeather.mockRejectedValue(
        new Error('Weather service error'),
      );

      await expect(service.create(createGameDto, mockUser)).rejects.toThrow(
        'Weather service error',
      );
    });
  });
});
