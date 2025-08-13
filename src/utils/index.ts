/**
 * Utility functions and hooks for the RocketHooks application
 */

// Professional logging system
export {
  type AsyncMeasurementResult,
  // Logger creation and configuration
  createLogger,
  disableDebugLogging,
  enableDebugLogging,
  type LoggerConfig,
  // Types
  type LoggerInterface,
  type LogLevel,
  // Main logger instance
  logger,
  loggers,
  type PerformanceMeasurement,
} from './logger';
// Onboarding draft management
export {
  type ApiTargetDraft,
  type AutoSaveResult,
  clearDrafts,
  clearStepDraft,
  type DraftData,
  getAllDrafts,
  getDraft,
  type OnboardingStep,
  // Types
  type OrganizationDraft,
  type PreferencesDraft,
  // Functions
  saveDraft,
  // Hooks
  useAutoSaveDraft,
  type WebhookDraft,
} from './onboardingDrafts';
