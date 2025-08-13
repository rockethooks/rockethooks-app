import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getDraft, validateDraft } from '@/utils/onboardingDrafts';
// import type {
//   OrganizationData,
//   ProfileData,
//   PreferencesData,
// } from '@/types/onboarding';
import { createDevtoolsConfig } from '../devtools.config';

// ========================================================================================
// Onboarding State Machine Enums and Types
// ========================================================================================

/**
 * All possible states in the onboarding flow
 */
export enum OnboardingStates {
  START = 'START',
  CHECK_ORGANIZATION = 'CHECK_ORGANIZATION',
  ORGANIZATION_SETUP = 'ORGANIZATION_SETUP',
  PROFILE_COMPLETION = 'PROFILE_COMPLETION',
  PREFERENCES = 'PREFERENCES',
  COMPLETION = 'COMPLETION',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR',
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
  COMPLETE = 'COMPLETE',
  RESET = 'RESET',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  RETRY = 'RETRY',
  GO_BACK = 'GO_BACK',
}

/**
 * Context for onboarding state machine
 */
export interface OnboardingContext {
  userId: string;
  organizationId: string | null;
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<string>;
  skippedSteps: Set<string>;
  isComplete: boolean;
  startedAt: string | null;
  completedAt: string | null;
  errors: Array<{ timestamp: string; error: string; state: string }>;
}

/**
 * Progress tracking interface
 */
export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  completedSteps: string[];
  skippedSteps: string[];
  canGoBack: boolean;
  canSkip: boolean;
  canProceed: boolean;
}

/**
 * State transition definition
 */
interface StateTransition {
  from: OnboardingStates;
  event: OnboardingEvents;
  to: OnboardingStates;
  guard?: (
    context: OnboardingContext,
    payload?: Record<string, unknown>
  ) => boolean;
  action?: (context: OnboardingContext) => void;
}

// ========================================================================================
// Context Creation and Utilities
// ========================================================================================

/**
 * Creates the initial context for the onboarding state machine
 */
function createInitialContext(): OnboardingContext {
  // Calculate total steps dynamically from step configuration
  const totalSteps = Object.keys(stepConfigs).length;

  return {
    userId: '',
    organizationId: null,
    currentStep: 0,
    totalSteps,
    completedSteps: new Set<string>(),
    skippedSteps: new Set<string>(),
    isComplete: false,
    startedAt: null,
    completedAt: null,
    errors: [],
  };
}

// ========================================================================================
// Step Configuration
// ========================================================================================

/**
 * Step configurations for navigation and validation
 */
const stepConfigs = {
  [OnboardingStates.ORGANIZATION_SETUP]: {
    id: 'organization',
    name: 'Organization Setup',
    canSkip: true,
    canGoBack: false,
    requiresValidation: true,
    order: 1,
    route: '/onboarding/organization',
  },
  [OnboardingStates.PROFILE_COMPLETION]: {
    id: 'profile',
    name: 'Profile Completion',
    canSkip: false,
    canGoBack: true,
    requiresValidation: false,
    order: 2,
    route: '/onboarding/profile',
  },
  [OnboardingStates.PREFERENCES]: {
    id: 'preferences',
    name: 'Preferences',
    canSkip: true,
    canGoBack: true,
    requiresValidation: false,
    order: 3,
    route: '/onboarding/preferences',
  },
  [OnboardingStates.COMPLETION]: {
    id: 'completion',
    name: 'Completion',
    canSkip: false,
    canGoBack: false,
    requiresValidation: false,
    order: 4,
    route: '/onboarding/complete',
  },
} as const;

// ========================================================================================
// State Machine Transitions
// ========================================================================================

/**
 * All state transitions for the onboarding flow using the new state machine pattern
 */
