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
  // START state transitions
  {
    from: OnboardingStates.START,
    event: OnboardingEvents.BEGIN,
    to: OnboardingStates.CHECK_ORGANIZATION,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'userId' in payload) {
        actions.setUserId(context, payload as { userId: string });
      }
      actions.setStep(1)(context);
    },
  },

  // CHECK_ORGANIZATION state transitions
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
    event: OnboardingEvents.HAS_ORGANIZATION,
    to: OnboardingStates.PROFILE_COMPLETION,
    guard: guards.hasOrganization,
    action: (context, payload) => {
      if (
        payload &&
        typeof payload === 'object' &&
        'organizationId' in payload
      ) {
        actions.setOrganizationId(
          context,
          payload as { organizationId: string }
        );
      }
      actions.markStepSkipped('organization')(context);
      actions.setStep(2)(context);
    },
  },
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
    event: OnboardingEvents.NO_ORGANIZATION,
    to: OnboardingStates.ORGANIZATION_SETUP,
    guard: guards.noOrganization,
    action: (context) => {
      actions.setStep(1)(context);
    },
  },

  // ORGANIZATION_SETUP state transitions
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.ORGANIZATION_CREATED,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: (context, payload) => {
      if (
        payload &&
        typeof payload === 'object' &&
        'organizationId' in payload
      ) {
        actions.handleOrganizationCreated(
          context,
          payload as { organizationId: string }
        );
      }
    },
  },
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.SKIP_ORGANIZATION,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: actions.handleSkipOrganization,
  },
  {
    from: OnboardingStates.ORGANIZATION_SETUP,
    event: OnboardingEvents.SKIP,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: actions.handleSkipOrganization,
  },

  // PROFILE_COMPLETION state transitions
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.PROFILE_COMPLETED,
    to: OnboardingStates.PREFERENCES_SETUP,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'profileData' in payload) {
        actions.handleProfileCompleted(
          context,
          payload as { profileData: Record<string, unknown> }
        );
      }
    },
  },
  {
    from: OnboardingStates.PROFILE_COMPLETION,
    event: OnboardingEvents.BACK,
    to: OnboardingStates.ORGANIZATION_SETUP,
    guard: (context) => !guards.organizationSkipped(context),
    action: actions.decrementStep,
  },

  // PREFERENCES_SETUP state transitions
  {
    from: OnboardingStates.PREFERENCES_SETUP,
    event: OnboardingEvents.PREFERENCES_SAVED,
    to: OnboardingStates.COMPLETE,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'preferences' in payload) {
        actions.handlePreferencesSaved(
          context,
          payload as { preferences: Record<string, unknown> }
        );
      }
      actions.markComplete(context);
    },
  },
  {
    from: OnboardingStates.PREFERENCES_SETUP,
    event: OnboardingEvents.SKIP_PREFERENCES,
    to: OnboardingStates.COMPLETE,
    action: (context) => {
      actions.handleSkipPreferences(context);
      actions.markComplete(context);
    },
  },
  {
    from: OnboardingStates.PREFERENCES_SETUP,
    event: OnboardingEvents.SKIP,
    to: OnboardingStates.COMPLETE,
    action: (context) => {
      actions.handleSkipPreferences(context);
      actions.markComplete(context);
    },
  },
  {
    from: OnboardingStates.PREFERENCES_SETUP,
    event: OnboardingEvents.BACK,
    to: OnboardingStates.PROFILE_COMPLETION,
    action: actions.decrementStep,
  },

  // ACCOUNT_SETUP state transitions (if needed)
  {
    from: OnboardingStates.ACCOUNT_SETUP,
    event: OnboardingEvents.ACCOUNT_COMPLETED,
    to: OnboardingStates.COMPLETE,
    action: (context, payload) => {
      if (payload && typeof payload === 'object' && 'accountData' in payload) {
        actions.saveDraft(
          'preferences',
          (payload as { accountData: Record<string, unknown> }).accountData
        )(context);
      }
      actions.markStepCompleted('account')(context);
      actions.markComplete(context);
    },
  },
  {
    from: OnboardingStates.ACCOUNT_SETUP,
    event: OnboardingEvents.BACK,
    to: OnboardingStates.PREFERENCES_SETUP,
    action: actions.decrementStep,
  },

  // ERROR state transitions
  {
    from: OnboardingStates.ERROR,
    event: OnboardingEvents.RETRY,
    to: OnboardingStates.START,
    action: (context) => {
      actions.clearErrorsAction(context);
      actions.resetOnboarding(context);
    },
  },

  // Global error handling (from any state)
  {
    from: OnboardingStates.CHECK_ORGANIZATION,
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
    from: OnboardingStates.ORGANIZATION_SETUP,
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
    from: OnboardingStates.PROFILE_COMPLETION,
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
    from: OnboardingStates.PREFERENCES_SETUP,
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
