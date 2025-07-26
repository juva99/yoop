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
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGameDto } from './dto/create-game.dto';

describe('gamesService', () => {
  let gamesService: GamesService;
  let gameRepository: Repository<Game>;
  let fieldsService: FieldsService;

  const mockGameRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockFieldsService = {
    findById: jest.fn(),
  };

  const mockGameParticipantService = { joinGame: jest.fn() };

  const mockWeatherApiService = {
    getWeather: jest.fn(),
  };

  const mockMailService = {};

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
  const field: Field = {
    fieldId: 'test-id',
    fieldName: 'מגרש קהילתי בלומפילד',
    gameTypes: [GameType.FootBall],
    isManaged: false,
    city: City.TEL_AVIV_YAFO,
    manager: null,
    gamesInField: [],
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

  // describe('create', () => {
  //   it('should create a game when field exists and is active', async () => {
  //     (fieldsService.findById as jest.Mock).mockResolvedValue(field);
  //     (gameRepository.create as jest.Mock).mockReturnValue(gameRes);
  //     (gameRepository.save as jest.Mock).mockResolvedValue(gameRes);
  //     //TODO: need to mock joinGame

  //   const result = await gamesService.create(createGameDto, user);

  //   expect(fieldsService.findById).toHaveBeenCalledWith(createGameDto.field);
  //   expect(gameRepository.create).toHaveBeenCalled();
  //   expect(gameRepository.save).toHaveBeenCalledWith(gameRes);
  //   expect(result).toEqual(gameRes);
  // });

  // it('should throw NotFoundException if field does not exist or inactive', async () => {
  //   (fieldsService.findById as jest.Mock).mockResolvedValue(null);

  //   await expect(
  //     gamesService.create(createGameDto, user.uid),
  //   ).rejects.toThrow(NotFoundException);
  //   expect(fieldsService.findById).toHaveBeenCalledWith(createGameDto.field);
  // });

  // // expect(gamesService.create(createGameDto, user));
  // });
});
