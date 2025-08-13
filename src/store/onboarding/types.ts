/**
 * Type definitions for the onboarding state machine
 */

/**
 * All possible states in the onboarding flow
 */
export enum OnboardingStates {
  START = 'start',
  CHECK_ORGANIZATION = 'checkOrganization',
  ORGANIZATION_SETUP = 'organizationSetup',
  PROFILE_COMPLETION = 'profileCompletion',
  PREFERENCES_SETUP = 'preferencesSetup',
  ACCOUNT_SETUP = 'accountSetup',
  COMPLETE = 'complete',
  ERROR = 'error',
}

/**
 * All possible events that can trigger state transitions
 */
export enum OnboardingEvents {
  BEGIN = 'BEGIN',
  HAS_ORGANIZATION = 'HAS_ORGANIZATION',
  NO_ORGANIZATION = 'NO_ORGANIZATION',
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  SKIP_ORGANIZATION = 'SKIP_ORGANIZATION',
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  PREFERENCES_SAVED = 'PREFERENCES_SAVED',
  SKIP_PREFERENCES = 'SKIP_PREFERENCES',
  ACCOUNT_COMPLETED = 'ACCOUNT_COMPLETED',
  SKIP = 'SKIP',
  BACK = 'BACK',
  ERROR = 'ERROR',
  RETRY = 'RETRY',
}

/**
 * Context data structure for the onboarding state machine
 */
export interface OnboardingContext {
  // User information
  userId?: string;
  organizationId?: string | undefined;

  // Progress tracking
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<string>;
  skippedSteps: Set<string>;

  // State flags
  isComplete: boolean;
  isLoading: boolean;

  // Error handling
  errors: Array<{
    code: string;
    message: string;
    field?: string | undefined;
    timestamp: string;
  }>;

  // Timestamps
  startedAt?: string;
  completedAt?: string;
  lastUpdatedAt?: string;

  // Form data (temporary storage)
  draftData?: {
    organization?: Record<string, unknown>;
    profile?: Record<string, unknown>;
    preferences?: Record<string, unknown>;
  };
}

/**
 * Configuration for onboarding steps
 */
export interface StepConfig {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  canSkip: boolean;
  state: OnboardingStates;
  validationRules?: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

/**
 * Event payload types
 */
export interface OnboardingEventPayload {
  [OnboardingEvents.BEGIN]?: { userId: string };
  [OnboardingEvents.HAS_ORGANIZATION]?: { organizationId: string };
  [OnboardingEvents.NO_ORGANIZATION]?: undefined;
  [OnboardingEvents.ORGANIZATION_CREATED]?: { organizationId: string };
  [OnboardingEvents.SKIP_ORGANIZATION]?: undefined;
  [OnboardingEvents.PROFILE_COMPLETED]?: {
    profileData: Record<string, unknown>;
  };
  [OnboardingEvents.PREFERENCES_SAVED]?: {
    preferences: Record<string, unknown>;
  };
  [OnboardingEvents.SKIP_PREFERENCES]?: undefined;
  [OnboardingEvents.ACCOUNT_COMPLETED]?: {
    accountData: Record<string, unknown>;
  };
  [OnboardingEvents.SKIP]?: undefined;
  [OnboardingEvents.BACK]?: undefined;
  [OnboardingEvents.ERROR]?: { error: string; code?: string };
  [OnboardingEvents.RETRY]?: undefined;
}

/**
 * Transition configuration
 */
export interface TransitionConfig {
  from: OnboardingStates;
  event: OnboardingEvents;
  to: OnboardingStates;
  guard?: (context: OnboardingContext) => boolean;
  action?: (context: OnboardingContext, payload?: unknown) => void;
}

/**
 * Store interface for the onboarding state machine
 */
export interface OnboardingStore {
  // State
  currentState: OnboardingStates;
  context: OnboardingContext;
  transitions: TransitionConfig[];

  // Actions
  sendEvent: (event: OnboardingEvents, payload?: unknown) => boolean;
  updateContext: (updates: Partial<OnboardingContext>) => void;
  reset: () => void;

  // Navigation helpers
  goBack: () => boolean;
  skip: () => boolean;
  canGoBack: () => boolean;
  canSkip: () => boolean;

  // Progress helpers
  getProgress: () => {
    current: number;
    total: number;
    percentage: number;
    completedSteps: string[];
    skippedSteps: string[];
  };

  // State checks
  isInState: (state: OnboardingStates) => boolean;
  canTransition: (event: OnboardingEvents) => boolean;

  // Error handling
  clearErrors: () => void;
  addError: (
    error: { code: string; message: string; field?: string } | string
  ) => void;
}
