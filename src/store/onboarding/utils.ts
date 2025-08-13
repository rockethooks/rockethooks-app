import {
  type OnboardingContext,
  OnboardingEvent,
  type OnboardingState,
  type OrganizationData,
  type PreferencesData,
  type ProfileData,
  type StateTransition,
} from '@/types/onboarding'

/**
 * Create initial context
 */
export function createInitialContext(): OnboardingContext {
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
export function findTransition(
  currentState: string,
  event: OnboardingEvent,
  transitions: StateTransition[]
): StateTransition | null {
  return (
    transitions.find((t) => t.from === currentState && t.event === event) ??
    null
  )
}

/**
 * Create state object from type and payload
 */
export function createStateObject(
  type: string,
  payload?: Record<string, unknown>
): OnboardingState {
  switch (type) {
    case 'START':
      return { type: 'START' }
    case 'CHECK_ORGANIZATION':
      return {
        type: 'CHECK_ORGANIZATION',
        checking: (payload?.checking as boolean | undefined) ?? true,
      }
    case 'ORGANIZATION_SETUP': {
      const draft = payload?.draft as OrganizationData | undefined
      return draft
        ? { type: 'ORGANIZATION_SETUP', draft }
        : { type: 'ORGANIZATION_SETUP' }
    }
    case 'PROFILE_COMPLETION': {
      const draft = payload?.draft as ProfileData | undefined
      return {
        type: 'PROFILE_COMPLETION',
        organizationId: (payload?.organizationId as string) || '',
        ...(draft && { draft }),
      }
    }
    case 'PREFERENCES': {
      const draft = payload?.draft as PreferencesData | undefined
      return draft ? { type: 'PREFERENCES', draft } : { type: 'PREFERENCES' }
    }
    case 'COMPLETION':
      return { type: 'COMPLETION' }
    case 'DASHBOARD':
      return { type: 'DASHBOARD' }
    case 'ERROR':
      return {
        type: 'ERROR',
        error: (payload?.error as string) || 'Unknown error',
        previousState: (payload?.previousState as
          | OnboardingState
          | undefined) ?? {
          type: 'START',
        },
      }
    default:
      return { type: 'START' }
  }
}

/**
 * Get next event based on current state
 */
export function getNextEvent(state: OnboardingState): OnboardingEvent {
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
