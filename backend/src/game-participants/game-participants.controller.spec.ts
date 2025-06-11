import { Test, TestingModule } from '@nestjs/testing';
import { GameParticipantsController } from './game-participants.controller';
import { GameParticipantsService } from './game-participants.service';
import { SetStatusDto } from './dto/set-status.dto';
import { GameParticipant } from './game-participants.entity';
import { ParticipationStatus } from '../enums/participation-status.enum';

describe('GameParticipantsController', () => {
  let controller: GameParticipantsController;
  let gameParticipantsService: GameParticipantsService;

  const mockGameParticipant: GameParticipant = {
    participantId: '123e4567-e89b-12d3-a456-426614174000',
    user: {
      uid: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    } as any,
    game: {
      gameId: 'game-123',
      gameType: 'FootBall',
      startDate: new Date('2025-06-01T10:00:00Z'),
    } as any,
    status: ParticipationStatus.CONFIRMED,
    joinedAt: new Date(),
  } as GameParticipant;

  const mockGameParticipantsService = {
    setStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameParticipantsController],
      providers: [
        {
          provide: GameParticipantsService,
          useValue: mockGameParticipantsService,
        },
      ],
    }).compile();

    controller = module.get<GameParticipantsController>(
      GameParticipantsController,
    );
    gameParticipantsService = module.get<GameParticipantsService>(
      GameParticipantsService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setStatus', () => {
    it('should update participant status successfully', async () => {
      const setStatusDto: SetStatusDto = {
        participantId: mockGameParticipant.participantId,
        status: ParticipationStatus.CONFIRMED,
      };

      const updatedParticipant = {
        ...mockGameParticipant,
        status: ParticipationStatus.CONFIRMED,
      };

      mockGameParticipantsService.setStatus.mockResolvedValue(
        updatedParticipant,
      );

      const result = await controller.setStatus(setStatusDto);

      expect(result).toEqual(updatedParticipant);
      expect(mockGameParticipantsService.setStatus).toHaveBeenCalledWith(
        setStatusDto,
      );
    });

    it('should handle status update to DECLINED', async () => {
      const setStatusDto: SetStatusDto = {
        participantId: mockGameParticipant.participantId,
        status: ParticipationStatus.DECLINED,
      };

      const updatedParticipant = {
        ...mockGameParticipant,
        status: ParticipationStatus.DECLINED,
      };

      mockGameParticipantsService.setStatus.mockResolvedValue(
        updatedParticipant,
      );

      const result = await controller.setStatus(setStatusDto);

      expect(result).toEqual(updatedParticipant);
      expect(mockGameParticipantsService.setStatus).toHaveBeenCalledWith(
        setStatusDto,
      );
    });

    it('should handle non-existent participant', async () => {
      const setStatusDto: SetStatusDto = {
        participantId: 'non-existent-id',
        status: ParticipationStatus.CONFIRMED,
      };

      mockGameParticipantsService.setStatus.mockRejectedValue(
        new Error('Participant not found'),
      );

      await expect(controller.setStatus(setStatusDto)).rejects.toThrow(
        'Participant not found',
      );
      expect(mockGameParticipantsService.setStatus).toHaveBeenCalledWith(
        setStatusDto,
      );
    });

    it('should handle invalid status values', async () => {
      const setStatusDto: SetStatusDto = {
        participantId: mockGameParticipant.participantId,
        status: 'INVALID_STATUS' as ParticipationStatus,
      };

      mockGameParticipantsService.setStatus.mockRejectedValue(
        new Error('Invalid status'),
      );

      await expect(controller.setStatus(setStatusDto)).rejects.toThrow(
        'Invalid status',
      );
    });
  });
});
