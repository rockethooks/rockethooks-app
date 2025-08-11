/**
 * Onboarding State Machine Types and Interfaces
 *
 * This file defines the complete type system for the onboarding state machine,
 * using discriminated unions for type safety and clear state transitions.
 *
 * Architecture: Hybrid approach separating concerns
 * - State Machine (Zustand): Navigation state, transitions, persistence
 * - Draft System (Existing): Form data persistence with 7-day expiry
 */

import type {
  OnboardingStep,
  OrganizationDraft,
  PreferencesDraft,
} from '@/utils/onboardingDrafts'

// ========================================================================================
// State Definitions - Using Discriminated Unions for Better Type Safety
// ========================================================================================

/**
 * Onboarding state definitions using discriminated unions
 * Each state has a 'type' field for discrimination and optional additional data
 */
export type OnboardingState =
  | { type: 'START' }
  | { type: 'CHECK_ORGANIZATION'; checking: boolean }
  | { type: 'ORGANIZATION_SETUP'; draft?: OrganizationDraft }
  | { type: 'PROFILE_COMPLETION'; organizationId: string; draft?: ProfileDraft }
  | { type: 'PREFERENCES'; draft?: PreferencesDraft }
  | { type: 'COMPLETION'; completedAt?: string }
  | { type: 'DASHBOARD' }
  | {
      type: 'ERROR'
      error: string
      previousState: OnboardingState
      canRetry: boolean
    }

/**
 * Profile draft data collected during onboarding
 * Extends the existing draft system with profile-specific data
 */
export interface ProfileDraft {
  firstName?: string
  lastName?: string
  role?: 'developer' | 'manager' | 'admin' | 'other'
  experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  useCases?: string[]
  avatar?: string
}

// ========================================================================================
// Event Definitions
// ========================================================================================

/**
 * All possible events that can be sent to the state machine
 * Events trigger state transitions when guard conditions are met
 */
export enum OnboardingEvent {
  // Navigation events
  BEGIN = 'BEGIN',
  NEXT = 'NEXT',
  BACK = 'BACK',
  SKIP = 'SKIP',
  RETRY = 'RETRY',
  RESET = 'RESET',

  // State-specific events
  HAS_ORGANIZATION = 'HAS_ORGANIZATION',
  NO_ORGANIZATION = 'NO_ORGANIZATION',
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  PREFERENCES_SAVED = 'PREFERENCES_SAVED',
  SKIP_PREFERENCES = 'SKIP_PREFERENCES',
  COMPLETE = 'COMPLETE',

  // Error handling
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  ERROR_RECOVERED = 'ERROR_RECOVERED',
}

// ========================================================================================
// Context and Progress Tracking
// ========================================================================================

/**
 * Context data that persists across state transitions
 * Contains user data, progress tracking, and error history
 */
export interface OnboardingContext {
  // User identification
  userId: string
  organizationId: string | null

  // Progress tracking
  completedSteps: Set<string>
  skippedSteps: Set<string>
  currentStep: number
  totalSteps: number
  isComplete: boolean

  // Timing information
  startedAt: string | null
  completedAt: string | null
  lastActiveAt: string | null

  // Error tracking
  errors: Array<{
    timestamp: string
    error: string
    state: string
    recovered: boolean
  }>

  // Navigation history for back functionality
  stateHistory: OnboardingState[]

  // Feature flags and configuration
  config: {
    skipPreferences: boolean
    requireProfile: boolean
    enableAnalytics: boolean
  }
}

// ========================================================================================
// Transition Definitions
// ========================================================================================

/**
 * State transition definition with guard conditions and side effects
 */
export interface StateTransition {
  from: string // State type
  event: OnboardingEvent
  to: string // State type
  guard?: (context: OnboardingContext, payload?: any) => boolean
  action?: (context: OnboardingContext, payload?: any) => void
  description?: string // For debugging and documentation
}

/**
 * Guard condition function type
 */
export type GuardCondition = (
  context: OnboardingContext,
  payload?: any
) => boolean

/**
 * Action function type for side effects
 */
export type StateAction = (context: OnboardingContext, payload?: any) => void

// ========================================================================================
// Progress and Navigation Types
// ========================================================================================

/**
 * Progress information returned by the state machine
 */
export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  percentage: number
  completedSteps: string[]
  skippedSteps: string[]
  canGoBack: boolean
  canSkip: boolean
  isFirstStep: boolean
  isLastStep: boolean
  estimatedTimeRemaining: number // in minutes
}

/**
 * Navigation capabilities for the current state
 */
export interface NavigationCapabilities {
  canGoBack: boolean
  canSkip: boolean
  canRetry: boolean
  canReset: boolean
  nextEvent: OnboardingEvent | null
  backEvent: OnboardingEvent | null
  skipEvent: OnboardingEvent | null
}

// ========================================================================================
// Step Configuration
// ========================================================================================

/**
 * Configuration for each onboarding step
 */
