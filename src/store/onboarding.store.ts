import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  type OnboardingContext,
  OnboardingEvent,
  type OnboardingProgress,
  type OnboardingState,
  type StateTransition,
} from '@/types/onboarding'
import { getDraft, validateDraft } from '@/utils/onboardingDrafts'

// ========================================================================================
// Store Interface
// ========================================================================================

interface OnboardingStore {
  // Current state
  currentState: OnboardingState
  context: OnboardingContext

  // State machine instance
  transitions: StateTransition[]

  // Actions
  sendEvent: (event: OnboardingEvent, payload?: any) => boolean
  canTransition: (event: OnboardingEvent) => boolean
  reset: () => void

  // Navigation helpers
  goBack: () => boolean
  skip: () => boolean
  canGoBack: () => boolean
  canSkip: () => boolean

  // Progress tracking
  getProgress: () => OnboardingProgress

  // Context management
  updateContext: (updates: Partial<OnboardingContext>) => void
  addError: (error: string) => void
  clearErrors: () => void
}

// ========================================================================================
// State Machine Configuration
// ========================================================================================

/**
 * Step configurations for validation and navigation
 */
const stepConfigs = {
  ORGANIZATION_SETUP: {
    id: 'organization',
    canSkip: true,
    canGoBack: false,
    requiresValidation: true,
    order: 1,
    route: '/onboarding/organization',
  },
  PROFILE_COMPLETION: {
    id: 'profile',
    canSkip: false,
    canGoBack: true,
    requiresValidation: false,
    order: 2,
    route: '/onboarding/profile',
  },
  PREFERENCES: {
    id: 'preferences',
    canSkip: true,
    canGoBack: true,
    requiresValidation: false,
    order: 3,
    route: '/onboarding/preferences',
  },
  COMPLETION: {
    id: 'completion',
    canSkip: false,
    canGoBack: false,
    requiresValidation: false,
    order: 4,
    route: '/onboarding/complete',
  },
}

/**
 * Create initial context
 */
function createInitialContext(): OnboardingContext {
  return {
    userId: '',
    organizationId: null,
    completedSteps: new Set(),
    skippedSteps: new Set(),
    currentStep: 0,
    totalSteps: 4,
    isComplete: false,
    startedAt: null,
    completedAt: null,
    errors: [],
  }
}

/**
 * Find transition for current state + event
 */
function findTransition(
  currentState: string,
  event: OnboardingEvent,
  transitions: StateTransition[]
): StateTransition | null {
  return (
    transitions.find((t) => t.from === currentState && t.event === event) ||
    null
  )
}

/**
 * Create state object from type and payload
 */
function createStateObject(type: string, payload?: any): OnboardingState {
  switch (type) {
    case 'START':
      return { type: 'START' }
    case 'CHECK_ORGANIZATION':
      return { type: 'CHECK_ORGANIZATION', checking: payload?.checking ?? true }
    case 'ORGANIZATION_SETUP':
      return { type: 'ORGANIZATION_SETUP', draft: payload?.draft }
    case 'PROFILE_COMPLETION':
      return {
        type: 'PROFILE_COMPLETION',
        organizationId: payload?.organizationId || '',
        draft: payload?.draft,
      }
    case 'PREFERENCES':
      return { type: 'PREFERENCES', draft: payload?.draft }
    case 'COMPLETION':
      return { type: 'COMPLETION' }
    case 'DASHBOARD':
      return { type: 'DASHBOARD' }
    case 'ERROR':
      return {
        type: 'ERROR',
        error: payload?.error || 'Unknown error',
        previousState: payload?.previousState || { type: 'START' },
      }
    default:
      return { type: 'START' }
  }
}

/**
 * Get next event based on current state
 */
