import { Repository } from 'typeorm';
import { GamesService } from './games.service';
import { GameParticipantsService } from 'src/game-participants/game-participants.service';
import { FieldsService } from 'src/fields/fields.service';
import { WeatherApiService } from 'src/weather-api/weather-api.service';
import { MailService } from 'src/mail/mail.service';
import { Test } from '@nestjs/testing';
import { Game } from './games.entity';
import { GameType } from 'src/enums/game-type.enum';
import { GameStatus } from 'src/enums/game-status.enum';
import { User } from 'src/users/users.entity';
import { Role } from 'src/enums/role.enum';
import { Field } from 'src/fields/fields.entity';
import { City } from 'src/enums/city.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { QueryGameDto } from './dto/query-game.dto';

describe('gamesService', () => {
  let gamesService: GamesService;
  let gameRepository: Repository<Game>;
  let fieldsService: FieldsService;
  let weatherApiService: WeatherApiService;
  let gameParticipantsService: GameParticipantsService;
  let mailService: MailService;

  const mockGameRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };
  const mockFieldsService = {
    findById: jest.fn(),
  };

  const mockGameParticipantService = {
    joinGame: jest.fn(),
    findGameParticipant: jest.fn(),
  };

  const mockWeatherApiService = {
    getWeather: jest.fn(),
  };

  const mockMailService = {
    sendNewGameStatus: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
        {
          provide: FieldsService,
          useValue: mockFieldsService,
        },
        {
          provide: GameParticipantsService,
          useValue: mockGameParticipantService,
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

    gamesService = moduleRef.get(GamesService);
    gameRepository = moduleRef.get(getRepositoryToken(Game));
    fieldsService = moduleRef.get(FieldsService);
    weatherApiService = moduleRef.get(WeatherApiService);
    gameParticipantsService = moduleRef.get(GameParticipantsService);
    mailService = moduleRef.get(MailService);

    jest.clearAllMocks();
  });

  const createGameDto: CreateGameDto = {
    gameType: GameType.FootBall,
    startDate: new Date('2025-07-26T18:00:00Z'),
    endDate: new Date('2025-07-26T20:00:00Z'),
    maxParticipants: 22,
    field: 'test-id',
    price: 60,
  };

  const getWeatherDto = {
    lat: 32.0853,
    lon: 34.7818,
    dt: '2025-07-26',
    hour: 18,
  };

  const mockWeatherResponse = {
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003,
    },
    temp_c: '18.5',
  };

  const user: User = {
    uid: 'test-id',
    firstName: 'ליאון',
    lastName: 'רודריגז',
    userEmail: 'leo.rodriguez@footballers.com',
    role: Role.USER,
    pass: 'hashedPassword',
    birthDay: '1990-01-01',
    isMale: true,
    address: undefined,
    profilePic: null,
    phoneNum: '+972501234567',
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    passwordResetExpires: undefined,
    groupMemberIn: [],
  };

  const newUser: User = {
    uid: 'new-id',
    firstName: 'יוחאי',
    lastName: 'בן ימין',
    userEmail: 'yuhai@footballers.com',
    role: Role.USER,
    pass: 'hashedPassword',
    birthDay: '1990-01-01',
    isMale: true,
    address: undefined,
    profilePic: null,
    phoneNum: '+972501234568',
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    passwordResetExpires: undefined,
    groupMemberIn: [],
  };

  const field: Field = {
    fieldId: 'test-id',
    fieldName: 'מגרש קהילתי בלומפילד',
    gameTypes: [GameType.FootBall],
    isManaged: false,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    city: City.TEL_AVIV_YAFO,
    manager: null,
    gamesInField: [],
  };

  const pendingGame: Game = {
    gameId: 'test-id',
    gameType: GameType.FootBall,
    startDate: new Date('2025-07-26T16:00:00Z'),
    endDate: new Date('2025-07-26T18:00:00Z'),
    maxParticipants: 14,
    status: GameStatus.PENDING,
    weatherTemp: 22,
    weatherCondition: 'מעונן חלקית',
    weatherIcon: 'partly-cloudy',
    price: 40,
    gameParticipants: [],
    creator: user as User,
    field: field as Field,
  };

  const gameRes: Game = {
    gameId: 'test-id',
    gameType: GameType.FootBall,
    startDate: new Date('2025-07-26T16:00:00Z'),
    endDate: new Date('2025-07-26T18:00:00Z'),
    maxParticipants: 14,
    status: GameStatus.APPROVED,
    weatherTemp: 22,
    weatherCondition: 'מעונן חלקית',
    weatherIcon: 'partly-cloudy',
    price: 40,
    gameParticipants: [],
    creator: user as User,
    field: field as Field,
  };

  const createGameDtoWithWeather = {
    gameType: GameType.FootBall,
    startDate: new Date('2025-07-26T18:00:00Z'),
    endDate: new Date('2025-07-26T20:00:00Z'),
    maxParticipants: 22,
    creator: user,
    field: field,
    status: GameStatus.APPROVED,
    gameParticipants: [],
    weatherTemp: parseInt(mockWeatherResponse.temp_c),
    weatherCondition: mockWeatherResponse.condition.text,
    weatherIcon: mockWeatherResponse.condition.icon,
  };

  const queryGameDto: QueryGameDto = {
    gameType: GameType.FootBall,
    startDate: new Date('2025-07-26T18:00:00Z'),
    endDate: new Date('2025-07-26T20:00:00Z'),
    city: City.TEL_AVIV_YAFO,
  };

  describe('findById', () => {
    it('Should return a game instance', async () => {
      (gameRepository.findOne as jest.Mock).mockResolvedValue(gameRes);

      expect(gamesService.findById(gameRes.gameId)).resolves.toEqual(gameRes);
      expect(gameRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: gameRes.gameId },
      });
    });

    it('Should return NotFoundException', async () => {
      (gameRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(gamesService.findById(gameRes.gameId)).rejects.toThrow(
        NotFoundException,
      );
      expect(gameRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: gameRes.gameId },
      });
    });
  });

  describe('create', () => {
    it('should create a game when field exists and is active', async () => {
      (fieldsService.findById as jest.Mock).mockResolvedValue(field);
      (gameRepository.create as jest.Mock).mockReturnValue(gameRes);
      (gameRepository.save as jest.Mock).mockResolvedValue(gameRes);
      (weatherApiService.getWeather as jest.Mock).mockResolvedValue(
        mockWeatherResponse,
      );
      (gameParticipantsService.joinGame as jest.Mock).mockResolvedValue(null);

      const result = await gamesService.create(createGameDto, user);

      expect(result).toEqual(gameRes);
      expect(fieldsService.findById).toHaveBeenCalledWith(createGameDto.field);
      expect(gameRepository.create).toHaveBeenCalledWith(
        createGameDtoWithWeather,
      );
      expect(gameRepository.save).toHaveBeenCalledWith(gameRes);
      expect(weatherApiService.getWeather).toHaveBeenCalledWith(getWeatherDto);
      expect(gameParticipantsService.joinGame).toHaveBeenCalledWith(
        gameRes.gameId,
        user,
        ParticipationStatus.APPROVED,
      );
    });
  });

  describe('queryGames', () => {
    it('should return filtered games with all relations', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([gameRes]),
      };

      (gameRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await gamesService.queryGames(queryGameDto);

      expect(result).toEqual([gameRes]);
      expect(gameRepository.createQueryBuilder).toHaveBeenCalledWith('game');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'game.field',
        'field',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'game.creator',
        'creator',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'game.gameParticipants',
        'gameParticipant',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'gameParticipant.user',
        'participantUser',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'game.status = :status',
        { status: GameStatus.APPROVED },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'game.gameType = :gameType',
        { gameType: queryGameDto.gameType },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'game.startDate >= :startDate',
        { startDate: queryGameDto.startDate },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'game.endDate <= :endDate',
        { endDate: queryGameDto.endDate },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'field.city = :city',
        { city: queryGameDto.city },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
    it('should return games with only required filters when optional params are not provided', async () => {
      const partialQueryDto: QueryGameDto = {
        gameType: GameType.FootBall,
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([gameRes]),
      };

      (gameRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await gamesService.queryGames(partialQueryDto);

      expect(result).toEqual([gameRes]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'game.status = :status',
        { status: GameStatus.APPROVED },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'game.gameType = :gameType',
        { gameType: partialQueryDto.gameType },
      );
      // Should not be called for undefined values
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'game.startDate >= :startDate',
        expect.anything(),
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'game.endDate <= :endDate',
        expect.anything(),
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'field.city = :city',
        expect.anything(),
      );
    });

    it('should return all approved games when no filters provided', async () => {
      const emptyQueryDto: QueryGameDto = {};

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([gameRes]),
      };

      (gameRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await gamesService.queryGames(emptyQueryDto);

      expect(result).toEqual([gameRes]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'game.status = :status',
        { status: GameStatus.APPROVED },
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockRejectedValue(new Error('Database connection failed')),
      };

      (gameRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      await expect(gamesService.queryGames(queryGameDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findGamesByFieldAndDate', () => {
    it('should return games for specific field and date', () => {
      (gameRepository.find as jest.Mock).mockResolvedValue(gameRes);

      expect(
        gamesService.findGamesByFieldAndDate(field.fieldId, '2025-07-26'),
      ).resolves.toEqual(gameRes);
      expect(gameRepository.find).toHaveBeenCalledWith({
        where: {
          field: { fieldId: field.fieldId },
          startDate: expect.objectContaining({
            _type: 'lessThan',
            _value: expect.any(Date),
          }),
          endDate: expect.objectContaining({
            _type: 'moreThan',
            _value: expect.any(Date),
          }),
        },
        order: {
          startDate: 'ASC',
        },
      });
    });
  });

  describe('calculateAvailableSlots', () => {
    it('should return available time slots excluding occupied game times', async () => {
      const mockGames = [gameRes];
      jest
        .spyOn(gamesService, 'findGamesByFieldAndDate')
        .mockResolvedValue(mockGames);

      const result = await gamesService.calculateAvailableSlots(
        field.fieldId,
        '2025-07-26',
        0,
      );

      expect(result).toHaveLength(44);
      expect(result).not.toContain('16:00');
      expect(result).not.toContain('16:30');
      expect(result).not.toContain('17:00');
      expect(result).not.toContain('17:30');
      expect(result).toContain('15:30');
      expect(result).toContain('18:00');
      expect(result[0]).toBe('00:00');
      expect(result[result.length - 1]).toBe('23:30');
      expect(gamesService.findGamesByFieldAndDate).toHaveBeenCalledWith(
        field.fieldId,
        '2025-07-26',
      );
    });
  });

  describe('approveGame', () => {
    it('should change the game status to approved and return the game instance', async () => {
      jest.spyOn(gamesService, 'findById').mockResolvedValue(pendingGame);
      (gameRepository.save as jest.Mock).mockResolvedValue(gameRes);

      const result = await gamesService.approveGame(
        pendingGame.gameId,
        GameStatus.APPROVED,
      );

      expect(result).toEqual(gameRes);
      expect(gamesService.findById).toHaveBeenCalledWith(pendingGame.gameId);
      expect(gameRepository.save).toHaveBeenCalledWith(gameRes);
      expect(mailService.sendNewGameStatus).toHaveBeenCalledWith(
        gameRes.creator.userEmail,
        gameRes.creator.firstName,
        GameStatus.APPROVED,
        gameRes.field.fieldName,
      );
    });
  });

  describe('declineGame', () => {
    it('Should delete the game and email the creator', async () => {
      jest.spyOn(gamesService, 'findById').mockResolvedValue(gameRes);
      jest.spyOn(gamesService, 'deleteOne').mockResolvedValue(undefined);
      (mailService.sendNewGameStatus as jest.Mock).mockResolvedValue(undefined);

      await gamesService.declineGame(gameRes.gameId);

      expect(gamesService.findById).toHaveBeenCalledWith(gameRes.gameId);
      expect(gamesService.deleteOne).toHaveBeenCalledWith(gameRes.gameId);
      expect(mailService.sendNewGameStatus).toHaveBeenCalledWith(
        gameRes.creator.userEmail,
        gameRes.creator.firstName,
        GameStatus.DELETED,
        gameRes.field.fieldName,
      );
    });
  });

  describe('findAllGamesByField', () => {
    it('Should return a list of found games', async () => {
      const games = [gameRes];
      (gameRepository.find as jest.Mock).mockResolvedValue(games);

      const result = await gamesService.findAllGamesByField(
        gameRes.field.fieldId,
      );

      expect(result).toEqual(games);
      expect(gameRepository.find).toHaveBeenCalledWith({
        relations: ['field'],
        where: {
          field: { fieldId: gameRes.field.fieldId },
        },
        order: { startDate: 'ASC' },
      });
    });
  });

  describe('findPendingGamesByField', () => {
    it('Should return a list of found games', async () => {
      const games = [gameRes];
      (gameRepository.find as jest.Mock).mockResolvedValue(games);

      const result = await gamesService.findPendingGamesByField(
        gameRes.field.fieldId,
      );

      expect(result).toEqual(games);
      expect(gameRepository.find).toHaveBeenCalledWith({
        relations: ['field'],
        where: {
          field: { fieldId: gameRes.field.fieldId },
          status: GameStatus.PENDING,
        },
        order: { startDate: 'ASC' },
      });
    });
  });

  describe('findApprovedGamesByField', () => {
    it('Should return a list of found games', async () => {
      const games = [gameRes];
      (gameRepository.find as jest.Mock).mockResolvedValue(games);

      const result = await gamesService.findApprovedGamesByField(
        gameRes.field.fieldId,
      );

      expect(result).toEqual(games);
      expect(gameRepository.find).toHaveBeenCalledWith({
        relations: ['field'],
        where: {
          field: { fieldId: gameRes.field.fieldId },
          status: GameStatus.APPROVED,
        },
      });
    });
  });

  describe('deleteOne', () => {
    it('Should delete the requested game', async () => {
      (gameRepository.findOne as jest.Mock).mockResolvedValue(gameRes);
      (gameRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await gamesService.deleteOne(gameRes.gameId);

      expect(gameRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: gameRes.gameId },
        relations: ['gameParticipants'],
      });
      expect(gameRepository.remove).toHaveBeenCalledWith(gameRes);
    });

    it('Should throw Not Found Exception', async () => {
      (gameRepository.findOne as jest.Mock).mockResolvedValue(null);
      (gameRepository.remove as jest.Mock).mockResolvedValue(null);

      expect(gamesService.deleteOne(gameRes.gameId)).rejects.toThrow(
        NotFoundException,
      );

      expect(gameRepository.findOne).toHaveBeenCalledWith({
        where: { gameId: gameRes.gameId },
        relations: ['gameParticipants'],
      });
      expect(gameRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('setGameCreator', () => {
    const gameWithNewCreator = {
      ...gameRes,
      creator: newUser,
    };

    it('should update the game creator and return the updated game', async () => {
      jest.spyOn(gamesService, 'findById').mockResolvedValue(gameRes);
      (
        gameParticipantsService.findGameParticipant as jest.Mock
      ).mockResolvedValue({ user: newUser });
      (gameRepository.save as jest.Mock).mockResolvedValue(gameWithNewCreator);

      const result = await gamesService.setGameCreator(
        gameRes.gameId,
        newUser.uid,
        user,
      );

      expect(result).toEqual(gameWithNewCreator);
      expect(gamesService.findById).toHaveBeenCalledWith(gameRes.gameId);
      expect(gameParticipantsService.findGameParticipant).toHaveBeenCalledWith(
        gameRes.gameId,
        newUser.uid,
      );
      expect(gameRepository.save).toHaveBeenCalledWith(gameWithNewCreator);
    });

    it('Should throw error if game creator is not the requesting user', async () => {
      const gameWithDifferentCreator = { ...gameRes, creator: newUser };

      jest
        .spyOn(gamesService, 'findById')
        .mockResolvedValue(gameWithDifferentCreator);

      await expect(
        gamesService.setGameCreator(gameRes.gameId, newUser.uid, user),
      ).rejects.toThrow(ForbiddenException);

      expect(gamesService.findById).toHaveBeenCalledWith(gameRes.gameId);
      expect(
        gameParticipantsService.findGameParticipant,
      ).not.toHaveBeenCalled();
      expect(gameRepository.save).not.toHaveBeenCalled();
    });
  });
});
