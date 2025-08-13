import type { OnboardingState } from '@/types/onboarding';
import { OnboardingEvent } from '@/types/onboarding';
import { stepConfigs } from './config';
import { useOnboardingStore } from './store';

export { stepConfigs as onboardingStepConfigs } from './config';
// Re-export everything from the modular structure
export { useOnboardingStore } from './store';
export { transitions } from './transitions';
export * from './utils';

// ========================================================================================
// Helper Functions and Exports
// ========================================================================================

/**
 * Initialize onboarding for a user
 */
export function initializeOnboarding(userId: string, organizationId?: string) {
  const store = useOnboardingStore.getState();

  store.updateContext({
    userId,
    organizationId: organizationId ?? null,
  });

  // Start the flow
  store.sendEvent(OnboardingEvent.BEGIN);

  // Skip organization setup if user already has an organization
  if (organizationId) {
    store.sendEvent(OnboardingEvent.HAS_ORGANIZATION);
  } else {
    store.sendEvent(OnboardingEvent.NO_ORGANIZATION);
  }
}

/**
 * Get route for current state
 */
export function getCurrentRoute(state: OnboardingState): string {
  const config = stepConfigs[state.type as keyof typeof stepConfigs];
  return config.route;
}
