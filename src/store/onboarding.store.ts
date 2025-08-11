/**
 * Onboarding State Machine Store
 *
 * Implementation of a robust finite state machine for managing the onboarding flow.
 * Uses Zustand with Immer for immutable updates and persists state to localStorage.
 *
 * Architecture: Hybrid approach
 * - State Machine: Navigation state, transitions, persistence
 * - Draft System: Form data persistence (existing system)
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  NavigationCapabilities,
  OnboardingContext,
  OnboardingError,
  OnboardingFlowConfiguration,
  OnboardingProgress,
  OnboardingState,
  OnboardingStore,
  ProfileDraft,
  SerializableOnboardingContext,
  StateTransition,
  StepConfiguration,
} from '@/types/onboarding'
import {
  ONBOARDING_STEPS,
  OnboardingErrorType,
  OnboardingEvent,
  STATE_MACHINE_CONFIG,
  STEP_ESTIMATES,
} from '@/types/onboarding'
import {
  clearStepDraft,
  getDraft,
  type OnboardingStep,
  type OrganizationDraft,
} from '@/utils/onboardingDrafts'

// ========================================================================================
// Flow Configuration and Transitions
// ========================================================================================

/**
 * Step configurations defining the onboarding flow
 */
const stepConfigurations: Record<string, StepConfiguration> = {
  organizationSetup: {
    name: 'organizationSetup',
    title: 'Set Up Your Organization',
    description: 'Create your organization profile to get started',
    component: 'OrganizationStep',
    path: '/onboarding/organization',
    estimatedTime: STEP_ESTIMATES[ONBOARDING_STEPS.ORGANIZATION],
    required: true,
    canSkip: false,
    validation: {
      requiresDraft: true,
      minimumCompletion: 80,
    },
  },
  profileCompletion: {
    name: 'profileCompletion',
    title: 'Complete Your Profile',
    description: 'Tell us about yourself and your role',
    component: 'ProfileStep',
    path: '/onboarding/profile',
    estimatedTime: STEP_ESTIMATES[ONBOARDING_STEPS.PROFILE],
    required: true,
    canSkip: false,
    validation: {
      requiresDraft: true,
      minimumCompletion: 60,
    },
  },
  preferences: {
    name: 'preferences',
    title: 'Set Your Preferences',
    description: 'Configure your notification and app preferences',
    component: 'PreferencesStep',
    path: '/onboarding/preferences',
    estimatedTime: STEP_ESTIMATES[ONBOARDING_STEPS.PREFERENCES],
    required: false,
    canSkip: true,
    validation: {
      requiresDraft: false,
      minimumCompletion: 0,
    },
  },
  completion: {
    name: 'completion',
    title: 'Welcome to RocketHooks!',
    description: 'Your onboarding is complete',
    component: 'CompletionStep',
    path: '/onboarding/complete',
    estimatedTime: 0,
    required: true,
    canSkip: false,
  },
}

/**
 * State transition definitions with guard conditions and actions
 */