function getNextEvent(state: OnboardingState): OnboardingEvent {
  switch (state.type) {
    case 'START':
      return OnboardingEvent.BEGIN
    case 'CHECK_ORGANIZATION':
      return OnboardingEvent.NO_ORGANIZATION // Default assumption
    case 'ORGANIZATION_SETUP':
      return OnboardingEvent.ORGANIZATION_CREATED
    case 'PROFILE_COMPLETION':
      return OnboardingEvent.PROFILE_COMPLETED
    case 'PREFERENCES':
      return OnboardingEvent.PREFERENCES_SAVED
    case 'COMPLETION':
      return OnboardingEvent.COMPLETE
    default:
      return OnboardingEvent.BEGIN
  }
}

// ========================================================================================
// Transition Definitions
// ========================================================================================

const transitions: StateTransition[] = [
  // Start flow
  {
    from: 'START',
    event: OnboardingEvent.BEGIN,
    to: 'CHECK_ORGANIZATION',
    action: (context) => {
      context.startedAt = new Date().toISOString()
    },
  },

  // Organization check results
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.HAS_ORGANIZATION,
    to: 'PROFILE_COMPLETION',
    guard: (context) => !!context.organizationId,
    action: (context) => {
      context.skippedSteps.add('organization')
      context.currentStep = 2
    },
  },
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.NO_ORGANIZATION,
    to: 'ORGANIZATION_SETUP',
    action: (context) => {
      context.currentStep = 1
    },
  },

  // Organization setup completion
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.ORGANIZATION_CREATED,
    to: 'PROFILE_COMPLETION',
    guard: (_context) => {
      const draft = getDraft('organization')
      return validateDraft('organization', draft)
    },
    action: (context) => {
      context.completedSteps.add('organization')
      context.currentStep = 2
    },
  },

  // Skip organization setup
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.SKIP_PREFERENCES,
    to: 'PROFILE_COMPLETION',
    action: (context) => {
      context.skippedSteps.add('organization')
      context.currentStep = 2
    },
  },

  // Profile completion
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.PROFILE_COMPLETED,
    to: 'PREFERENCES',
    action: (context) => {
      context.completedSteps.add('profile')
      context.currentStep = 3
    },
  },

  // Preferences handling
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.PREFERENCES_SAVED,
    to: 'COMPLETION',
    action: (context) => {
      context.completedSteps.add('preferences')
      context.currentStep = 4
    },
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.SKIP_PREFERENCES,
    to: 'COMPLETION',
    action: (context) => {
      context.skippedSteps.add('preferences')
      context.currentStep = 4
    },
  },

  // Final completion
  {
    from: 'COMPLETION',
    event: OnboardingEvent.COMPLETE,
    to: 'DASHBOARD',
    action: (context) => {
      context.isComplete = true
      context.completedAt = new Date().toISOString()
    },
  },

  // Go back transitions
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.GO_BACK,
    to: 'ORGANIZATION_SETUP',
    guard: (context) => !context.skippedSteps.has('organization'),
    action: (context) => {
      context.currentStep = Math.max(1, context.currentStep - 1)
    },
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.GO_BACK,
    to: 'PROFILE_COMPLETION',
    action: (context) => {
      context.currentStep = Math.max(2, context.currentStep - 1)
    },
  },

  // Error handling
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.ERROR_OCCURRED,
    to: 'ERROR',
  },
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.ERROR_OCCURRED,
    to: 'ERROR',
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.ERROR_OCCURRED,
    to: 'ERROR',
  },

  // Retry from error
  {
    from: 'ERROR',
    event: OnboardingEvent.RETRY,
    to: 'START', // Will be overridden by the previousState
  },

  // Reset from any state
  {
    from: 'START',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'COMPLETION',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
  {
    from: 'ERROR',
    event: OnboardingEvent.RESET,
    to: 'START',
  },
]

