// ========================================================================================
// Onboarding State Machine Types
// ========================================================================================

/**
 * Organization data interface for type safety
 */
export interface OrganizationData {
  name: string
  size?: string
  industry?: string
  description?: string
}

/**
 * Profile data interface
 */
export interface ProfileData {
  firstName?: string
  lastName?: string
  role?: string
  company?: string
}

/**
 * Preferences data interface
 */
export interface PreferencesData {
  notifications?: boolean
  marketing?: boolean
  analytics?: boolean
}

/**
 * Union type for all draft data types
 */
export type DraftDataTypes = OrganizationData | ProfileData | PreferencesData

/**
 * Onboarding states using discriminated unions for type safety
 */
export type OnboardingState =
  | { type: 'START' }
  | { type: 'CHECK_ORGANIZATION'; checking: boolean }
  | { type: 'ORGANIZATION_SETUP'; draft?: OrganizationData }
  | {
      type: 'PROFILE_COMPLETION'
      organizationId: string
      draft?: ProfileData
    }
  | { type: 'PREFERENCES'; draft?: PreferencesData }
  | { type: 'COMPLETION' }
  | { type: 'DASHBOARD' }
  | { type: 'ERROR'; error: string; previousState: OnboardingState }

/**
 * Events that can trigger state transitions
 */
export enum OnboardingEvent {
  BEGIN = 'BEGIN',
  HAS_ORGANIZATION = 'HAS_ORGANIZATION',
  NO_ORGANIZATION = 'NO_ORGANIZATION',
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  PREFERENCES_SAVED = 'PREFERENCES_SAVED',
  SKIP_PREFERENCES = 'SKIP_PREFERENCES',
  COMPLETE = 'COMPLETE',
  RESET = 'RESET',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  RETRY = 'RETRY',
  GO_BACK = 'GO_BACK',
}

/**
 * Context data that persists across state transitions
 */
export interface OnboardingContext {
  userId: string
  organizationId: string | null
  completedSteps: Set<string>
  skippedSteps: Set<string>
  currentStep: number
  totalSteps: number
  isComplete: boolean
  startedAt: string | null
  completedAt: string | null
  errors: Array<{ timestamp: string; error: string; state: string }>
}

/**
 * State transition definition
 */
export interface StateTransition {
  from: string // State type
  event: OnboardingEvent
  to: string // State type
  guard?: (context: OnboardingContext, payload?: DraftDataTypes) => boolean
  action?: (context: OnboardingContext) => void
}

/**
 * Progress tracking interface
 */
export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  percentage: number
  completedSteps: string[]
  skippedSteps: string[]
  canGoBack: boolean
  canSkip: boolean
  canProceed: boolean
}

/**
 * Step configuration
 */
export interface OnboardingStepConfig {
  id: string
  name: string
  route: string
  canSkip: boolean
  canGoBack: boolean
  requiresValidation: boolean
  order: number
}

/**
 * Navigation helpers
 */
export interface OnboardingNavigation {
  currentRoute: string
  availableRoutes: string[]
  isFirstStep: boolean
  isLastStep: boolean
}
