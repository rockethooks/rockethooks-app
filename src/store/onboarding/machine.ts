/**
 * Onboarding state machine store
 * This file orchestrates the onboarding flow using modular components
 */

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { loggers } from '@/utils';
import { createDevtoolsConfig } from '../devtools.config';
import {
  ALLOWED_CONTEXT_FIELDS,
  getInitialContext,
  STORAGE_KEY,
  STORAGE_VERSION,
} from './config';

// Import modular components
import * as guards from './guards';
import { OrganizationNameGenerator } from './organizationGenerator';
import { canTransition, findTransition, transitions } from './transitions';
import type { OnboardingContext, OnboardingStore } from './types';
// Import types
import { OnboardingEvents, OnboardingStates } from './types';

const logger = loggers.onboarding;

/**
 * Type-safe utility to filter allowed context fields
 */
function filterAllowedContextFields(
  updates: Partial<OnboardingContext>
): Partial<OnboardingContext> {
  const filteredUpdates: Partial<OnboardingContext> = {};

  // Type-safe field filtering using known context field types
  for (const field of ALLOWED_CONTEXT_FIELDS) {
    const fieldKey = field as keyof OnboardingContext;
    if (fieldKey in updates) {
      filteredUpdates[fieldKey] = updates[fieldKey];
    }
  }

  return filteredUpdates;
}

/**
 * Create the onboarding store with state machine logic
 */
export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentState: OnboardingStates.INITIAL_SETUP,
        context: getInitialContext(),
        transitions,

        // Core state machine actions
        sendEvent: (event, payload) => {
          const { currentState, context } = get();
          const transition = findTransition(currentState, event);

          if (!transition) {
            logger.warn(
              `No transition found for event ${event} in state ${currentState}`
            );
            return false;
          }

          // Validate payload if needed
          if (payload && !guards.isValidEventPayload(event, payload)) {
            logger.error('Invalid event payload:', payload);
            return false;
          }

          // Check guard condition
          if (transition.guard && !transition.guard(context)) {
            logger.debug(`Guard prevented transition for ${event}`);
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
            logger.error('Invalid context updates:', updates);
            return;
          }

          // Filter allowed fields using type-safe utility
          const filteredUpdates = filterAllowedContextFields(updates);

          // Log any disallowed fields
          for (const key of Object.keys(updates)) {
            if (
              !ALLOWED_CONTEXT_FIELDS.includes(key as keyof OnboardingContext)
            ) {
              logger.warn(`Disallowed field update: ${key}`);
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
              state.currentState = OnboardingStates.INITIAL_SETUP;
              Object.assign(state.context, getInitialContext());
            },
            false,
            'onboarding/reset'
          );
        },

        // Organization setup
        initializeWithUserInfo: (userId, email, displayName) => {
          const store = get();

          // Start onboarding process
          store.sendEvent(OnboardingEvents.BEGIN, {
            userId,
            email,
            displayName,
          });

          // Generate suggested organization name if email is provided
          if (email) {
            const suggestion = OrganizationNameGenerator.getPrimarySuggestion(
              email,
              displayName
            );

            store.updateContext({
              suggestedOrganizationName: suggestion.name,
            });
          }
        },

        createOrganization: async (organizationName) => {
          const store = get();

          try {
            store.updateContext({ isCreatingOrganization: true });

            // Import GraphQL service for organization creation
            const { createOrganization } = await import(
              '@/services/graphql/organization'
            );

            // Call the backend GraphQL mutation
            const organization = await createOrganization({
              name: organizationName,
            });

            // Send organization created event
            const success = store.sendEvent(
              OnboardingEvents.ORGANIZATION_CREATED,
              {
                organizationId: organization.id,
                organizationName: organization.name,
              }
            );

            return success;
          } catch (error) {
            logger.error('Failed to create organization:', error);
            store.updateContext({
              isCreatingOrganization: false,
              organizationCreationError:
                error instanceof Error
                  ? error.message
                  : 'Failed to create organization',
            });

            store.sendEvent(OnboardingEvents.ERROR, {
              error: 'Failed to create organization',
              code: 'ORGANIZATION_CREATION_FAILED',
            });

            return false;
          }
        },

        skipOrganization: () => {
          return get().sendEvent(OnboardingEvents.SKIP_ORGANIZATION);
        },

        // Tour management
        startTour: () => {
          return get().sendEvent(OnboardingEvents.START_TOUR);
        },

        nextTourStep: (stepData) => {
          return get().sendEvent(OnboardingEvents.NEXT_TOUR_STEP, { stepData });
        },

        skipTour: () => {
          return get().sendEvent(OnboardingEvents.SKIP_TOUR);
        },

        completeOnboarding: () => {
          return get().sendEvent(OnboardingEvents.COMPLETE_ONBOARDING);
        },

        // Progress helpers
        getProgress: () => {
          const { context } = get();
          return {
            current: context.currentTourStep,
            total: context.totalTourSteps,
            percentage: Math.round(
              (context.currentTourStep / context.totalTourSteps) * 100
            ),
            tourStepsCompleted: Array.from(context.completedTourSteps),
            skippedTour: context.skippedTour,
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
            completedTourSteps: Array.from(state.context.completedTourSteps),
          },
        }),

        // Deserialize Arrays back to Sets
        onRehydrateStorage: () => (state) => {
          if (state?.context) {
            const completedTourSteps = Array.isArray(
              state.context.completedTourSteps
            )
              ? state.context.completedTourSteps
              : [];

            state.context.completedTourSteps = new Set(
              completedTourSteps as string[]
            );
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
export function initializeOnboarding(
  userId: string,
  email?: string,
  displayName?: string
) {
  const store = useOnboardingStore.getState();
  store.initializeWithUserInfo(userId, email, displayName);
}

/**
 * Get current route helper (backward compatibility)
 */
export function getCurrentRoute(): string {
  const { currentState } = useOnboardingStore.getState();
  const routeMap: Partial<Record<OnboardingStates, string>> = {
    [OnboardingStates.INITIAL_SETUP]: '/onboarding/setup',
    [OnboardingStates.TOUR_ACTIVE]: '/onboarding/tour',
    [OnboardingStates.COMPLETED]: '/onboarding/complete',
    [OnboardingStates.ERROR]: '/onboarding/error',
  };
  return routeMap[currentState] ?? '/onboarding';
}

export type { OnboardingContext, OnboardingStore } from './types';
/**
 * Export everything for backward compatibility
 */
export { OnboardingEvents, OnboardingStates } from './types';
