import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from '../enums/game-status.enum';

// Mock the mailjet library
const mockRequest = jest.fn();
const mockPost = jest.fn(() => ({
  request: mockRequest,
}));
const mockMailjet = {
  post: mockPost,
};

jest.mock('node-mailjet', () => ({
  apiConnect: jest.fn(() => mockMailjet),
}));

// Mock environment variables
const originalEnv = process.env;

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    // Set up environment variables
    process.env = {
      ...originalEnv,
      MJ_APIKEY_PUBLIC: 'test-public-key',
      MJ_APIKEY_PRIVATE: 'test-private-key',
      MAIL_FROM: 'noreply@gameapp.com',
      MAIL_FROM_NAME: 'Game App',
      FRONTEND_URL: 'http://localhost:3000/',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();

    // Mock mailjet request method
    mockRequest.mockResolvedValue({
      body: { Messages: [{ Status: 'success' }] },
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      await service.sendWelcomeEmail('john@example.com', 'John');

      expect(mockPost).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'John',
              },
            ],
            Subject: 'ברוכים הבאים לאפליקציית הספורט האהובה עלייך!🎉',
            HTMLPart: expect.stringContaining('שלום John'),
          },
        ],
      });
    });

    it('should send welcome email without name', async () => {
      await service.sendWelcomeEmail('john@example.com');

      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'john@example.com',
              },
            ],
            Subject: 'ברוכים הבאים לאפליקציית הספורט האהובה עלייך!🎉',
            HTMLPart: expect.stringContaining('שלום'),
          },
        ],
      });
    });
  });

  describe('sendNewGameStatus', () => {
    it('should send game approved email successfully', async () => {
      await service.sendNewGameStatus('john@example.com', 'John', GameStatus.APPROVED, 'Central Park');

      expect(mockPost).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'John',
              },
            ],
            Subject: 'המשחק אושר!🎉',
            HTMLPart: expect.stringContaining('המשחק שלך ב Central Park אושר!'),
          },
        ],
      });
    });

    it('should send game pending/rejected email successfully', async () => {
      await service.sendNewGameStatus('john@example.com', 'John', GameStatus.PENDING, 'Central Park');

      expect(mockPost).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'John',
              },
            ],
            Subject: 'המשחק סורב..',
            HTMLPart: expect.stringContaining('המשחק שלך ב Central Park נדחה..'),
          },
        ],
      });
    });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset email successfully', async () => {
      await service.sendPasswordReset('john@example.com', 'reset-token-123', 'John');

      expect(mockPost).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'John',
              },
            ],
            Subject: 'איפוס סיסמא לאפליקציית Yoop',
            HTMLPart: expect.stringContaining('reset-token-123'),
          },
        ],
      });
    });

    it('should send password reset email without name', async () => {
      await service.sendPasswordReset('john@example.com', 'reset-token-123');

      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'john@example.com',
                Name: 'john@example.com',
              },
            ],
            Subject: 'איפוס סיסמא לאפליקציית Yoop',
            HTMLPart: expect.stringContaining('reset-token-123'),
          },
        ],
      });
    });
  });

  describe('sendManagerInvite', () => {
    it('should send manager invite email successfully', async () => {
      await service.sendManagerInvite('manager@example.com', 'invite-token-123', 'Manager Name');

      expect(mockPost).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'manager@example.com',
                Name: 'Manager Name',
              },
            ],
            Subject: 'ברוכים הבאים לאפליקציית Yoop!',
            HTMLPart: expect.stringContaining('invite-token-123'),
          },
        ],
      });
    });

    it('should send manager invite email without name', async () => {
      await service.sendManagerInvite('manager@example.com', 'invite-token-123');

      expect(mockRequest).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: 'noreply@gameapp.com',
              Name: 'Game App',
            },
            To: [
              {
                Email: 'manager@example.com',
                Name: 'manager@example.com',
              },
            ],
            Subject: 'ברוכים הבאים לאפליקציית Yoop!',
            HTMLPart: expect.stringContaining('invite-token-123'),
          },
        ],
      });
    });
  });

  describe('error handling', () => {
    it('should handle mailjet errors gracefully in sendWelcomeEmail', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockRequest.mockRejectedValue(new Error('Mailjet API error'));

      await service.sendWelcomeEmail('john@example.com', 'John');

      expect(consoleSpy).toHaveBeenCalledWith('Mailjet error:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle mailjet errors gracefully in sendNewGameStatus', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockRequest.mockRejectedValue(new Error('Mailjet API error'));

      await service.sendNewGameStatus('john@example.com', 'John', GameStatus.APPROVED, 'Central Park');

      expect(consoleSpy).toHaveBeenCalledWith('Mailjet error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
