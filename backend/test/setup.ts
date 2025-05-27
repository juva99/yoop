// Global test setup
import 'reflect-metadata';

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  // Uncomment below lines to suppress console output during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup global test utilities
global.beforeEach(() => {
  jest.clearAllMocks();
});

// Mock Date.now for consistent testing
const mockDate = new Date('2025-05-27T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
