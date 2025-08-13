import type { OnboardingStepConfig } from '@/types/onboarding';

/**
 * Step configurations for validation and navigation
 * Maps state types to their corresponding step configurations
 */
export const stepConfigs: Record<string, OnboardingStepConfig> = {
  ORGANIZATION_SETUP: {
    id: 'organization',
    name: 'Organization Setup',
    canSkip: true,
    canGoBack: false,
    requiresValidation: true,
    order: 1,
    route: '/onboarding/organization',
  },
  PROFILE_COMPLETION: {
    id: 'profile',
    name: 'Profile Completion',
    canSkip: false,
    canGoBack: true,
    requiresValidation: false,
    order: 2,
    route: '/onboarding/profile',
  },
  PREFERENCES: {
    id: 'preferences',
    name: 'Preferences',
    canSkip: true,
    canGoBack: true,
    requiresValidation: false,
    order: 3,
    route: '/onboarding/preferences',
  },
  COMPLETION: {
    id: 'completion',
    name: 'Completion',
    canSkip: false,
    canGoBack: false,
    requiresValidation: false,
    order: 4,
    route: '/onboarding/complete',
  },
} as const;

/**
 * Type-safe helper to get step config for a given state type
 */
export function getStepConfig(
  stateType: string
): OnboardingStepConfig | undefined {
  return stepConfigs[stateType];
}

/**
 * Get all step configs ordered by their order property
 */
export function getOrderedStepConfigs(): OnboardingStepConfig[] {
  return Object.values(stepConfigs).sort((a, b) => a.order - b.order);
}
