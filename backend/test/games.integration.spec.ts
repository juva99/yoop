import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { GamesController } from '../src/games/games.controller';
import { GamesService } from '../src/games/games.service';
import { Game } from '../src/games/games.entity';
import { CreateGameDto } from '../src/games/dto/create-game.dto';
import { GameType } from '../src/enums/game-type.enum';
import { GameStatus } from '../src/enums/game-status.enum';
import { Role } from '../src/enums/role.enum';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth/jwt-auth.guard';
import { WeatherApiService } from '../src/weather-api/weather-api.service';
import { GameParticipantsService } from '../src/game-participants/game-participants.service';
import { FieldsService } from '../src/fields/fields.service';
import { MailService } from '../src/mail/mail.service';

describe('Games Integration Tests', () => {
  let app: INestApplication;
  let gameRepository: Repository<Game>;
  let gamesService: GamesService;

  const mockGame: Game = {
    gameId: '123e4567-e89b-12d3-a456-426614174000',
    gameType: GameType.FootBall,
    startDate: new Date('2025-06-01T10:00:00Z'),
    endDate: new Date('2025-06-01T12:00:00Z'),
    maxParticipants: 10,
    field: 'test-field-id',
    price: 25,
    status: GameStatus.APPROVED,
    organizer: {
      uid: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: Role.USER,
    } as any,
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    uid: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: Role.USER,
  };

  // Mock repository
  const mockGameRepository = {
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

  // Mock services
  const mockWeatherApiService = {
    getWeather: jest.fn(),
  };

  const mockGameParticipantsService = {
    findParticipantsByGameId: jest.fn(),
    addParticipant: jest.fn(),
    removeParticipant: jest.fn(),
    getParticipantCount: jest.fn(),
  };

  const mockFieldsService = {
    findByFieldId: jest.fn(),
  };

  const mockMailService = {
    sendGameConfirmationEmail: jest.fn(),
    sendGameCancellationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
        {
          provide: WeatherApiService,
          useValue: mockWeatherApiService,
        },
        {
          provide: GameParticipantsService,
          useValue: mockGameParticipantsService,
        },
        {
          provide: FieldsService,
          useValue: mockFieldsService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    gameRepository = moduleFixture.get<Repository<Game>>(getRepositoryToken(Game));
    gamesService = moduleFixture.get<GamesService>(GamesService);

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /games', () => {
    it('should return all approved games', async () => {
      const games = [mockGame];
      mockGameRepository.find.mockResolvedValue(games);

      const response = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      expect(response.body).toEqual(games);
      expect(mockGameRepository.find).toHaveBeenCalledWith({
        where: { status: GameStatus.APPROVED },
      });
    });

    it('should return empty array when no games exist', async () => {
      mockGameRepository.find.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /games/:id', () => {
    it('should return a specific game', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);

      const response = await request(app.getHttpServer())
        .get('/games/123e4567-e89b-12d3-a456-426614174000')
        .expect(200);

      expect(response.body).toEqual(mockGame);
    });

    it('should return 404 when game not found', async () => {
      mockGameRepository.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/games/non-existent-id')
        .expect(404);
    });
  });

  describe('POST /games', () => {
    const createGameDto: CreateGameDto = {
      gameType: GameType.FootBall,
      startDate: new Date('2025-06-01T10:00:00Z'),
      endDate: new Date('2025-06-01T12:00:00Z'),
      maxParticipants: 10,
      field: 'test-field-id',
      price: 25,
    };

    it('should create a new game', async () => {
      const createdGame = { ...mockGame, organizer: mockUser };
      mockGameRepository.create.mockReturnValue(createdGame);
      mockGameRepository.save.mockResolvedValue(createdGame);

      const response = await request(app.getHttpServer())
        .post('/games')
        .send(createGameDto)
        .expect(201);

      expect(response.body).toEqual(createdGame);
      expect(mockGameRepository.create).toHaveBeenCalledWith({
        ...createGameDto,
        organizer: mockUser,
        status: GameStatus.PENDING,
      });
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        gameType: GameType.FootBall,
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/games')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate date formats', async () => {
      const invalidDto = {
        ...createGameDto,
        startDate: 'invalid-date',
      };

      await request(app.getHttpServer())
        .post('/games')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('POST /games/:id/join', () => {
    it('should allow user to join a game', async () => {
      const participant = {
        participantId: 'participant-123',
        user: mockUser,
        game: mockGame,
        status: 'confirmed',
      };
      
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantsService.addParticipant.mockResolvedValue(participant);
      mockGameParticipantsService.getParticipantCount.mockResolvedValue(5);

      const response = await request(app.getHttpServer())
        .post('/games/123e4567-e89b-12d3-a456-426614174000/join')
        .expect(201);

      expect(response.body).toEqual(participant);
    });

    it('should return 404 when trying to join non-existent game', async () => {
      mockGameRepository.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/games/non-existent-id/join')
        .expect(404);
    });
  });

  describe('DELETE /games/:id/leave', () => {
    it('should allow user to leave a game', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantsService.removeParticipant.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/games/123e4567-e89b-12d3-a456-426614174000/leave')
        .expect(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockGameRepository.find.mockRejectedValue(new Error('Database connection failed'));

      await request(app.getHttpServer())
        .get('/games')
        .expect(500);
    });

    it('should handle invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/games/invalid-uuid')
        .expect(400); // Assuming you have UUID validation
    });
  });

  describe('Service Integration', () => {
    it('should properly integrate with weather service', async () => {
      const weatherData = {
        temperature: 22,
        condition: 'sunny',
        humidity: 60,
      };
      
      mockWeatherApiService.getWeather.mockResolvedValue(weatherData);
      mockGameRepository.findOne.mockResolvedValue(mockGame);

      // Test the weather integration through the service
      const result = await gamesService.findById('123e4567-e89b-12d3-a456-426614174000');
      
      expect(mockWeatherApiService.getWeather).toHaveBeenCalled();
      expect(result).toHaveProperty('weather', weatherData);
    });

    it('should handle weather service failures gracefully', async () => {
      mockWeatherApiService.getWeather.mockRejectedValue(new Error('Weather API unavailable'));
      mockGameRepository.findOne.mockResolvedValue(mockGame);

      const result = await gamesService.findById('123e4567-e89b-12d3-a456-426614174000');
      
      // Should return game without weather data when weather service fails
      expect(result).toEqual(mockGame);
      expect(result).not.toHaveProperty('weather');
    });
  });
});
