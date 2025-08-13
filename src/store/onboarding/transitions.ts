import { OnboardingEvent, type StateTransition } from '@/types/onboarding'
import { getDraft, validateDraft } from '@/utils/onboardingDrafts'

/**
 * All state transitions for the onboarding flow
 */
export const transitions: StateTransition[] = [
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