export interface StepConfiguration {
  name: string
  title: string
  description: string
  component: string // Component name for routing
  path: string // URL path
  estimatedTime: number // in minutes
  required: boolean
  canSkip: boolean
  validation?: {
    requiresDraft: boolean
    minimumCompletion: number // percentage
  }
}

/**
 * Complete onboarding flow configuration
 */
export interface OnboardingFlowConfiguration {
  steps: Record<string, StepConfiguration>
  transitions: StateTransition[]
  defaultConfig: OnboardingContext['config']
  totalEstimatedTime: number
}

// ========================================================================================
// Error Handling Types
// ========================================================================================

/**
 * Error types that can occur during onboarding
 */
export enum OnboardingErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  STATE_MACHINE_ERROR = 'STATE_MACHINE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured error information
 */
export interface OnboardingError {
  type: OnboardingErrorType
  message: string
  code?: string
  details?: Record<string, any>
  timestamp: string
  state: string
  canRetry: boolean
  retryCount: number
  maxRetries: number
}

/**
 * Error recovery strategy
 */
export interface ErrorRecoveryStrategy {
  type: OnboardingErrorType
  canAutoRecover: boolean
  recoveryAction?: () => Promise<boolean>
  fallbackState?: OnboardingState
  userMessage: string
  retryable: boolean
}

// ========================================================================================
// Store Interface
// ========================================================================================

/**
 * Main interface for the onboarding store
 * Defines all actions and state management functions
 */
export interface OnboardingStore {
  // Current state
  currentState: OnboardingState
  context: OnboardingContext

  // State machine configuration
  transitions: StateTransition[]
  flowConfig: OnboardingFlowConfiguration

  // Core state machine actions
  sendEvent: (event: OnboardingEvent, payload?: any) => Promise<boolean>
  canTransition: (event: OnboardingEvent, payload?: any) => boolean

  // Navigation actions
  goNext: () => Promise<boolean>
  goBack: () => Promise<boolean>
  skip: () => Promise<boolean>
  retry: () => Promise<boolean>
  reset: () => void

  // Progress and status
  getProgress: () => OnboardingProgress
  getNavigationCapabilities: () => NavigationCapabilities
  getCurrentStepConfig: () => StepConfiguration | null

  // Error handling
  handleError: (error: OnboardingError) => void
  clearErrors: () => void
  getLastError: () => OnboardingError | null

  // Integration with draft system
  validateCurrentStep: () => boolean
  getCurrentDraft: () => any
  hasValidDraft: (step?: OnboardingStep) => boolean

  // Analytics and monitoring
  trackEvent: (event: string, properties?: Record<string, any>) => void
  getSessionDuration: () => number
  getCompletionRate: () => number
}

// ========================================================================================
// Utility Types
// ========================================================================================

/**
 * Type guard to check if a state is a specific type
 */
export type StateTypeGuard<T extends OnboardingState['type']> = (
  state: OnboardingState
) => state is Extract<OnboardingState, { type: T }>

/**
 * Extract payload type from event
 */
export type EventPayload<T extends OnboardingEvent> =
  T extends OnboardingEvent.ORGANIZATION_CREATED
    ? OrganizationDraft
    : T extends OnboardingEvent.PROFILE_COMPLETED
      ? ProfileDraft
      : T extends OnboardingEvent.PREFERENCES_SAVED
        ? PreferencesDraft
        : T extends OnboardingEvent.ERROR_OCCURRED
          ? OnboardingError
          : any

/**
 * Serializable version of OnboardingContext for persistence
 * Converts Sets to Arrays for JSON serialization
 */
export interface SerializableOnboardingContext {
  userId: string
  organizationId: string | null
  completedSteps: string[]
  skippedSteps: string[]
  currentStep: number
  totalSteps: number
  isComplete: boolean
  startedAt: string | null
  completedAt: string | null
  lastActiveAt: string | null
  errors: OnboardingContext['errors']
  stateHistory: OnboardingState[]
  config: OnboardingContext['config']
}

// ========================================================================================
// Constants
// ========================================================================================

/**
 * Default step names that correspond to the existing draft system
 */
export const ONBOARDING_STEPS = {
  ORGANIZATION: 'organization',
  PROFILE: 'profile',
  PREFERENCES: 'preferences',
  API_TARGET: 'apiTarget',
  WEBHOOK: 'webhook',
} as const

/**
 * State machine configuration constants
 */
export const STATE_MACHINE_CONFIG = {
  STORAGE_KEY: 'onboarding-state-machine',
  VERSION: '1.0.0',
  MAX_HISTORY_LENGTH: 10,
  MAX_ERROR_HISTORY: 50,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  AUTO_SAVE_DEBOUNCE: 1000, // 1 second
} as const

/**
 * Step timing estimates in minutes
 */
export const STEP_ESTIMATES = {
  [ONBOARDING_STEPS.ORGANIZATION]: 3,
  [ONBOARDING_STEPS.PROFILE]: 2,
  [ONBOARDING_STEPS.PREFERENCES]: 1,
  [ONBOARDING_STEPS.API_TARGET]: 5,
  [ONBOARDING_STEPS.WEBHOOK]: 4,
} as const
