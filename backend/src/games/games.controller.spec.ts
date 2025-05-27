import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryGameDto } from './dto/query-game.dto';
import { GameType } from '../enums/game-type.enum';
import { GameStatus } from '../enums/game-status.enum';
import { Role } from '../enums/role.enum';

describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: GamesService;
  const mockGame = {
    gameId: '123e4567-e89b-12d3-a456-426614174000',
    gameType: GameType.FootBall,
    startDate: new Date('2025-06-01T10:00:00Z'),
    endDate: new Date('2025-06-01T12:00:00Z'),
    maxParticipants: 10,
    field: 'test-field-id',
    price: 25,
    status: GameStatus.APPROVED,
    creator: {
      uid: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    gameParticipants: [],
  };

  const mockUser = {
    uid: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: Role.USER,
  };
  const mockGamesService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    queryGames: jest.fn(),
    joinGame: jest.fn(),
    leaveGame: jest.fn(),
    calculateAvailableSlots: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAll', () => {
    it('should return all games', async () => {
      const games = [mockGame];
      mockGamesService.findAll.mockResolvedValue(games);

      const result = await controller.getAll();

      expect(result).toEqual(games);
      expect(mockGamesService.findAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a game by id', async () => {
      mockGamesService.findById.mockResolvedValue(mockGame);

      const result = await controller.getById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockGame);
      expect(mockGamesService.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('create', () => {    const createGameDto: CreateGameDto = {
      gameType: GameType.FootBall,
      startDate: new Date('2025-06-01T10:00:00Z'),
      endDate: new Date('2025-06-01T12:00:00Z'),
      maxParticipants: 10,
      field: 'test-field-id',
      price: 25,
    };

    it('should create a new game', async () => {
      mockGamesService.create.mockResolvedValue(mockGame);

      const result = await controller.create(createGameDto, mockUser as any);

      expect(result).toEqual(mockGame);
      expect(mockGamesService.create).toHaveBeenCalledWith(createGameDto, mockUser);
    });
  });
  describe('queryGames', () => {
    const queryGameDto: QueryGameDto = {
      gameType: GameType.FootBall,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-02'),
    };

    it('should return games matching query', async () => {
      const games = [mockGame];
      mockGamesService.queryGames.mockResolvedValue(games);

      const result = await controller.queryGames(queryGameDto);

      expect(result).toEqual(games);
      expect(mockGamesService.queryGames).toHaveBeenCalledWith(queryGameDto);
    });
  });

  describe('joinGame', () => {
    it('should allow user to join a game', async () => {
      const successMessage = { message: 'Successfully joined the game' };
      mockGamesService.joinGame.mockResolvedValue(successMessage);

      const result = await controller.joinGame('123e4567-e89b-12d3-a456-426614174000', mockUser as any);

      expect(result).toEqual(successMessage);
      expect(mockGamesService.joinGame).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', mockUser);
    });
  });

  describe('leaveGame', () => {
    it('should allow user to leave a game', async () => {
      const successMessage = { message: 'Successfully left the game' };
      mockGamesService.leaveGame.mockResolvedValue(successMessage);

      const result = await controller.leaveGame('123e4567-e89b-12d3-a456-426614174000', mockUser as any);

      expect(result).toEqual(successMessage);
      expect(mockGamesService.leaveGame).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', mockUser);
    });
  });
  describe('getAvailableSlots', () => {
    it('should return available slots for a field', async () => {
      const availableSlots = ['10:00', '11:00', '12:00'];
      const queryDto = { date: '2025-06-01', timezone: 0 };
      mockGamesService.calculateAvailableSlots.mockResolvedValue(availableSlots);

      const result = await controller.getAvailableSlots('123e4567-e89b-12d3-a456-426614174000', queryDto);

      expect(result).toEqual(availableSlots);
      expect(mockGamesService.calculateAvailableSlots).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', '2025-06-01', 0);
    });
  });
});
