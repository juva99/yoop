import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameParticipantsService } from './game-participants.service';
import { GameParticipant } from './game-participants.entity';
import { Game } from '../games/games.entity';
import { User } from '../users/users.entity';
import { SetStatusDto } from './dto/set-status.dto';
import { ParticipationStatus } from '../enums/participation-status.enum';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GameType } from '../enums/game-type.enum';
import { GameStatus } from '../enums/game-status.enum';
import { Role } from '../enums/role.enum';
import { Field } from '../fields/fields.entity';

describe('GameParticipantsService', () => {
  let service: GameParticipantsService;
  let gameParticipantRepository: Repository<GameParticipant>;
  let gameRepository: Repository<Game>;
  let usersService: UsersService;

  const mockUserCreator: User = {
    uid: 'user-creator-123',
    firstName: 'Creator',
    lastName: 'User',
    userEmail: 'creator@example.com',
  } as User;

  const mockUserParticipant: User = {
    uid: 'user-participant-456',
    firstName: 'Participant',
    lastName: 'User',
    userEmail: 'participant@example.com',
  } as User;

  const mockUserInvited: User = {
    uid: 'user-invited-789',
    firstName: 'Invited',
    lastName: 'User',
    userEmail: 'invited@example.com',
  } as User;
  
  const mockField: Field = {
    fieldId: 'field-123',
    fieldName: 'Test Field',
  } as Field;

  let mockGame: Game;
  let mockGameParticipant: GameParticipant;

  // Mocks for repositories and services
  let mockGameParticipantRepository;
  let mockGameRepository;
  let mockUsersService;


  beforeEach(async () => {
    mockGameParticipantRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockGameRepository = {
      findOne: jest.fn(),
      // Add other methods if GameRepository is used more extensively
    };
    mockUsersService = {
      findById: jest.fn(),
    };

    // Initialize mock data that might be modified per test
    mockGame = {
      gameId: 'game-123',
      gameType: GameType.FootBall,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
      maxParticipants: 10,
      status: GameStatus.APPROVED,
      creator: mockUserCreator,
      gameParticipants: [],
      field: mockField,
      price: 0,
      weatherCondition: 'Sunny',
      weatherIcon: 'icon.png',
      weatherTemp: 25,
    };

    mockGameParticipant = {
      id: 'gp-123',
      game: mockGame,
      user: mockUserParticipant,
      status: ParticipationStatus.PENDING,
    };


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameParticipantsService,
        {
          provide: getRepositoryToken(GameParticipant),
          useValue: mockGameParticipantRepository,
        },
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<GameParticipantsService>(GameParticipantsService);
    gameParticipantRepository = module.get<Repository<GameParticipant>>(
      getRepositoryToken(GameParticipant),
    );
    gameRepository = module.get<Repository<Game>>(
      getRepositoryToken(Game),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('joinGame', () => {
    it('should allow a user to join a game successfully', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantRepository.findOne.mockResolvedValue(null); // Not already participating
      mockGameParticipantRepository.create.mockReturnValue(mockGameParticipant);
      mockGameParticipantRepository.save.mockResolvedValue(mockGameParticipant);

      const result = await service.joinGame(mockGame.gameId, mockUserParticipant, ParticipationStatus.PENDING);
      expect(result).toEqual(mockGameParticipant);
      expect(mockGameRepository.findOne).toHaveBeenCalledWith({ where: { gameId: mockGame.gameId }, relations: ['gameParticipants'] });
      expect(mockGameParticipantRepository.create).toHaveBeenCalledWith({ game: mockGame, user: mockUserParticipant, status: ParticipationStatus.PENDING });
      expect(mockGameParticipantRepository.save).toHaveBeenCalledWith(mockGameParticipant);
    });

    it('should throw NotFoundException if game does not exist', async () => {
      mockGameRepository.findOne.mockResolvedValue(null);
      await expect(service.joinGame('nonexistent-game-id', mockUserParticipant, ParticipationStatus.PENDING)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if game is full', async () => {
      const fullGame = { ...mockGame, maxParticipants: 1, gameParticipants: [mockGameParticipant] };
      mockGameRepository.findOne.mockResolvedValue(fullGame);
      await expect(service.joinGame(mockGame.gameId, mockUserInvited, ParticipationStatus.PENDING)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user is already participating', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantRepository.findOne.mockResolvedValue(mockGameParticipant); // Already participating
      await expect(service.joinGame(mockGame.gameId, mockUserParticipant, ParticipationStatus.PENDING)).rejects.toThrow(ConflictException);
    });
  });

  describe('setStatus', () => {
    it('should update status for an existing participant', async () => {
      const setStatusDto: SetStatusDto = {
        uid: mockUserParticipant.uid,
        gameId: mockGame.gameId,
        newStatus: ParticipationStatus.APPROVED,
      };
      const updatedParticipant = { ...mockGameParticipant, status: ParticipationStatus.APPROVED };
      mockGameParticipantRepository.findOne.mockResolvedValue(mockGameParticipant);
      mockGameParticipantRepository.save.mockResolvedValue(updatedParticipant);

      const result = await service.setStatus(setStatusDto);
      expect(result).toEqual(updatedParticipant);
      expect(mockGameParticipantRepository.findOne).toHaveBeenCalledWith({ where: { user: { uid: setStatusDto.uid }, game: { gameId: setStatusDto.gameId } }, relations: ['user', 'game'] });
      expect(mockGameParticipantRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: ParticipationStatus.APPROVED }));
    });

    it('should create a new participant if not existing and user/game found', async () => {
      const setStatusDto: SetStatusDto = {
        uid: mockUserParticipant.uid,
        gameId: mockGame.gameId,
        newStatus: ParticipationStatus.APPROVED,
      };
      mockGameParticipantRepository.findOne.mockResolvedValue(null); // Participant not found
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockUsersService.findById.mockResolvedValue(mockUserParticipant);
      const newParticipant = { game: mockGame, user: mockUserParticipant, status: setStatusDto.newStatus, id: 'new-gp-id' };
      mockGameParticipantRepository.create.mockReturnValue(newParticipant);
      mockGameParticipantRepository.save.mockResolvedValue(newParticipant as GameParticipant);

      const result = await service.setStatus(setStatusDto);
      expect(result).toEqual(newParticipant);
      expect(mockGameParticipantRepository.create).toHaveBeenCalledWith({ user: mockUserParticipant, game: mockGame, status: setStatusDto.newStatus });
    });

    it('should throw NotFoundException if participant not found and game not found', async () => {
      const setStatusDto: SetStatusDto = {
        uid: mockUserParticipant.uid,
        gameId: mockGame.gameId,
        newStatus: ParticipationStatus.APPROVED,
      };
      mockGameParticipantRepository.findOne.mockResolvedValue(null);
      mockGameRepository.findOne.mockResolvedValue(null); // Game not found
      mockUsersService.findById.mockResolvedValue(mockUserParticipant);
      await expect(service.setStatus(setStatusDto)).rejects.toThrow(NotFoundException);
    });

     it('should throw NotFoundException if participant not found and user not found', async () => {
      const setStatusDto: SetStatusDto = {
        uid: mockUserParticipant.uid,
        gameId: mockGame.gameId,
        newStatus: ParticipationStatus.APPROVED,
      };
      mockGameParticipantRepository.findOne.mockResolvedValue(null);
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockUsersService.findById.mockResolvedValue(null); // User not found
      await expect(service.setStatus(setStatusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllMine', () => {
    it('should return all games a user is participating in', async () => {
      const participations = [mockGameParticipant, { ...mockGameParticipant, id: 'gp-456', game: { ...mockGame, gameId: 'game-456' } }];
      mockGameParticipantRepository.find.mockResolvedValue(participations);

      const result = await service.findAllMine(mockUserParticipant);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockGame);
      expect(result[1].gameId).toEqual('game-456');
      expect(mockGameParticipantRepository.find).toHaveBeenCalledWith({
        where: { user: { uid: mockUserParticipant.uid } },
        relations: ['game', 'game.field', 'game.creator', 'game.gameParticipants', 'game.gameParticipants.user'],
      });
    });
  });

  describe('leaveGame', () => {
    it('should allow a user to leave a game successfully', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantRepository.findOne.mockResolvedValue(mockGameParticipant);
      mockGameParticipantRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await expect(service.leaveGame(mockGame.gameId, mockUserParticipant)).resolves.toBeUndefined();
      expect(mockGameParticipantRepository.delete).toHaveBeenCalledWith(mockGameParticipant.id);
    });

    it('should throw NotFoundException if game does not exist', async () => {
      mockGameRepository.findOne.mockResolvedValue(null);
      await expect(service.leaveGame('nonexistent-game-id', mockUserParticipant)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user is not participating in the game', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame);
      mockGameParticipantRepository.findOne.mockResolvedValue(null); // Not participating
      await expect(service.leaveGame(mockGame.gameId, mockUserParticipant)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if game creator tries to leave', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame); // mockGame.creator is mockUserCreator
      const creatorParticipation = { ...mockGameParticipant, user: mockUserCreator };
      mockGameParticipantRepository.findOne.mockResolvedValue(creatorParticipation);
      await expect(service.leaveGame(mockGame.gameId, mockUserCreator)).rejects.toThrow(ConflictException);
    });
  });

  describe('inviteFriendToGame', () => {
    it('should invite a friend with PENDING status if inviter is not creator', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame); // mockGame.creator is mockUserCreator
      // Mock the underlying joinGame call
      const invitedParticipation = { ...mockGameParticipant, user: mockUserInvited, status: ParticipationStatus.PENDING };
      mockGameParticipantRepository.findOne.mockResolvedValue(null); // Invited user not already in game
      mockGameParticipantRepository.create.mockReturnValue(invitedParticipation);
      mockGameParticipantRepository.save.mockResolvedValue(invitedParticipation);


      const result = await service.inviteFriendToGame(mockGame.gameId, mockUserParticipant, mockUserInvited);
      expect(result.status).toBe(ParticipationStatus.PENDING);
      expect(result.user).toBe(mockUserInvited);
      expect(mockGameParticipantRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: ParticipationStatus.PENDING }));
    });

    it('should invite a friend with APPROVED status if inviter is creator', async () => {
      mockGameRepository.findOne.mockResolvedValue(mockGame); // mockGame.creator is mockUserCreator
      // Mock the underlying joinGame call
      const invitedParticipation = { ...mockGameParticipant, user: mockUserInvited, status: ParticipationStatus.APPROVED };
      mockGameParticipantRepository.findOne.mockResolvedValue(null); // Invited user not already in game
      mockGameParticipantRepository.create.mockReturnValue(invitedParticipation);
      mockGameParticipantRepository.save.mockResolvedValue(invitedParticipation);

      const result = await service.inviteFriendToGame(mockGame.gameId, mockUserCreator, mockUserInvited);
      expect(result.status).toBe(ParticipationStatus.APPROVED);
      expect(result.user).toBe(mockUserInvited);
      expect(mockGameParticipantRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: ParticipationStatus.APPROVED }));
    });

    it('should throw NotFoundException if game does not exist for invite', async () => {
      mockGameRepository.findOne.mockResolvedValue(null);
      await expect(service.inviteFriendToGame('nonexistent-game-id', mockUserParticipant, mockUserInvited)).rejects.toThrow(NotFoundException);
    });

    it('should propagate ConflictException from joinGame if invited user is already in game', async () => {
        mockGameRepository.findOne.mockResolvedValue(mockGame);
        mockGameParticipantRepository.findOne.mockResolvedValue({ ...mockGameParticipant, user: mockUserInvited }); // Invited user already participating

        await expect(service.inviteFriendToGame(mockGame.gameId, mockUserParticipant, mockUserInvited)).rejects.toThrow(ConflictException);
    });
  });
});
