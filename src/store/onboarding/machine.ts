/**
 * Onboarding state machine store
 * This file orchestrates the onboarding flow using modular components
 */

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createDevtoolsConfig } from '../devtools.config';
import {
  ALLOWED_CONTEXT_FIELDS,
  getInitialContext,
  getStepConfigByState,
  STORAGE_KEY,
  STORAGE_VERSION,
} from './config';

// Import modular components
import * as guards from './guards';
import { canTransition, findTransition, transitions } from './transitions';
import type { OnboardingContext, OnboardingStore } from './types';
// Import types
import { OnboardingEvents, OnboardingStates } from './types';

/**
 * Create the onboarding store with state machine logic
 */
export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentState: OnboardingStates.START,
        context: getInitialContext(),
        transitions,

        // Core state machine actions
        sendEvent: (event, payload) => {
          const { currentState, context } = get();
          const transition = findTransition(currentState, event);

          if (!transition) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[Onboarding] No transition found for event ${event} in state ${currentState}`
              );
            }
            return false;
          }

          // Validate payload if needed
          if (payload && !guards.isValidEventPayload(event, payload)) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Onboarding] Invalid event payload:', payload);
            }
            return false;
          }

          // Check guard condition
          if (transition.guard && !transition.guard(context)) {
            if (process.env.NODE_ENV === 'development') {
              console.log(
                `[Onboarding] Guard prevented transition for ${event}`
              );
            }
            return false;
          }

          // Execute the transition
          set(
            (state) => {
              // Execute transition action if defined
              if (transition.action) {
                transition.action(state.context, payload);
              }

              // Update state
              state.currentState = transition.to;
            },
            false,
            `onboarding/${event}`
          );

          return true;
        },

        updateContext: (updates) => {
          // Validate updates
          if (!guards.isValidContextUpdate(updates)) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Onboarding] Invalid context updates:', updates);
            }
            return;
          }

          // Filter allowed fields
          const filteredUpdates: Partial<OnboardingContext> = {};
          for (const [key, value] of Object.entries(updates)) {
            if (
              ALLOWED_CONTEXT_FIELDS.includes(key as keyof OnboardingContext)
            ) {
              (filteredUpdates as Record<string, unknown>)[key] = value;
            } else if (process.env.NODE_ENV === 'development') {
              console.warn(`[Onboarding] Disallowed field update: ${key}`);
            }
          }

          set(
            (state) => {
              Object.assign(state.context, filteredUpdates);
              state.context.lastUpdatedAt = new Date().toISOString();
            },
            false,
            'onboarding/updateContext'
          );
        },

        reset: () => {
          set(
            (state) => {
              state.currentState = OnboardingStates.START;
              Object.assign(state.context, getInitialContext());
            },
            false,
            'onboarding/reset'
          );
        },

        // Navigation helpers
        goBack: () => {
          const { currentState } = get();

          // Define back navigation map
          const backMap: Partial<Record<OnboardingStates, OnboardingEvents>> = {
            [OnboardingStates.PROFILE_COMPLETION]: OnboardingEvents.BACK,
            [OnboardingStates.PREFERENCES_SETUP]: OnboardingEvents.BACK,
            [OnboardingStates.ACCOUNT_SETUP]: OnboardingEvents.BACK,
          };

          const backEvent = backMap[currentState];
          if (backEvent) {
            return get().sendEvent(backEvent);
          }
          return false;
        },

        skip: () => {
          const { currentState } = get();

          // Define which states can be skipped
          const skipMap: Partial<Record<OnboardingStates, OnboardingEvents>> = {
            [OnboardingStates.ORGANIZATION_SETUP]:
              OnboardingEvents.SKIP_ORGANIZATION,
            [OnboardingStates.PREFERENCES_SETUP]:
              OnboardingEvents.SKIP_PREFERENCES,
          };

          const skipEvent = skipMap[currentState];
          if (skipEvent) {
            return get().sendEvent(skipEvent);
          }
          return false;
        },

        canGoBack: () => {
          const { context } = get();
          return context.currentStep > 1;
        },

        canSkip: () => {
          const { currentState } = get();
          const config = getStepConfigByState(currentState);
          return config?.canSkip ?? false;
        },

        // Progress helpers
        getProgress: () => {
          const { context } = get();
          return {
            current: context.currentStep,
            total: context.totalSteps,
            percentage: Math.round(
              (context.currentStep / context.totalSteps) * 100
            ),
            completedSteps: Array.from(context.completedSteps),
            skippedSteps: Array.from(context.skippedSteps),
          };
        },

        // State checks
        isInState: (state) => get().currentState === state,

        canTransition: (event) => {
          const { currentState, context } = get();
          return canTransition(currentState, event, context);
        },

        // Error handling
        clearErrors: () => {
          set(
            (state) => {
              state.context.errors = [];
            },
            false,
            'onboarding/clearErrors'
          );
        },

        addError: (error) => {
          set(
            (state) => {
              const errorObj =
                typeof error === 'string'
                  ? {
                      code: 'UNKNOWN',
                      message: error,
                      timestamp: new Date().toISOString(),
                    }
                  : { ...error, timestamp: new Date().toISOString() };
              state.context.errors.push(errorObj);
            },
            false,
            'onboarding/addError'
          );
        },
      })),
      {
        name: STORAGE_KEY,
        version: STORAGE_VERSION,
        storage: createJSONStorage(() => localStorage),

        // Serialize Sets to Arrays for storage
        partialize: (state) => ({
          currentState: state.currentState,
          context: {
            ...state.context,
            completedSteps: Array.from(state.context.completedSteps),
            skippedSteps: Array.from(state.context.skippedSteps),
          },
        }),

        // Deserialize Arrays back to Sets
        onRehydrateStorage: () => (state) => {
          if (state?.context) {
            const completedSteps = Array.isArray(state.context.completedSteps)
              ? state.context.completedSteps
              : [];
            const skippedSteps = Array.isArray(state.context.skippedSteps)
              ? state.context.skippedSteps
              : [];

            state.context.completedSteps = new Set(completedSteps as string[]);
            state.context.skippedSteps = new Set(skippedSteps as string[]);
          }
        },
      }
    ),
    createDevtoolsConfig('Onboarding')
  )
);

/**
 * Helper function to initialize onboarding (backward compatibility)
 */
export function initializeOnboarding(userId: string, organizationId?: string) {
  const store = useOnboardingStore.getState();

  store.updateContext({
    userId,
    organizationId,
  });

  store.sendEvent(OnboardingEvents.BEGIN, { userId });

  if (organizationId) {
    store.sendEvent(OnboardingEvents.HAS_ORGANIZATION, { organizationId });
  } else {
    store.sendEvent(OnboardingEvents.NO_ORGANIZATION);
  }
}

/**
 * Get current route helper (backward compatibility)
 */
export function getCurrentRoute(): string {
  const { currentState } = useOnboardingStore.getState();
  const routeMap: Partial<Record<OnboardingStates, string>> = {
    [OnboardingStates.ORGANIZATION_SETUP]: '/onboarding/organization',
    [OnboardingStates.PROFILE_COMPLETION]: '/onboarding/profile',
    [OnboardingStates.PREFERENCES_SETUP]: '/onboarding/preferences',
    [OnboardingStates.ACCOUNT_SETUP]: '/onboarding/account',
    [OnboardingStates.COMPLETE]: '/onboarding/complete',
    [OnboardingStates.ERROR]: '/onboarding/error',
  };
  return routeMap[currentState] ?? '/onboarding';
}

export type { OnboardingContext, OnboardingStore } from './types';
/**
 * Export everything for backward compatibility
 */
export { OnboardingEvents, OnboardingStates } from './types';
