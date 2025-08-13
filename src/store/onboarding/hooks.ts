import { useMemo } from 'react';
import { useOnboardingStore } from './machine';
import type { OnboardingContext } from './types';
import { OnboardingEvents, OnboardingStates } from './types';

/**
 * Hook for accessing onboarding state machine functionality
 * Provides memoized selectors and actions for optimal performance
 */
export function useOnboarding() {
  const store = useOnboardingStore();

  // Memoized state checks
  const stateChecks = useMemo(
    () => ({
      isStart: store.currentState === OnboardingStates.START,
      isCheckingOrganization:
        store.currentState === OnboardingStates.CHECK_ORGANIZATION,
      isOrgSetup: store.currentState === OnboardingStates.ORGANIZATION_SETUP,
      isProfile: store.currentState === OnboardingStates.PROFILE_COMPLETION,
      isPreferences: store.currentState === OnboardingStates.PREFERENCES_SETUP,
      isAccount: store.currentState === OnboardingStates.ACCOUNT_SETUP,
      isComplete: store.currentState === OnboardingStates.COMPLETE,
      isCompletion: store.currentState === OnboardingStates.COMPLETE, // alias
      isError: store.currentState === OnboardingStates.ERROR,
      isDashboard: false, // deprecated state
    }),
    [store.currentState]
  );
  const baseProgress = store.getProgress();
  // Memoized progress with extended properties
  const progress = useMemo(() => {
    return {
      ...baseProgress,
      currentStep: baseProgress.current, // alias
      totalSteps: baseProgress.total, // alias
      isFirstStep: baseProgress.current === 1,
      isLastStep: baseProgress.current === baseProgress.total,
      stepsRemaining: baseProgress.total - baseProgress.current,
    };
  }, [baseProgress]);

  // Memoized actions with helper methods
  const actions = useMemo(
    () => ({
      // Core navigation
      sendEvent: store.sendEvent,
      goBack: store.goBack,
      skip: store.skip,
      reset: store.reset,

      // Context updates
      updateContext: store.updateContext,

      // Error handling
      addError: store.addError,
      clearErrors: store.clearErrors,

      // State checks
      canGoBack: store.canGoBack,
      canSkip: store.canSkip,
      canTransition: store.canTransition,

      // Helper action aliases for backward compatibility
      begin: () => store.sendEvent(OnboardingEvents.BEGIN),
      retry: () => store.sendEvent(OnboardingEvents.RETRY),
      completeOrganization: () =>
        store.sendEvent(OnboardingEvents.ORGANIZATION_CREATED),
      completeProfile: () =>
        store.sendEvent(OnboardingEvents.PROFILE_COMPLETED),
      savePreferences: () =>
        store.sendEvent(OnboardingEvents.PREFERENCES_SAVED),
      skipPreferences: () => store.sendEvent(OnboardingEvents.SKIP_PREFERENCES),
      complete: () => store.sendEvent(OnboardingEvents.ACCOUNT_COMPLETED),
    }),
    [
      store.sendEvent,
      store.goBack,
      store.skip,
      store.reset,
      store.updateContext,
      store.addError,
      store.clearErrors,
      store.canGoBack,
      store.canSkip,
      store.canTransition,
    ]
  );

  // Capabilities
  const capabilities = useMemo(
    () => ({
      canGoBack: store.canGoBack(),
      canSkip: store.canSkip(),
      canProceed: true,
    }),
    [store.canGoBack, store.canSkip]
  );

  // Current route
  const currentRoute = useOnboardingRoute();

  return {
    currentState: store.currentState,
    context: store.context,
    stateChecks,
    progress,
    actions,
    capabilities,
    currentRoute,
  };
}

/**
 * Hook for accessing specific state properties with selectors
 */
export function useOnboardingState<T>(
  selector: (state: {
    currentState: OnboardingStates;
    context: OnboardingContext;
  }) => T
) {
  return useOnboardingStore(selector);
}

/**
 * Hook for checking if onboarding is complete
 */
export function useIsOnboardingComplete() {
  return useOnboardingStore((state) => state.context.isComplete);
}

/**
 * Hook for getting current onboarding route
 */
export function useOnboardingRoute() {
  const currentState = useOnboardingStore((state) => state.currentState);

  const routeMap: Partial<Record<OnboardingStates, string>> = {
    [OnboardingStates.START]: '/onboarding',
    [OnboardingStates.CHECK_ORGANIZATION]: '/onboarding',
    [OnboardingStates.ORGANIZATION_SETUP]: '/onboarding/organization',
    [OnboardingStates.PROFILE_COMPLETION]: '/onboarding/profile',
    [OnboardingStates.PREFERENCES_SETUP]: '/onboarding/preferences',
    [OnboardingStates.ACCOUNT_SETUP]: '/onboarding/account',
    [OnboardingStates.COMPLETE]: '/onboarding/complete',
    [OnboardingStates.ERROR]: '/onboarding/error',
  };

  return routeMap[currentState] ?? '/onboarding';
}

/**
 * Hook for accessing onboarding progress (alias for useOnboarding progress)
 */
export function useOnboardingProgress() {
  const store = useOnboardingStore();
  const baseProgress = store.getProgress();
  return {
    ...baseProgress,
    currentStep: baseProgress.current, // alias
    totalSteps: baseProgress.total, // alias
    isFirstStep: baseProgress.current === 1,
    isLastStep: baseProgress.current === baseProgress.total,
    stepsRemaining: baseProgress.total - baseProgress.current,
  };
}
