import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Mock repository factory for TypeORM entities
 */
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    getCount: jest.fn(),
  })),
});

/**
 * Mock JWT Service
 */
export const createMockJwtService = () => ({
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
});

/**
 * Mock Config Service
 */
export const createMockConfigService = (config: Record<string, any> = {}) => ({
  get: jest.fn((key: string) => config[key]),
  getOrThrow: jest.fn((key: string) => {
    if (!(key in config)) {
      throw new Error(`Configuration key "${key}" not found`);
    }
    return config[key];
  }),
});

/**
 * Test data factory for User entity
 */
export const createTestUser = (overrides: Partial<any> = {}) => ({
  uid: 'test-user-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: new Date('1990-01-01'),
  pass: 'hashedPassword',
  role: 'USER',
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  organizedGames: [],
  participations: [],
  sentRequests: [],
  receivedRequests: [],
  ...overrides,
});

/**
 * Test data factory for Game entity
 */
export const createTestGame = (overrides: Partial<any> = {}) => ({
  gameId: 'test-game-id',
  gameType: 'FOOTBALL',
  startDate: new Date('2025-06-01T10:00:00Z'),
  endDate: new Date('2025-06-01T12:00:00Z'),
  maxParticipants: 10,
  field: 'test-field-id',
  price: 25,
  status: 'APPROVED',
  organizer: createTestUser(),
  participants: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Test data factory for Field entity
 */
export const createTestField = (overrides: Partial<any> = {}) => ({
  fieldId: 'test-field-id',
  name: 'Test Football Field',
  address: '123 Test Street, Test City',
  latitude: 40.7829,
  longitude: -73.9654,
  fieldType: 'Football',
  size: 'Standard',
  pricePerHour: 50,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  games: [],
  ...overrides,
});

/**
 * Helper to create a testing module with common providers
 */
export const createTestingModule = async (
  controllers: any[],
  providers: any[],
  additionalProviders: any[] = [],
) => {
  const commonProviders = [
    {
      provide: JwtService,
      useValue: createMockJwtService(),
    },
    {
      provide: ConfigService,
      useValue: createMockConfigService({
        JWT_SECRET: 'test-secret',
        JWT_EXPIRATION: '15m',
        REFRESH_SECRET: 'test-refresh-secret',
        REFRESH_EXPIRATION: '7d',
      }),
    },
    ...additionalProviders,
  ];

  return Test.createTestingModule({
    controllers,
    providers: [...providers, ...commonProviders],
  }).compile();
};

/**
 * Helper to mock HTTP requests for testing controllers
 */
export const createMockRequest = (
  user: any = null,
  params: any = {},
  body: any = {},
) => ({
  user,
  params,
  body,
  query: {},
  headers: {},
});

/**
 * Helper to mock HTTP responses for testing controllers
 */
export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Helper to create mock guards for testing
 */
export const createMockGuard = (shouldActivate = true, user: any = null) => ({
  canActivate: jest.fn((context) => {
    if (user && shouldActivate) {
      const req = context.switchToHttp().getRequest();
      req.user = user;
    }
    return shouldActivate;
  }),
});

/**
 * Async test helper to wait for promises
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to create mock date for consistent testing
 */
export const createMockDate = (dateString: string = '2025-05-27T10:00:00Z') => {
  const mockDate = new Date(dateString);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  return mockDate;
};

/**
 * Helper to restore real Date after mocking
 */
export const restoreDate = () => {
  (global.Date as any).mockRestore();
};

/**
 * Helper to assert that a function was called with partial arguments
 */
export const expectCalledWithPartial = (
  mockFn: jest.Mock,
  partialArgs: any,
) => {
  expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(partialArgs));
};

/**
 * Helper to create test database transaction mock
 */
export const createMockTransaction = () => ({
  manager: {
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
});

/**
 * Test suite logger for debugging
 */
export const testLogger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'test' && process.env.DEBUG_TESTS) {
      console.log(`[TEST] ${message}`, ...args);
    }
  },
  error: (message: string, error?: Error) => {
    if (process.env.NODE_ENV === 'test' && process.env.DEBUG_TESTS) {
      console.error(`[TEST ERROR] ${message}`, error);
    }
  },
};