const createTransitions = (): StateTransition[] => [
  // Initial flow
  {
    from: 'START',
    event: OnboardingEvent.BEGIN,
    to: 'CHECK_ORGANIZATION',
    action: (context) => {
      context.startedAt = new Date().toISOString()
      context.lastActiveAt = new Date().toISOString()
    },
    description: 'Start onboarding process',
  },

  // Organization check flow
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.HAS_ORGANIZATION,
    to: 'PROFILE_COMPLETION',
    guard: (context) => !!context.organizationId,
    action: (context) => {
      context.skippedSteps.add('organization')
      context.currentStep = 2
    },
    description: 'User has existing organization',
  },
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.NO_ORGANIZATION,
    to: 'ORGANIZATION_SETUP',
    action: (context) => {
      context.currentStep = 1
    },
    description: 'User needs to create organization',
  },

  // Organization setup flow
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.ORGANIZATION_CREATED,
    to: 'PROFILE_COMPLETION',
    guard: () => {
      const draft = getDraft('organization') as OrganizationDraft | null
      return !!(draft?.name && draft.size)
    },
    action: (context, payload) => {
      context.completedSteps.add('organization')
      context.currentStep = 2
      if (payload?.organizationId) {
        context.organizationId = payload.organizationId
      }
      // Clear the draft after successful completion
      clearStepDraft('organization')
    },
    description: 'Organization successfully created',
  },

  // Profile completion flow
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.PROFILE_COMPLETED,
    to: 'PREFERENCES',
    guard: () => {
      const draft = getDraft('profile') as ProfileDraft | null
      return !!(draft?.firstName && draft.role)
    },
    action: (context) => {
      context.completedSteps.add('profile')
      context.currentStep = 3
      clearStepDraft('profile')
    },
    description: 'Profile successfully completed',
  },

  // Preferences flow
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.PREFERENCES_SAVED,
    to: 'COMPLETION',
    action: (context) => {
      context.completedSteps.add('preferences')
      context.currentStep = 4
      clearStepDraft('preferences')
    },
    description: 'Preferences saved',
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.SKIP_PREFERENCES,
    to: 'COMPLETION',
    action: (context) => {
      context.skippedSteps.add('preferences')
      context.currentStep = 4
    },
    description: 'Preferences skipped',
  },

  // Completion flow
  {
    from: 'COMPLETION',
    event: OnboardingEvent.COMPLETE,
    to: 'DASHBOARD',
    action: (context) => {
      context.isComplete = true
      context.completedAt = new Date().toISOString()
      context.currentStep = 5
    },
    description: 'Onboarding completed',
  },

  // Navigation events
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.BACK,
    to: 'CHECK_ORGANIZATION',
    action: (context) => {
      context.currentStep = 0
    },
    description: 'Navigate back from organization setup',
  },
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.BACK,
    to: 'ORGANIZATION_SETUP',
    guard: (context) => !context.skippedSteps.has('organization'),
    action: (context) => {
      context.currentStep = 1
    },
    description: 'Navigate back to organization setup',
  },
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.BACK,
    to: 'CHECK_ORGANIZATION',
    guard: (context) => context.skippedSteps.has('organization'),
    action: (context) => {
      context.currentStep = 0
    },
    description: 'Navigate back to organization check if skipped',
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.BACK,
    to: 'PROFILE_COMPLETION',
    action: (context) => {
      context.currentStep = 2
    },
    description: 'Navigate back to profile completion',
  },
  {
    from: 'COMPLETION',
    event: OnboardingEvent.BACK,
    to: 'PREFERENCES',
    action: (context) => {
      context.currentStep = 3
    },
    description: 'Navigate back to preferences',
  },

  // Error handling
  {
    from: 'ERROR',
    event: OnboardingEvent.RETRY,
    to: 'ERROR', // Will be updated by the retry logic
    description: 'Retry after error',
  },
  {
    from: 'ERROR',
    event: OnboardingEvent.ERROR_RECOVERED,
    to: 'ERROR', // Will be updated by the recovery logic
    description: 'Error recovered',
  },

  // Reset functionality
  {
    from: 'START',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from start',
  },
  {
    from: 'CHECK_ORGANIZATION',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from organization check',
  },
  {
    from: 'ORGANIZATION_SETUP',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from organization setup',
  },
  {
    from: 'PROFILE_COMPLETION',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from profile completion',
  },
  {
    from: 'PREFERENCES',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from preferences',
  },
  {
    from: 'COMPLETION',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from completion',
  },
  {
    from: 'ERROR',
    event: OnboardingEvent.RESET,
    to: 'START',
    description: 'Reset from error',
  },
]

/**
 * Flow configuration combining steps and transitions
 */
const flowConfiguration: OnboardingFlowConfiguration = {
  steps: stepConfigurations,
  transitions: createTransitions(),
  defaultConfig: {
    skipPreferences: false,
    requireProfile: true,
    enableAnalytics: true,
  },
  totalEstimatedTime: Object.values(STEP_ESTIMATES).reduce((a, b) => a + b, 0),
}

// ========================================================================================
// Helper Functions
// ========================================================================================

/**
 * Create initial context with default values
 */
