/**
 * State transition configurations for the onboarding state machine
 */

import * as actions from './actions';
import * as guards from './guards';
import type { TransitionConfig } from './types';
import { OnboardingEvents, OnboardingStates } from './types';

/**
 * Define all state transitions for the onboarding flow
 */
export const transitions: TransitionConfig[] = [
  // INITIAL_SETUP state transitions
  {
    from: OnboardingStates.INITIAL_SETUP,
    event: OnboardingEvents.ORGANIZATION_CREATED,
    to: OnboardingStates.TOUR_ACTIVE,
    action: (context, payload) => {
      if (
        payload &&
        typeof payload === 'object' &&
        'organizationId' in payload &&
        'organizationName' in payload
      ) {
        actions.handleOrganizationCreated(
          context,
          payload as { organizationId: string; organizationName: string }
        );
      }
    },
  },
  {
    from: OnboardingStates.INITIAL_SETUP,
    event: OnboardingEvents.SKIP_ORGANIZATION,
    to: OnboardingStates.TOUR_ACTIVE,
    action: (context) => {
      actions.handleSkipOrganization(context);
    },
  },
  {
    from: OnboardingStates.INITIAL_SETUP,
    event: OnboardingEvents.START_TOUR,
    to: OnboardingStates.TOUR_ACTIVE,
    action: (context) => {
      actions.startTour(context);
    },
  },

  // TOUR_ACTIVE state transitions
  {
    from: OnboardingStates.TOUR_ACTIVE,
    event: OnboardingEvents.NEXT_TOUR_STEP,
    to: OnboardingStates.TOUR_ACTIVE,
    guard: (context) => guards.canAdvanceTourStep(context),
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'stepData' in payload) {
        actions.handleNextTourStep(
          context,
          payload as { stepData?: Record<string, unknown> }
        );
      } else {
        actions.handleNextTourStep(context, {});
      }
    },
  },
  {
    from: OnboardingStates.TOUR_ACTIVE,
    event: OnboardingEvents.COMPLETE_ONBOARDING,
    to: OnboardingStates.COMPLETED,
    guard: (context) => guards.isTourComplete(context),
    action: (context) => {
      actions.completeOnboarding(context);
    },
  },
  {
    from: OnboardingStates.TOUR_ACTIVE,
    event: OnboardingEvents.SKIP_TOUR,
    to: OnboardingStates.COMPLETED,
    action: (context) => {
      actions.skipTour(context);
      actions.completeOnboarding(context);
    },
  },

  // ERROR state transitions
  {
    from: OnboardingStates.ERROR,
    event: OnboardingEvents.RETRY,
    to: OnboardingStates.INITIAL_SETUP,
    action: (context) => {
      actions.clearErrorsAction(context);
    },
  },
  {
    from: OnboardingStates.ERROR,
    event: OnboardingEvents.RESET,
    to: OnboardingStates.INITIAL_SETUP,
    action: (context) => {
      actions.resetOnboarding(context);
    },
  },

  // Global error handling (from any state)
  {
    from: OnboardingStates.INITIAL_SETUP,
    event: OnboardingEvents.ERROR,
    to: OnboardingStates.ERROR,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'error' in payload) {
        actions.addErrorAction(
          context,
          payload as { error: string; code?: string; field?: string }
        );
      }
    },
  },
  {
    from: OnboardingStates.TOUR_ACTIVE,
    event: OnboardingEvents.ERROR,
    to: OnboardingStates.ERROR,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'error' in payload) {
        actions.addErrorAction(
          context,
          payload as { error: string; code?: string; field?: string }
        );
      }
    },
  },
];

/**
 * Helper function to find a transition
 */
export function findTransition(
  currentState: OnboardingStates,
  event: OnboardingEvents
): TransitionConfig | undefined {
  return transitions.find((t) => t.from === currentState && t.event === event);
}

/**
 * Helper function to get available transitions from a state
 */
export function getAvailableTransitions(
  currentState: OnboardingStates
): TransitionConfig[] {
  return transitions.filter((t) => t.from === currentState);
}

/**
 * Helper function to validate if a transition is possible
 */
export function canTransition(
  currentState: OnboardingStates,
  event: OnboardingEvents,
  context: unknown
): boolean {
  const transition = findTransition(currentState, event);
  if (!transition) return false;

  // Check guard if present
  if (transition.guard && !guards.isValidContext(context)) {
    return false;
  }

  if (transition.guard && guards.isValidContext(context)) {
    return transition.guard(context);
  }

  return true;
}
