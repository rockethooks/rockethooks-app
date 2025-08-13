/**
 * Professional Logger Utility for RocketHooks
 *
 * Provides a comprehensive logging system with:
 * - Development/production mode detection
 * - Color-coded log levels
 * - Namespaced logging
 * - Performance tracking
 * - Child logger creation
 * - Pre-configured loggers for common modules
 */

// ============================================================================
// TypeScript Interfaces and Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'log';

export interface LoggerConfig {
  namespace?: string;
  enabled?: boolean;
  level?: LogLevel;
  colors?: boolean;
}

export interface PerformanceMeasurement {
  name: string;
  duration: number;
  timestamp: number;
}

export interface AsyncMeasurementResult<T> {
  result: T;
  measurement: PerformanceMeasurement;
}

export interface LoggerInterface {
  // Core logging methods
  log: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  success: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;

  // Utility methods
  table: (data: unknown) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;

  // Performance tracking
  measure: (name: string, fn: () => void) => PerformanceMeasurement;
  measureAsync: <T>(
    name: string,
    fn: () => Promise<T>
  ) => Promise<AsyncMeasurementResult<T>>;

  // Child logger creation
  child: (namespace: string) => LoggerInterface;

  // Configuration
  setLevel: (level: LogLevel) => void;
  enable: () => void;
  disable: () => void;
}

// ============================================================================
// Logger Implementation
// ============================================================================

class Logger implements LoggerInterface {
  private config: Required<LoggerConfig>;
  private timers: Map<string, number> = new Map();
  private cachedTimestamp: string = '';
  private lastTimestampUpdate: number = 0;

  // Color codes for different log levels (browser console compatible)
  private static readonly COLORS = {
    debug: '#6B7280', // Gray
    info: '#3B82F6', // Blue
    success: '#10B981', // Green
    warn: '#F59E0B', // Amber
    error: '#EF4444', // Red
    log: '#374151', // Dark gray
  } as const;

  // Log level hierarchy for filtering
  private static readonly LEVELS = {
    debug: 0,
    log: 1,
    info: 2,
    success: 3,
    warn: 4,
    error: 5,
  } as const;

  // Maximum number of timers to prevent unbounded growth
  private static readonly MAX_TIMERS = 100;

  constructor(config: LoggerConfig = {}) {
    // Validate config
    if (config.level && !Object.keys(Logger.LEVELS).includes(config.level)) {
      throw new Error(`Invalid log level: ${config.level}`);
    }

    this.config = {
      namespace: config.namespace ?? 'app',
      enabled: config.enabled ?? this.isEnabled(),
      level: config.level ?? 'debug',
      colors: config.colors ?? true,
    };
  }

  // ============================================================================
  // Environment Detection
  // ============================================================================

  private isEnabled(): boolean {
    // Enable logging in development mode
    if (import.meta.env.DEV) {
      return true;
    }

    // In production, only enable if explicitly requested via localStorage
    if (import.meta.env.PROD) {
      try {
        return localStorage.getItem('rockethooks:debug') === 'true';
      } catch (error) {
        // Could be SecurityError, QuotaExceededError, etc.
        this.warn('Failed to access localStorage for debug setting:', error);
        return false;
      }
    }

    return false;
  }