function createInitialContext(): OnboardingContext {
  return {
    userId: '',
    organizationId: null,
    completedSteps: new Set(),
    skippedSteps: new Set(),
    currentStep: 0,
    totalSteps: 5,
    isComplete: false,
    startedAt: null,
    completedAt: null,
    lastActiveAt: null,
    errors: [],
    stateHistory: [],
    config: flowConfiguration.defaultConfig,
  }
}

/**
 * Find transition for given state and event
 */
function findTransition(
  fromState: string,
  event: OnboardingEvent,
  transitions: StateTransition[]
): StateTransition | null {
  return (
    transitions.find(
      (transition) =>
        transition.from === fromState && transition.event === event
    ) || null
  )
}

/**
 * Create state object with given type and optional payload
 */
function createStateObject(stateType: string, payload?: any): OnboardingState {
  switch (stateType) {
    case 'START':
      return { type: 'START' }
    case 'CHECK_ORGANIZATION':
      return {
        type: 'CHECK_ORGANIZATION',
        checking: payload?.checking ?? false,
      }
    case 'ORGANIZATION_SETUP':
      return { type: 'ORGANIZATION_SETUP', draft: payload?.draft }
    case 'PROFILE_COMPLETION':
      return {
        type: 'PROFILE_COMPLETION',
        organizationId: payload?.organizationId ?? '',
        draft: payload?.draft,
      }
    case 'PREFERENCES':
      return { type: 'PREFERENCES', draft: payload?.draft }
    case 'COMPLETION':
      return { type: 'COMPLETION', completedAt: payload?.completedAt }
    case 'DASHBOARD':
      return { type: 'DASHBOARD' }
    case 'ERROR':
      return {
        type: 'ERROR',
        error: payload?.error ?? 'Unknown error',
        previousState: payload?.previousState ?? { type: 'START' },
        canRetry: payload?.canRetry ?? true,
      }
    default:
      return { type: 'START' }
  }
}

/**
 * Get the current step name for draft system integration
 */
function getCurrentStepName(state: OnboardingState): OnboardingStep | null {
  switch (state.type) {
    case 'ORGANIZATION_SETUP':
      return 'organization'
    case 'PROFILE_COMPLETION':
      return 'profile'
    case 'PREFERENCES':
      return 'preferences'
    default:
      return null
  }
}

/**
 * Get next event for current state
 */
function getNextEvent(state: OnboardingState): OnboardingEvent | null {
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
      return null
  }
}

/**
 * Create an error object
 */
function createError(
  type: OnboardingErrorType,
  message: string,
  state: string,
  canRetry: boolean = true
): OnboardingError {
  return {
    type,
    message,
    timestamp: new Date().toISOString(),
    state,
    canRetry,
    retryCount: 0,
    maxRetries: 3,
  }
}

/**
 * Convert context to serializable format for persistence
 */
function contextToSerializable(
  context: OnboardingContext
): SerializableOnboardingContext {
  return {
    userId: context.userId,
    organizationId: context.organizationId,
    completedSteps: Array.from(context.completedSteps),
    skippedSteps: Array.from(context.skippedSteps),
    currentStep: context.currentStep,
    totalSteps: context.totalSteps,
    isComplete: context.isComplete,
    startedAt: context.startedAt,
    completedAt: context.completedAt,
    lastActiveAt: context.lastActiveAt,
    errors: context.errors,
    stateHistory: context.stateHistory,
    config: context.config,
  }
}

/**
 * Restore context from serializable format
 */
function contextFromSerializable(
  serialized: SerializableOnboardingContext
): OnboardingContext {
  return {
    ...serialized,
    completedSteps: new Set(serialized.completedSteps),
    skippedSteps: new Set(serialized.skippedSteps),
  }
}

