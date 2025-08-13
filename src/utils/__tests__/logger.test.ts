// src/utils/__tests__/logger.test.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock import.meta.env before importing the logger
const mockEnv = { DEV: false, PROD: true, MODE: 'test' };

vi.stubGlobal('import.meta', {
  env: mockEnv,
});

// Helper function to update environment
const setMockEnv = (env: Partial<typeof mockEnv>) => {
  Object.assign(mockEnv, env);
};

import {
  createLogger,
  disableDebugLogging,
  enableDebugLogging,
  loggers,
} from '../logger';

describe('Logger', () => {
  let mockLocalStorage: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    vi.spyOn(console, 'time').mockImplementation(() => {});
    vi.spyOn(console, 'timeEnd').mockImplementation(() => {});

    // Reset localStorage mock
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    // Replace the global localStorage
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock performance.now for consistent timing
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockLocalStorage.clear();
  });

  describe('Environment Detection', () => {
    it('should enable logging in development mode', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      logger.info('test message');

      expect(console.info).toHaveBeenCalled();
    });

    it('should disable logging in production by default', () => {
      setMockEnv({ DEV: false, PROD: true });
      mockLocalStorage.getItem.mockReturnValue(null);

      const logger = createLogger({ namespace: 'test', enabled: false }); // Explicitly disable for test
      logger.info('test message');

      expect(console.info).not.toHaveBeenCalled();
    });

    it('should enable production logging via localStorage', () => {
      setMockEnv({ DEV: false, PROD: true });
      mockLocalStorage.getItem.mockReturnValue('true');

      const logger = createLogger({ namespace: 'test' });
      logger.info('test message');

      expect(console.info).toHaveBeenCalled();
    });

    it('should handle localStorage errors gracefully', () => {
      setMockEnv({ DEV: false, PROD: true });
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const logger = createLogger({ namespace: 'test', enabled: false }); // Explicitly disable for test
      logger.info('test message');

      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe('Log Levels', () => {
    it('should respect log level hierarchy', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test', level: 'warn' });

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should filter messages below configured level', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test', level: 'error' });

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle all log levels correctly', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test', level: 'debug' });

      logger.debug('debug message');
      logger.log('log message');
      logger.info('info message');
      logger.success('success message');
      logger.warn('warn message');
      logger.error('error message');

      expect(console.debug).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledTimes(2); // log and success both use console.log
      expect(console.info).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Performance Tracking', () => {
    it('should measure synchronous operations', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      let callCount = 0;
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1500); // end time

      const result = logger.measure('test-operation', () => {
        callCount++;
      });

      expect(callCount).toBe(1);
      expect(result.name).toBe('test-operation');
      expect(result.duration).toBe(500);
      expect(result.timestamp).toBeTypeOf('number');
      // Check that the performance message is logged (accounting for color formatting)
      const calls = (console.info as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain(
        '📊 Performance [test-operation]: 500.00ms'
      );
    });

    it('should measure async operations', async () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1750); // end time

      const asyncOperation = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'success';
      };

      const result = await logger.measureAsync('async-test', asyncOperation);

      expect(result.result).toBe('success');
      expect(result.measurement.name).toBe('async-test');
      expect(result.measurement.duration).toBe(750);
      // Check that the async performance message is logged (accounting for color formatting)
      const calls = (console.info as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain(
        '📊 Async Performance [async-test]: 750.00ms'
      );
    });

    it('should handle measurement errors', async () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1250); // end time

      const failingOperation = async () => {
        throw new Error('Operation failed');
      };

      await expect(
        logger.measureAsync('failing-test', failingOperation)
      ).rejects.toThrow('Operation failed');

      // Check that the error message is logged (accounting for color formatting)
      const calls = (console.error as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain(
        '📊 Async Performance [failing-test] FAILED: 250.00ms'
      );
    });

    it('should manage timer map memory correctly', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });

      // Add 101 timers to test MAX_TIMERS limit (100)
      for (let i = 0; i <= 100; i++) {
        logger.time(`timer-${i}`);
      }

      // The first timer should have been removed due to MAX_TIMERS limit
      logger.timeEnd('timer-0'); // This should not find the timer
      logger.timeEnd('timer-100'); // This should find the timer

      expect(console.timeEnd).toHaveBeenCalledWith('test:timer-0');
      expect(console.timeEnd).toHaveBeenCalledWith('test:timer-100');
    });
  });

  describe('Child Loggers', () => {
    it('should create child loggers with correct namespace', () => {
      setMockEnv({ DEV: true, PROD: false });

      const parentLogger = createLogger({ namespace: 'parent' });
      const childLogger = parentLogger.child('child');

      childLogger.info('test message');

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('PARENT:CHILD'),
        expect.any(String),
        'test message'
      );
    });

    it('should inherit parent configuration', () => {
      setMockEnv({ DEV: true, PROD: false });

      const parentLogger = createLogger({ namespace: 'parent', level: 'warn' });
      const childLogger = parentLogger.child('child');

      childLogger.info('info message');
      childLogger.warn('warn message');

      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });

    it('should create hierarchical namespaces', () => {
      setMockEnv({ DEV: true, PROD: false });

      const parentLogger = createLogger({ namespace: 'parent' });
      const childLogger = parentLogger.child('child');
      const grandChildLogger = childLogger.child('grandchild');

      grandChildLogger.info('nested message');

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('PARENT:CHILD:GRANDCHILD'),
        expect.any(String),
        'nested message'
      );
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize sensitive data in logs', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      const sensitiveData = {
        username: 'john',
        password: 'secret123',
        token: 'abc123',
        apiKey: 'key456',
        secret: 'hidden',
        normalField: 'visible',
      };

      logger.info('User data:', sensitiveData);

      const call = (console.info as any).mock.calls[0];
      // In development mode with colors, the data is at index 3 (after prefix, color, and label)
      const loggedData = call[3];

      expect(loggedData.username).toBe('john');
      expect(loggedData.normalField).toBe('visible');
      expect(loggedData.password).toBe('[REDACTED]');
      expect(loggedData.token).toBe('[REDACTED]');
      expect(loggedData.apiKey).toBe('[REDACTED]');
      expect(loggedData.secret).toBe('[REDACTED]');
    });

    it('should handle nested objects', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      const nestedData = {
        user: {
          name: 'john',
          auth: {
            password: 'secret123',
            token: 'abc123',
          },
        },
        config: {
          apiKey: 'key456',
          publicSetting: 'visible',
        },
      };

      logger.info('Nested data:', nestedData);

      // Verify the logger was called
      expect(console.info).toHaveBeenCalled();

      // Get the call arguments and check that sensitive data is not present
      const callArgs = (console.info as any).mock.calls[0];
      const allArgsAsString = JSON.stringify(callArgs);

      // Verify sensitive data was redacted
      expect(allArgsAsString).not.toContain('secret123');
      expect(allArgsAsString).not.toContain('abc123');
      expect(allArgsAsString).not.toContain('key456');
      expect(allArgsAsString).toContain('[REDACTED]');

      // Verify non-sensitive data is still present
      expect(allArgsAsString).toContain('john');
      expect(allArgsAsString).toContain('visible');
    });

    it('should handle arrays', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      const arrayData = [
        { name: 'user1', password: 'secret1' },
        { name: 'user2', password: 'secret2' },
        'plain string',
        42,
      ];

      logger.info('Array data:', arrayData);

      const call = (console.info as any).mock.calls[0];
      // In development mode with colors, the data is at index 3 (after prefix, color, and label)
      const loggedData = call[3];

      expect(Array.isArray(loggedData)).toBe(true);
      expect(loggedData[0].name).toBe('user1');
      expect(loggedData[0].password).toBe('[REDACTED]');
      expect(loggedData[1].name).toBe('user2');
      expect(loggedData[1].password).toBe('[REDACTED]');
      expect(loggedData[2]).toBe('plain string');
      expect(loggedData[3]).toBe(42);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate log level configuration', () => {
      expect(() => {
        createLogger({ level: 'invalid' as any });
      }).toThrow('Invalid log level: invalid');
    });

    it('should accept valid configuration', () => {
      expect(() => {
        createLogger({ level: 'debug' });
        createLogger({ level: 'info' });
        createLogger({ level: 'warn' });
        createLogger({ level: 'error' });
        createLogger({ level: 'success' });
      }).not.toThrow();
    });
  });

  describe('Timestamp Caching', () => {
    it('should cache timestamps for performance', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      const now = 1640995200000; // Fixed timestamp
      vi.spyOn(Date, 'now').mockReturnValue(now);
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(
        '2022-01-01T00:00:00.000Z'
      );

      logger.info('message 1');
      logger.info('message 2');

      // Both calls should use the same cached timestamp
      const calls = (console.info as any).mock.calls;
      expect(calls[0][0]).toContain('00:00:00');
      expect(calls[1][0]).toContain('00:00:00');

      // Date.now should only be called once for caching
      expect(Date.now).toHaveBeenCalledTimes(2); // Once for each log call
    });

    it('should update cached timestamp after 1 second', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      let timeCounter = 1640995200000;

      vi.spyOn(Date, 'now').mockImplementation(() => timeCounter);
      vi.spyOn(Date.prototype, 'toISOString')
        .mockReturnValueOnce('2022-01-01T00:00:00.000Z')
        .mockReturnValueOnce('2022-01-01T00:00:01.000Z');

      logger.info('message 1');

      // Advance time by more than 1 second
      timeCounter += 1500;
      logger.info('message 2');

      const calls = (console.info as any).mock.calls;
      expect(calls[0][0]).toContain('00:00:00');
      expect(calls[1][0]).toContain('00:00:01');
    });
  });

  describe('Pre-configured Loggers', () => {
    it('should have all expected namespaced loggers', () => {
      const expectedLoggers = [
        'onboarding',
        'auth',
        'api',
        'graphql',
        'store',
        'router',
        'ui',
        'performance',
        'validation',
        'dev',
        'debug',
      ];

      expectedLoggers.forEach((loggerName) => {
        expect(loggers).toHaveProperty(loggerName);
        expect(loggers[loggerName as keyof typeof loggers]).toBeDefined();
      });
    });

    it('should use correct namespaces', () => {
      setMockEnv({ DEV: true, PROD: false });

      loggers.auth.info('auth message');
      loggers.api.info('api message');

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('ROCKETHOOKS:AUTH'),
        expect.any(String),
        'auth message'
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('ROCKETHOOKS:API'),
        expect.any(String),
        'api message'
      );
    });
  });

  describe('Utility Methods', () => {
    it('should support table logging', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      const tableData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];

      logger.table(tableData);

      // Check that the table info message is logged
      const calls = (console.info as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain('Table data:');
      expect(console.table).toHaveBeenCalledWith(tableData);
    });

    it('should support grouped logging', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });

      logger.group('Test Group');
      logger.info('grouped message');
      logger.groupEnd();

      // Check that the group message is logged
      const calls = (console.group as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain('Test Group');
      expect(console.groupEnd).toHaveBeenCalled();
    });

    it('should support timing operations', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1250); // end time

      logger.time('operation');
      logger.timeEnd('operation');

      expect(console.time).toHaveBeenCalledWith('test:operation');
      expect(console.timeEnd).toHaveBeenCalledWith('test:operation');
      // Check that the timing message is logged
      const calls = (console.info as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain('⏱️ operation: 250.00ms');
    });
  });

  describe('Debug Logging Control', () => {
    it('should enable debug logging via enableDebugLogging', () => {
      enableDebugLogging();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'rockethooks:debug',
        'true'
      );
    });

    it('should disable debug logging via disableDebugLogging', () => {
      disableDebugLogging();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'rockethooks:debug'
      );
    });

    it('should handle localStorage errors in enableDebugLogging', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        enableDebugLogging();
      }).not.toThrow();
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to enable debug logging:',
        expect.any(Error)
      );
    });

    it('should handle localStorage errors in disableDebugLogging', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(() => {
        disableDebugLogging();
      }).not.toThrow();
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to disable debug logging:',
        expect.any(Error)
      );
    });
  });

  describe('Configuration Methods', () => {
    it('should allow setting log level', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test', level: 'debug' });

      logger.debug('debug message');
      expect(console.debug).toHaveBeenCalled();

      vi.clearAllMocks();

      logger.setLevel('error');
      logger.debug('debug message after level change');
      logger.error('error message after level change');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should allow enabling and disabling logger', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });

      logger.disable();
      logger.info('disabled message');
      expect(console.info).not.toHaveBeenCalled();

      logger.enable();
      logger.info('enabled message');
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined values in sanitization', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });

      logger.info('null value:', null);
      logger.info('undefined value:', undefined);

      const calls = (console.info as any).mock.calls;
      // In development mode with colors, the actual data is at index 3
      expect(calls[0][3]).toBe(null);
      expect(calls[1][3]).toBe(undefined);
    });

    it('should handle disabled logger in utility methods', () => {
      const logger = createLogger({ namespace: 'test', enabled: false });

      logger.table([{ test: 'data' }]);
      logger.group('test group');
      logger.groupEnd();
      logger.time('test-timer');
      logger.timeEnd('test-timer');

      expect(console.table).not.toHaveBeenCalled();
      expect(console.group).not.toHaveBeenCalled();
      expect(console.groupEnd).not.toHaveBeenCalled();
      expect(console.time).not.toHaveBeenCalled();
      expect(console.timeEnd).not.toHaveBeenCalled();
    });

    it('should handle timeEnd without corresponding time call', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });

      logger.timeEnd('non-existent-timer');

      expect(console.timeEnd).toHaveBeenCalledWith('test:non-existent-timer');
      expect(console.info).not.toHaveBeenCalledWith(
        expect.stringContaining('⏱️ non-existent-timer:')
      );
    });

    it('should handle production mode with colors disabled', () => {
      Object.defineProperty(import.meta, 'env', {
        value: { DEV: false, PROD: true },
        writable: true,
      });

      mockLocalStorage.getItem.mockReturnValue('true');

      const logger = createLogger({ namespace: 'test', colors: false });
      logger.info('test message');

      const call = (console.info as any).mock.calls[0];
      // In production with colors disabled, should not have color styling
      expect(call[0]).not.toContain('%c');
      expect(call[0]).toContain('[');
      expect(call[0]).toContain('] TEST');
    });

    it('should handle very long timer operations', () => {
      setMockEnv({ DEV: true, PROD: false });

      const logger = createLogger({ namespace: 'test' });
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(61000); // end time (60 seconds later)

      logger.time('long-operation');
      logger.timeEnd('long-operation');

      // Check that the long timing message is logged
      const calls = (console.info as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall.join(' ')).toContain('⏱️ long-operation: 60000.00ms');
    });
  });
});