  private isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  // ============================================================================
  // Core Logging Methods
  // ============================================================================

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    const currentLevel =
      Logger.LEVELS[this.config.level as keyof typeof Logger.LEVELS];
    const messageLevel = Logger.LEVELS[level as keyof typeof Logger.LEVELS];
    return messageLevel >= currentLevel;
  }

  private getCachedTimestamp(): string {
    const now = Date.now();
    if (now - this.lastTimestampUpdate > 1000) {
      // Update every second
      this.cachedTimestamp =
        new Date(now).toISOString().split('T')[1]?.split('.')[0] ?? '';
      this.lastTimestampUpdate = now;
    }
    return this.cachedTimestamp;
  }

  private sanitizeLogData(data: unknown): unknown {
    if (data === null || data === undefined) return data;

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'apiKey',
      'privateKey',
    ];

    if (typeof data === 'object' && !Array.isArray(data)) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (
          sensitiveKeys.some((sensitive) =>
            key.toLowerCase().includes(sensitive.toLowerCase())
          )
        ) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeLogData(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeLogData(item));
    }

    return data;
  }

  private formatMessage(
    level: LogLevel,
    ...args: unknown[]
  ): [string, ...unknown[]] {
    const timestamp = this.getCachedTimestamp();
    const namespace = this.config.namespace;

    if (this.config.colors && this.isDevelopment()) {
      const color = Logger.COLORS[level];
      const prefix = `%c[${timestamp}] ${namespace.toUpperCase()}`;
      const style = `color: ${color}; font-weight: bold;`;
      return [prefix, style, ...args];
    }

    const prefix = `[${timestamp}] ${namespace.toUpperCase()}`;
    return [prefix, ...args];
  }

  log = (...args: unknown[]): void => {
    if (!this.shouldLog('log')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage('log', ...sanitizedArgs);
    console.log(prefix, ...rest);
  };

  debug = (...args: unknown[]): void => {
    if (!this.shouldLog('debug')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage('debug', ...sanitizedArgs);
    console.debug(prefix, ...rest);
  };

  info = (...args: unknown[]): void => {
    if (!this.shouldLog('info')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage('info', ...sanitizedArgs);
    console.info(prefix, ...rest);
  };

  success = (...args: unknown[]): void => {
    if (!this.shouldLog('success')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage(
      'success',
      '✅',
      ...sanitizedArgs
    );
    console.log(prefix, ...rest);
  };

  warn = (...args: unknown[]): void => {
    if (!this.shouldLog('warn')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage('warn', '⚠️', ...sanitizedArgs);
    console.warn(prefix, ...rest);
  };

  error = (...args: unknown[]): void => {
    if (!this.shouldLog('error')) return;
    const sanitizedArgs = args.map((arg) => this.sanitizeLogData(arg));
    const [prefix, ...rest] = this.formatMessage(
      'error',
      '❌',
      ...sanitizedArgs
    );
    console.error(prefix, ...rest);
  };

  // ============================================================================
  // Utility Methods
  // ============================================================================

  table = (data: unknown): void => {
    if (!this.config.enabled) return;
    this.info('Table data:');
    console.table(data);
  };

  group = (label: string): void => {
    if (!this.config.enabled) return;
    const [prefix, ...rest] = this.formatMessage('info', label);
    console.group(prefix, ...rest);
  };

  groupEnd = (): void => {
    if (!this.config.enabled) return;
    console.groupEnd();
  };

  time = (label: string): void => {
    if (!this.config.enabled) return;
    if (this.timers.size >= Logger.MAX_TIMERS) {
      const oldestKey = this.timers.keys().next().value;
      if (oldestKey !== undefined) {
        this.timers.delete(oldestKey);
      }
    }
    const fullLabel = `${this.config.namespace}:${label}`;
    this.timers.set(label, performance.now());
    console.time(fullLabel);
  };

  timeEnd = (label: string): void => {
    if (!this.config.enabled) return;
    const fullLabel = `${this.config.namespace}:${label}`;
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.timers.delete(label);
      this.info(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
    console.timeEnd(fullLabel);
  };

  // ============================================================================
  // Performance Tracking
  // ============================================================================

  measure = (name: string, fn: () => void): PerformanceMeasurement => {
    const startTime = performance.now();
    const timestamp = Date.now();

    fn();

    const duration = performance.now() - startTime;
    const measurement: PerformanceMeasurement = { name, duration, timestamp };

    if (this.config.enabled) {
      this.info(`📊 Performance [${name}]: ${duration.toFixed(2)}ms`);
    }

    return measurement;
  };

  measureAsync = async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<AsyncMeasurementResult<T>> => {
    const startTime = performance.now();
    const timestamp = Date.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      const measurement: PerformanceMeasurement = { name, duration, timestamp };

      if (this.config.enabled) {
        this.info(`📊 Async Performance [${name}]: ${duration.toFixed(2)}ms`);
      }

      return { result, measurement };
    } catch (error) {
      const duration = performance.now() - startTime;

      if (this.config.enabled) {
        this.error(
          `📊 Async Performance [${name}] FAILED: ${duration.toFixed(2)}ms`,
          error
        );
      }

      throw error;
    }
  };

  // ============================================================================
  // Child Logger Creation
  // ============================================================================

  child = (namespace: string): LoggerInterface => {
    const fullNamespace = `${this.config.namespace}:${namespace}`;
    return new Logger({
      ...this.config,
      namespace: fullNamespace,
    });
  };

  // ============================================================================
  // Configuration Methods
  // ============================================================================

  setLevel = (level: LogLevel): void => {
    this.config.level = level;
  };

  enable = (): void => {
    this.config.enabled = true;
  };

  disable = (): void => {
    this.config.enabled = false;
  };
}

// ============================================================================
// Default Logger Instance
// ============================================================================

export const logger = new Logger({ namespace: 'rockethooks' });

// ============================================================================
// Pre-configured Namespaced Loggers
// ============================================================================

export const loggers = {
  // Core application modules
  onboarding: logger.child('onboarding'),
  auth: logger.child('auth'),
  api: logger.child('api'),
  graphql: logger.child('graphql'),
  store: logger.child('store'),
  router: logger.child('router'),
  ui: logger.child('ui'),

  // Technical modules
  performance: logger.child('performance'),
  validation: logger.child('validation'),

  // Development utilities
  dev: logger.child('dev'),
  debug: logger.child('debug'),
} as const;

// ============================================================================
// Development Helper Functions
// ============================================================================

/**
 * Enable debug logging in production (persists in localStorage)
 */
export const enableDebugLogging = (): void => {
  try {
    localStorage.setItem('rockethooks:debug', 'true');
    logger.success('Debug logging enabled');
  } catch (error) {
    console.warn('Failed to enable debug logging:', error);
  }
};

/**
 * Disable debug logging in production
 */
export const disableDebugLogging = (): void => {
  try {
    localStorage.removeItem('rockethooks:debug');
    logger.info('Debug logging disabled');
  } catch (error) {
    console.warn('Failed to disable debug logging:', error);
  }
};

/**
 * Create a logger with custom configuration
 */
export const createLogger = (config: LoggerConfig): LoggerInterface => {
  return new Logger(config);
};

// ============================================================================
// Default Export
// ============================================================================

export default logger;