const transitions: StateTransition[] = [
  // Start flow
  {
    from: OnboardingStates.START,
    event: OnboardingEvents.BEGIN,
    to: OnboardingStates.CHECK_ORGANIZATION,
    action: (context) => {
      context.startedAt = new Date().toISOString();
    },
  },

  // Organization check results
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
    event: OnboardingEvents.HAS_ORGANIZATION,
    to: OnboardingStates.PROFILE_COMPLETION,
    guard: (context) => !!context.organizationId,
    action: (context) => {
      context.skippedSteps.add('organization');
      context.currentStep = 2;
    },
  },
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
    event: OnboardingEvents.NO_ORGANIZATION,
    to: OnboardingStates.ORGANIZATION_SETUP,
    action: (context) => {
      context.currentStep = 1;
    },
  },

  // Organization setup completion
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.ORGANIZATION_CREATED,
    to: OnboardingStates.PROFILE_COMPLETION,
    guard: (_context) => {
      const draft = getDraft('organization');
      return validateDraft('organization', draft);
    },
    action: (context) => {
      context.completedSteps.add('organization');
      context.currentStep = 2;
    },
  },

  // Skip organization setup
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.SKIP_ORGANIZATION,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: (context) => {
      context.skippedSteps.add('organization');
      context.currentStep = 2;
    },
  },

  // Profile completion
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.PROFILE_COMPLETED,
    to: OnboardingStates.PREFERENCES,
    action: (context) => {
      context.completedSteps.add('profile');
      context.currentStep = 3;
    },
  },

  // Preferences handling
  {
    from: OnboardingStates.PREFERENCES,
    event: OnboardingEvents.PREFERENCES_SAVED,
    to: OnboardingStates.COMPLETION,
    action: (context) => {
      context.completedSteps.add('preferences');
      context.currentStep = 4;
    },
  },
  {
    from: OnboardingStates.PREFERENCES,
    event: OnboardingEvents.SKIP_PREFERENCES,
    to: OnboardingStates.COMPLETION,
    action: (context) => {
      context.skippedSteps.add('preferences');
      context.currentStep = 4;
    },
  },

  // Final completion
  {
    from: OnboardingStates.COMPLETION,
    event: OnboardingEvents.COMPLETE,
    to: OnboardingStates.DASHBOARD,
    action: (context) => {
      context.isComplete = true;
      context.completedAt = new Date().toISOString();
    },
  },

  // Go back transitions
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.GO_BACK,
    to: OnboardingStates.ORGANIZATION_SETUP,
    guard: (context) => !context.skippedSteps.has('organization'),
    action: (context) => {
      context.currentStep = Math.max(1, context.currentStep - 1);
    },
  },
  {
    from: OnboardingStates.PREFERENCES,
    event: OnboardingEvents.GO_BACK,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: (context) => {
      context.currentStep = Math.max(2, context.currentStep - 1);
    },
  },

  // Error handling
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.ERROR_OCCURRED,
    to: OnboardingStates.ERROR,
  },
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.ERROR_OCCURRED,
    to: OnboardingStates.ERROR,
  },
  {
    from: OnboardingStates.PREFERENCES,
    event: OnboardingEvents.ERROR_OCCURRED,
    to: OnboardingStates.ERROR,
  },

  // Retry from error
  {
    from: OnboardingStates.ERROR,
    event: OnboardingEvents.RETRY,
    to: OnboardingStates.START, // Will be overridden by the previousState
  },

  // Reset from any state
  {
    from: OnboardingStates.START,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.PREFERENCES,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.COMPLETION,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
  {
    from: OnboardingStates.ERROR,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.START,
  },
];

// ========================================================================================
// Utility Functions
// ========================================================================================

/**
 * Find transition for current state + event
 */
function findTransition(
  currentState: OnboardingStates,
  event: OnboardingEvents,
  allTransitions: StateTransition[]
): StateTransition | null {
  return (
    allTransitions.find((t) => t.from === currentState && t.event === event) ??
    null
  );
}

/**
 * Get next event based on current state
 */
function getNextEvent(state: OnboardingStates): OnboardingEvents {
  switch (state) {
    case OnboardingStates.START:
      return OnboardingEvents.BEGIN;
    case OnboardingStates.CHECK_ORGANIZATION:
      return OnboardingEvents.NO_ORGANIZATION; // Default assumption
    case OnboardingStates.ORGANIZATION_SETUP:
      return OnboardingEvents.ORGANIZATION_CREATED;
    case OnboardingStates.PROFILE_COMPLETION:
      return OnboardingEvents.PROFILE_COMPLETED;
    case OnboardingStates.PREFERENCES:
      return OnboardingEvents.PREFERENCES_SAVED;
    case OnboardingStates.COMPLETION:
      return OnboardingEvents.COMPLETE;
    default:
      return OnboardingEvents.BEGIN;
  }
}

// ========================================================================================
// Store Interface and Implementation
// ========================================================================================