// ========================================================================================
// Store Implementation
// ========================================================================================

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    immer((set, get) => ({
      currentState: { type: 'START' },
      context: createInitialContext(),
      transitions,

      sendEvent: (event, payload) => {
        const { currentState, transitions, context } = get()
        const transition = findTransition(currentState.type, event, transitions)

        if (!transition) {
          console.warn(`No transition for ${currentState.type} + ${event}`)
          return false
        }

        // Check guard with draft validation
        if (transition.guard) {
          if (!transition.guard(context, payload)) {
            console.warn('Guard condition failed')
            return false
          }
        }

        // Execute transition
        set((state) => {
          const previousState = { ...state.currentState }

          // Execute action first to update context
          if (transition.action) {
            transition.action(state.context)
          }

          // Handle special retry case - restore previous state
          if (
            event === OnboardingEvent.RETRY &&
            currentState.type === 'ERROR'
          ) {
            state.currentState = (currentState as any).previousState || {
              type: 'START',
            }
          } else {
            // Update state
            state.currentState = createStateObject(transition.to, payload)
          }

          // Handle reset - restore initial context
          if (event === OnboardingEvent.RESET) {
            state.context = createInitialContext()
            state.currentState = { type: 'START' }
          }

          // Add error to context if transitioning to error state
          if (transition.to === 'ERROR' && payload?.error) {
            state.context.errors.push({
              timestamp: new Date().toISOString(),
              error: payload.error,
              state: previousState.type,
            })
          }

          // Log for debugging
          console.log(`[Onboarding] ${currentState.type} → ${transition.to}`)
        })

        return true
      },

      canTransition: (event) => {
        const { currentState, transitions, context } = get()
        const transition = findTransition(currentState.type, event, transitions)

        if (!transition) return false
        if (!transition.guard) return true

        return transition.guard(context)
      },

      reset: () => {
        set((state) => {
          state.currentState = { type: 'START' }
          state.context = createInitialContext()
        })
      },

      goBack: () => {
        return get().sendEvent(OnboardingEvent.GO_BACK)
      },

      skip: () => {
        const { currentState } = get()
        if (currentState.type === 'PREFERENCES') {
          return get().sendEvent(OnboardingEvent.SKIP_PREFERENCES)
        }
        // Add other skip logic as needed
        return false
      },

      canGoBack: () => {
        const { currentState } = get()
        const config =
          stepConfigs[currentState.type as keyof typeof stepConfigs]
        return config?.canGoBack ?? false
      },

      canSkip: () => {
        const { currentState } = get()
        const config =
          stepConfigs[currentState.type as keyof typeof stepConfigs]
        return config?.canSkip ?? false
      },

      getProgress: () => {
        const { context, currentState } = get()
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
        }
      },

      updateContext: (updates) => {
        set((state) => {
          Object.assign(state.context, updates)
        })
      },

      addError: (error) => {
        set((state) => {
          state.context.errors.push({
            timestamp: new Date().toISOString(),
            error,
            state: state.currentState.type,
          })
        })
      },

      clearErrors: () => {
        set((state) => {
          state.context.errors = []
        })
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
          state.context.completedSteps = new Set(
            state.context.completedSteps as any
          )
          state.context.skippedSteps = new Set(
            state.context.skippedSteps as any
          )
        }
      },
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migrations if state structure changes
        if (version === 0) {
          // Migration from version 0 to 1 - convert arrays to Sets
          if (persistedState.context) {
            persistedState.context.completedSteps = new Set(
              persistedState.context.completedSteps || []
            )
            persistedState.context.skippedSteps = new Set(
              persistedState.context.skippedSteps || []
            )
          }
        }
        return persistedState
      },
    }
  )
)

// ========================================================================================
// Helper Functions and Exports
// ========================================================================================

/**
 * Initialize onboarding for a user
 */
export function initializeOnboarding(userId: string, organizationId?: string) {
  const store = useOnboardingStore.getState()

  store.updateContext({
    userId,
    organizationId: organizationId || null,
  })

  // Start the flow
  store.sendEvent(OnboardingEvent.BEGIN)

  // Skip organization setup if user already has an organization
  if (organizationId) {
    store.sendEvent(OnboardingEvent.HAS_ORGANIZATION)
  } else {
    store.sendEvent(OnboardingEvent.NO_ORGANIZATION)
  }
}

/**
 * Get route for current state
 */
export function getCurrentRoute(state: OnboardingState): string {
  const config = stepConfigs[state.type as keyof typeof stepConfigs]
  return config?.route || '/onboarding/organization'
}

/**
 * Export step configurations for external use
 */
export { stepConfigs as onboardingStepConfigs }
