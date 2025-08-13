/**
 * Step configurations for validation and navigation
 */
export const stepConfigs = {
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
} as const
