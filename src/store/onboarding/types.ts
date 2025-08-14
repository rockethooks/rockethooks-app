/**
 * Type definitions for the onboarding state machine
 */

/**
 * All possible states in the onboarding flow
 */
export enum OnboardingStates {
  INITIAL_SETUP = 'initialSetup',
  TOUR_ACTIVE = 'tourActive',
  COMPLETED = 'completed',
  ERROR = 'error',
}

/**
 * All possible events that can trigger state transitions
 */
export enum OnboardingEvents {
  BEGIN = 'BEGIN',
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  SKIP_ORGANIZATION = 'SKIP_ORGANIZATION',
  START_TOUR = 'START_TOUR',
  NEXT_TOUR_STEP = 'NEXT_TOUR_STEP',
  SKIP_TOUR = 'SKIP_TOUR',
  COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING',
  ERROR = 'ERROR',
  RETRY = 'RETRY',
  RESET = 'RESET',
}

/**
 * Context data structure for the onboarding state machine
 */
export interface OnboardingContext {
  // User information
  userId?: string;
  organizationId?: string | undefined;

  // Organization setup
  suggestedOrganizationName?: string;
  organizationName?: string;
  isCreatingOrganization: boolean;
  organizationCreationError?: string;

  // Tour progress (3 meaningful steps)
  currentTourStep: number;
  totalTourSteps: number;
  completedTourSteps: Set<string>;
  skippedTour: boolean;

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
  };
}

/**
 * Configuration for onboarding steps
 */
export interface StepConfig {
  id: string;
  title: string;
  description: string;
  state: OnboardingStates;
}

/**
 * Event payload types
 */
export interface OnboardingEventPayload {
  [OnboardingEvents.BEGIN]?: {
    userId: string;
    email?: string;
    displayName?: string;
  };
  [OnboardingEvents.ORGANIZATION_CREATED]?: {
    organizationId: string;
    organizationName: string;
  };
  [OnboardingEvents.SKIP_ORGANIZATION]?: undefined;
  [OnboardingEvents.START_TOUR]?: undefined;
  [OnboardingEvents.NEXT_TOUR_STEP]?: { stepData?: Record<string, unknown> };
  [OnboardingEvents.SKIP_TOUR]?: undefined;
  [OnboardingEvents.COMPLETE_ONBOARDING]?: undefined;
  [OnboardingEvents.ERROR]?: { error: string; code?: string; field?: string };
  [OnboardingEvents.RETRY]?: undefined;
  [OnboardingEvents.RESET]?: undefined;
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

  // Organization setup
  initializeWithUserInfo: (
    userId: string,
    email?: string,
    displayName?: string
  ) => void;
  createOrganization: (organizationName: string) => Promise<boolean>;
  skipOrganization: () => boolean;

  // Tour management
  startTour: () => boolean;
  nextTourStep: (stepData?: Record<string, unknown>) => boolean;
  skipTour: () => boolean;
  completeOnboarding: () => boolean;

  // Progress helpers
  getProgress: () => {
    current: number;
    total: number;
    percentage: number;
    tourStepsCompleted: string[];
    skippedTour: boolean;
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