interface OnboardingStore {
  // Current state
  currentState: OnboardingStates;
  context: OnboardingContext;

  // State machine instance
  transitions: StateTransition[];

  // Actions
  sendEvent: (
    event: OnboardingEvents,
    payload?: Record<string, unknown>
  ) => boolean;
  canTransition: (event: OnboardingEvents) => boolean;
  reset: () => void;

  // Navigation helpers
  goBack: () => boolean;
  skip: () => boolean;
  canGoBack: () => boolean;
  canSkip: () => boolean;

  // Progress tracking
  getProgress: () => OnboardingProgress;

  // Context management
  updateContext: (updates: Partial<OnboardingContext>) => void;
  addError: (error: string) => void;
  clearErrors: () => void;

  // Initialization helper
  initialize: (userId: string, organizationId?: string) => void;

  // Route helper
  getCurrentRoute: () => string;
}

/**
 * Enhanced onboarding store using state machine pattern
 */
export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        currentState: OnboardingStates.START,
        context: createInitialContext(),
        transitions,

        sendEvent: (event, payload) => {
          const { currentState, transitions: allTransitions, context } = get();
          const transition = findTransition(
            currentState,
            event,
            allTransitions
          );

          if (!transition) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`No transition for ${currentState} + ${event}`);
            }
            return false;
          }

          // Check guard with draft validation
          if (transition.guard) {
            if (
              !transition.guard(context, payload as Record<string, unknown>)
            ) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Guard condition failed');
              }
              return false;
            }
          }

          // Execute transition
          set(
            (state) => {
              const previousState = state.currentState;

              // Execute action first to update context
              if (transition.action) {
                transition.action(state.context);
              }

              // Handle special retry case - restore previous state
              if (
                event === OnboardingEvents.RETRY &&
                currentState === OnboardingStates.ERROR
              ) {
                // For now, just go back to START - can be enhanced later
                state.currentState = OnboardingStates.START;
              } else {
                // Update state
                state.currentState = transition.to;
              }

              // Handle reset - restore initial context
              if (event === OnboardingEvents.RESET) {
                state.context = createInitialContext();
                state.currentState = OnboardingStates.START;
              }

              // Add error to context if transitioning to error state
              if (
                transition.to === OnboardingStates.ERROR &&
                payload &&
                typeof payload === 'object' &&
                'error' in payload
              ) {
                state.context.errors.push({
                  timestamp: new Date().toISOString(),
                  error: payload.error as string,
                  state: previousState,
                });
              }

              // Log for debugging in development only
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Onboarding] ${currentState} → ${transition.to}`);
              }
            },
            false,
            `onboarding/sendEvent/${event}`
          );

          return true;
        },

        canTransition: (event) => {
          const { currentState, transitions: allTransitions, context } = get();
          const transition = findTransition(
            currentState,
            event,
            allTransitions
          );

          if (!transition) return false;
          if (!transition.guard) return true;

          return transition.guard(context);
        },

        reset: () => {
          set(
            (state) => {
              state.currentState = OnboardingStates.START;
              state.context = createInitialContext();
            },
            false,
            'onboarding/reset'
          );
        },

        goBack: () => {
          return get().sendEvent(OnboardingEvents.GO_BACK);
        },

        skip: () => {
          const { currentState } = get();
          if (currentState === OnboardingStates.PREFERENCES) {
            return get().sendEvent(OnboardingEvents.SKIP_PREFERENCES);
          }
          if (currentState === OnboardingStates.ORGANIZATION_SETUP) {
            return get().sendEvent(OnboardingEvents.SKIP_ORGANIZATION);
          }
          return false;
        },

        canGoBack: () => {
          const { currentState } = get();
          if (currentState in stepConfigs) {
            const config =
              stepConfigs[currentState as keyof typeof stepConfigs];
            return config.canGoBack;
          }
          return false;
        },

        canSkip: () => {
          const { currentState } = get();
          if (currentState in stepConfigs) {
            const config =
              stepConfigs[currentState as keyof typeof stepConfigs];
            return config.canSkip;
          }
          return false;
        },

        getProgress: () => {
          const { context, currentState } = get();
          return {
            currentStep: context.currentStep,
            totalSteps: context.totalSteps,
            percentage: Math.round(
              (context.currentStep / context.totalSteps) * 100
            ),
            completedSteps: Array.from(context.completedSteps),
            skippedSteps: Array.from(context.skippedSteps),
            canGoBack: get().canGoBack(),
            canSkip: get().canSkip(),
            canProceed: get().canTransition(getNextEvent(currentState)),
          };
        },

        updateContext: (updates) => {
          // Define allowed context fields to prevent arbitrary updates
          const allowedFields = new Set([
            'userId',
            'organizationId',
            'currentStep',
            'totalSteps',
            'completedSteps',
            'skippedSteps',
            'isComplete',
            'startedAt',
            'completedAt',
            'errors',
          ]);

          // Filter out disallowed fields using safer typing
          const filteredUpdates = Object.keys(updates).reduce<
            Partial<OnboardingContext>
          >((acc, key) => {
            if (allowedFields.has(key)) {
              return { ...acc, [key]: updates[key as keyof typeof updates] };
            } else {
              console.warn(
                `Attempted to update disallowed context field: ${key}`
              );
              return acc;
            }
          }, {});

          set(
            (state) => {
              return {
                ...state,
                context: { ...state.context, ...filteredUpdates },
              };
            },
            false,
            'onboarding/updateContext'
          );
        },

        addError: (error) => {
          set(
            (state) => {
              state.context.errors.push({
                timestamp: new Date().toISOString(),
                error,
                state: state.currentState,
              });
            },
            false,
            'onboarding/addError'
          );
        },

        clearErrors: () => {
          set(
            (state) => {
              state.context.errors = [];
            },
            false,
            'onboarding/clearErrors'
          );
        },

        initialize: (userId: string, organizationId?: string) => {
          const store = get();

          store.updateContext({
            userId,
            organizationId: organizationId ?? null,
          });

          // Start the flow
          store.sendEvent(OnboardingEvents.BEGIN);

          // Skip organization setup if user already has an organization
          if (organizationId) {
            store.sendEvent(OnboardingEvents.HAS_ORGANIZATION);
          } else {
            store.sendEvent(OnboardingEvents.NO_ORGANIZATION);
          }
        },

        getCurrentRoute: () => {
          const { currentState } = get();
          if (currentState in stepConfigs) {
            const config =
              stepConfigs[currentState as keyof typeof stepConfigs];
            return config.route;
          }
          return '/onboarding/organization';
        },
      })),
      {
        name: 'onboarding-state',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentState: state.currentState,
          context: {
            ...state.context,
            completedSteps: Array.from(state.context.completedSteps),
            skippedSteps: Array.from(state.context.skippedSteps),
          },
        }),
        onRehydrateStorage: () => (state) => {
          // Convert arrays back to Sets after rehydration
          if (state?.context) {
            const completedArray = Array.isArray(state.context.completedSteps)
              ? state.context.completedSteps
              : Array.from(state.context.completedSteps);
            const skippedArray = Array.isArray(state.context.skippedSteps)
              ? state.context.skippedSteps
              : Array.from(state.context.skippedSteps);

            state.context.completedSteps = new Set(completedArray as string[]);
            state.context.skippedSteps = new Set(skippedArray as string[]);
          }
        },
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle migrations if state structure changes
          if (version === 0) {
            // Migration from version 0 to 1 - convert arrays to Sets
            const state = persistedState as {
              context?: {
                completedSteps?: string[];
                skippedSteps?: string[];
              };
            };
            if (state.context) {
              const contextWithSets = state.context as unknown as {
                completedSteps: Set<string>;
                skippedSteps: Set<string>;
              };
              contextWithSets.completedSteps = new Set(
                state.context.completedSteps ?? []
              );
              contextWithSets.skippedSteps = new Set(
                state.context.skippedSteps ?? []
              );
            }
          }
          return persistedState as OnboardingStore;
        },
      }
    ),
    createDevtoolsConfig('Onboarding')
  )
);

// ========================================================================================
// Helper Functions for Compatibility
// ========================================================================================

/**
 * Initialize onboarding for a user (compatibility with existing code)
 */
export function initializeOnboarding(userId: string, organizationId?: string) {
  useOnboardingStore.getState().initialize(userId, organizationId);
}

/**
 * Get route for current state (compatibility with existing code)
 */
export function getCurrentRoute(): string {
  return useOnboardingStore.getState().getCurrentRoute();
}

// ========================================================================================
// Exports
// ========================================================================================

// Note: Types and enums are already exported above in their definitions
