/**
 * Test setup file for vitest
 * Configures global test environment and mocks
 */
import { vi } from 'vitest';

// Mock performance.now for consistent timing tests
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!global.performance) {
  global.performance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    getEntriesByName: vi.fn(),
    getEntriesByType: vi.fn(),
    toJSON: vi.fn(),
  } as unknown as Performance;
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  table: vi.fn(),
  group: vi.fn(),
  groupCollapsed: vi.fn(),
  groupEnd: vi.fn(),
  time: vi.fn(),
  timeEnd: vi.fn(),
};

// Default mock for import.meta.env - tests will override as needed
Object.defineProperty(import.meta, 'env', {
  value: {
    DEV: false,
    PROD: true,
    MODE: 'test',
  },
  writable: true,
});