// ========================================================================================
// Zustand Store Implementation
// ========================================================================================

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      currentState: { type: 'START' },
      context: createInitialContext(),
      transitions: flowConfiguration.transitions,
      flowConfig: flowConfiguration,

      // Core state machine actions
      sendEvent: async (
        event: OnboardingEvent,
        payload?: any
      ): Promise<boolean> => {
        return new Promise((resolve) => {
          const state = get()
          const { currentState, transitions, context } = state

          try {
            const transition = findTransition(
              currentState.type,
              event,
              transitions
            )

            if (!transition) {
              console.warn(
                `No transition found for ${currentState.type} + ${event}`
              )
              resolve(false)
              return
            }

            // Check guard condition
            if (transition.guard && !transition.guard(context, payload)) {
              console.warn(
                `Guard condition failed for ${currentState.type} + ${event}`
              )
              resolve(false)
              return
            }

            // Execute transition
            set((draft) => {
              // Update last active timestamp
              draft.context.lastActiveAt = new Date().toISOString()

              // Add current state to history
              draft.context.stateHistory.push(currentState)

              // Limit history length
              if (
                draft.context.stateHistory.length >
                STATE_MACHINE_CONFIG.MAX_HISTORY_LENGTH
              ) {
                draft.context.stateHistory.shift()
              }

              // Execute transition action
              if (transition.action) {
                transition.action(draft.context, payload)
              }

              // Update state
              draft.currentState = createStateObject(transition.to, payload)

              console.log(
                `[Onboarding] ${currentState.type} → ${transition.to}`,
                {
                  event,
                  payload,
                  description: transition.description,
                }
              )
            })

            resolve(true)
          } catch (error) {
            console.error('State machine error:', error)

            // Handle state machine errors
            set((draft) => {
              const errorObj = createError(
                OnboardingErrorType.STATE_MACHINE_ERROR,
                error instanceof Error ? error.message : 'State machine error',
                currentState.type
              )

              draft.context.errors.push({
                timestamp: errorObj.timestamp,
                error: errorObj.message,
                state: errorObj.state,
                recovered: false,
              })

              draft.currentState = {
                type: 'ERROR',
                error: errorObj.message,
                previousState: currentState,
                canRetry: true,
              }
            })

            resolve(false)
          }
        })
      },

      canTransition: (event: OnboardingEvent, payload?: any): boolean => {
        const { currentState, transitions, context } = get()
        const transition = findTransition(currentState.type, event, transitions)

        if (!transition) return false
        if (!transition.guard) return true

        return transition.guard(context, payload)
      },

      // Navigation actions
      goNext: async (): Promise<boolean> => {
        const { currentState } = get()
        const nextEvent = getNextEvent(currentState)

        if (!nextEvent) return false

        return get().sendEvent(nextEvent)
      },

      goBack: async (): Promise<boolean> => {
        return get().sendEvent(OnboardingEvent.BACK)
      },

      skip: async (): Promise<boolean> => {
        const { currentState } = get()

        if (currentState.type === 'PREFERENCES') {
          return get().sendEvent(OnboardingEvent.SKIP_PREFERENCES)
        }

        return false
      },

      retry: async (): Promise<boolean> => {
        return get().sendEvent(OnboardingEvent.RETRY)
      },

      reset: (): void => {
        set((draft) => {
          draft.currentState = { type: 'START' }
          draft.context = createInitialContext()
        })
      },

      // Progress and status
      getProgress: (): OnboardingProgress => {
        const { context, currentState } = get()

        return {
          currentStep: context.currentStep,
          totalSteps: context.totalSteps,
          percentage: Math.round(
            (context.currentStep / context.totalSteps) * 100
          ),
          completedSteps: Array.from(context.completedSteps),
          skippedSteps: Array.from(context.skippedSteps),
          canGoBack: context.currentStep > 0 && currentState.type !== 'START',
          canSkip: currentState.type === 'PREFERENCES',
          isFirstStep: context.currentStep <= 1,
          isLastStep: context.currentStep >= context.totalSteps - 1,
          estimatedTimeRemaining: Math.max(
            0,
            flowConfiguration.totalEstimatedTime - context.currentStep * 2
          ),
        }
      },

      getNavigationCapabilities: (): NavigationCapabilities => {
        const { currentState, context } = get()

        return {
          canGoBack: context.currentStep > 0 && currentState.type !== 'START',
          canSkip: currentState.type === 'PREFERENCES',
          canRetry: currentState.type === 'ERROR',
          canReset: true,
          nextEvent: getNextEvent(currentState),
          backEvent: OnboardingEvent.BACK,
          skipEvent:
            currentState.type === 'PREFERENCES'
              ? OnboardingEvent.SKIP_PREFERENCES
              : null,
        }
      },

      getCurrentStepConfig: (): StepConfiguration | null => {
        const { currentState } = get()

        switch (currentState.type) {
          case 'ORGANIZATION_SETUP':
            return flowConfiguration.steps['organizationSetup'] ?? null
          case 'PROFILE_COMPLETION':
            return flowConfiguration.steps['profileCompletion'] ?? null
          case 'PREFERENCES':
            return flowConfiguration.steps['preferences'] ?? null
          case 'COMPLETION':
            return flowConfiguration.steps['completion'] ?? null
          default:
            return null
        }
      },

      // Error handling
      handleError: (error: OnboardingError): void => {
        set((draft) => {
          draft.context.errors.push({
            timestamp: error.timestamp,
            error: error.message,
            state: error.state,
            recovered: false,
          })

          // Limit error history
          if (
            draft.context.errors.length > STATE_MACHINE_CONFIG.MAX_ERROR_HISTORY
          ) {
            draft.context.errors.shift()
          }

          draft.currentState = {
            type: 'ERROR',
            error: error.message,
            previousState: draft.currentState,
            canRetry: error.canRetry,
          }
        })
      },

      clearErrors: (): void => {
        set((draft) => {
          draft.context.errors = []
        })
      },

      getLastError: (): OnboardingError | null => {
        const { context } = get()
        const lastError = context.errors[context.errors.length - 1]

        if (!lastError) return null

        return createError(
          OnboardingErrorType.UNKNOWN_ERROR,
          lastError.error,
          lastError.state
        )
      },

      // Integration with draft system
      validateCurrentStep: (): boolean => {
        const { currentState } = get()
        const stepName = getCurrentStepName(currentState)

        if (!stepName) return true

        return get().hasValidDraft(stepName)
      },

      getCurrentDraft: (): any => {
        const { currentState } = get()
        const stepName = getCurrentStepName(currentState)

        if (!stepName) return null

        return getDraft(stepName)
      },

      hasValidDraft: (step?: OnboardingStep): boolean => {
        const { currentState } = get()
        const targetStep = step || getCurrentStepName(currentState)

        if (!targetStep) return false

        const draft = getDraft(targetStep)

        // Basic validation - can be enhanced
        if (!draft) return false

        switch (targetStep) {
          case 'organization':
            return (
              !!(draft as OrganizationDraft).name &&
              !!(draft as OrganizationDraft).size
            )
          case 'profile':
            return (
              !!(draft as ProfileDraft).firstName &&
              !!(draft as ProfileDraft).role
            )
          case 'preferences':
            return true // Preferences are optional
          default:
            return false
        }
      },

      // Analytics and monitoring
      trackEvent: (event: string, properties?: Record<string, any>): void => {
        // Placeholder for analytics integration
        console.log(`[Analytics] ${event}`, properties)
      },

      getSessionDuration: (): number => {
        const { context } = get()

        if (!context.startedAt) return 0

        const now = new Date()
        const started = new Date(context.startedAt)

        return Math.round((now.getTime() - started.getTime()) / 1000 / 60) // minutes
      },

      getCompletionRate: (): number => {
        const { context } = get()

        if (context.totalSteps === 0) return 0

        const completedCount = context.completedSteps.size
        return Math.round((completedCount / context.totalSteps) * 100)
      },
    })),
    {
      name: STATE_MACHINE_CONFIG.STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentState: state.currentState,
        context: contextToSerializable(state.context),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.context) {
          // Restore context from serializable format
          const serializedContext =
            state.context as unknown as SerializableOnboardingContext
          state.context = contextFromSerializable(serializedContext)
        }
      },
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migrations if state structure changes in future versions
        console.log(`Migrating onboarding state from version ${version}`)
        return persistedState
      },
    }
  )
)
