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
import { stepConfigs } from './config'
import { transitions } from './transitions'
import {
  createInitialContext,
  createStateObject,
  findTransition,
  getNextEvent,
} from './utils'

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
  sendEvent: (
    event: OnboardingEvent,
    payload?: Record<string, unknown>
  ) => boolean
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
          if (process.env.NODE_ENV === 'development') {
            console.warn(`No transition for ${currentState.type} + ${event}`)
          }
          return false
        }

        // Check guard with draft validation
        if (transition.guard) {
          if (!transition.guard(context, payload as Record<string, unknown>)) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Guard condition failed')
            }
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
            const errorState = currentState as {
              previousState?: OnboardingState
            }
            state.currentState = errorState.previousState ?? {
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
          if (
            transition.to === 'ERROR' &&
            payload &&
            typeof payload === 'object' &&
            'error' in payload
          ) {
            state.context.errors.push({
              timestamp: new Date().toISOString(),
              error: payload.error as string,
              state: previousState.type,
            })
          }

          // Log for debugging in development only
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Onboarding] ${currentState.type} → ${transition.to}`)
          }
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
        return config.canGoBack || false
      },

      canSkip: () => {
        const { currentState } = get()
        const config =
          stepConfigs[currentState.type as keyof typeof stepConfigs]
        return config.canSkip || false
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
          const completedArray = Array.isArray(state.context.completedSteps)
            ? state.context.completedSteps
            : Array.from(state.context.completedSteps)
          const skippedArray = Array.isArray(state.context.skippedSteps)
            ? state.context.skippedSteps
            : Array.from(state.context.skippedSteps)

          state.context.completedSteps = new Set(completedArray as string[])
          state.context.skippedSteps = new Set(skippedArray as string[])
        }
      },
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Handle migrations if state structure changes
        if (version === 0) {
          // Migration from version 0 to 1 - convert arrays to Sets
          const state = persistedState as {
            context?: {
              completedSteps?: string[]
              skippedSteps?: string[]
            }
          }
          if (state.context) {
            const contextWithSets = state.context as unknown as {
              completedSteps: Set<string>
              skippedSteps: Set<string>
            }
            contextWithSets.completedSteps = new Set(
              state.context.completedSteps ?? []
            )
            contextWithSets.skippedSteps = new Set(
              state.context.skippedSteps ?? []
            )
          }
        }
        return persistedState as OnboardingStore
      },
    }
  )
)
