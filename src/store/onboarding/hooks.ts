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
      isInitialSetup: store.currentState === OnboardingStates.INITIAL_SETUP,
      isTourActive: store.currentState === OnboardingStates.TOUR_ACTIVE,
      isComplete: store.currentState === OnboardingStates.COMPLETED,
      isError: store.currentState === OnboardingStates.ERROR,

      // Backward compatibility aliases
      isStart: store.currentState === OnboardingStates.INITIAL_SETUP,
      isOrgSetup: store.currentState === OnboardingStates.INITIAL_SETUP,
      isCompletion: store.currentState === OnboardingStates.COMPLETED, // alias
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
      reset: store.reset,

      // Organization management
      createOrganization: store.createOrganization,
      skipOrganization: store.skipOrganization,

      // Tour management
      startTour: store.startTour,
      nextTourStep: store.nextTourStep,
      skipTour: store.skipTour,
      completeOnboarding: store.completeOnboarding,

      // Context updates
      updateContext: store.updateContext,
      initializeWithUserInfo: store.initializeWithUserInfo,

      // Error handling
      addError: store.addError,
      clearErrors: store.clearErrors,

      // State checks
      canTransition: store.canTransition,
      isInState: store.isInState,
      getProgress: store.getProgress,

      // Helper action aliases for backward compatibility
      begin: (userId: string, email?: string, displayName?: string) => {
        store.initializeWithUserInfo(userId, email, displayName);
      },
      retry: () => store.sendEvent(OnboardingEvents.RETRY),
      complete: () => store.completeOnboarding(),
    }),
    [
      store.sendEvent,
      store.reset,
      store.createOrganization,
      store.skipOrganization,
      store.startTour,
      store.nextTourStep,
      store.skipTour,
      store.completeOnboarding,
      store.updateContext,
      store.initializeWithUserInfo,
      store.addError,
      store.clearErrors,
      store.canTransition,
      store.isInState,
      store.getProgress,
    ]
  );

  // Capabilities
  const capabilities = useMemo(
    () => ({
      canGoBack: false, // Not supported in 3-state system
      canSkip:
        store.currentState === OnboardingStates.INITIAL_SETUP ||
        store.currentState === OnboardingStates.TOUR_ACTIVE,
      canProceed: true,
    }),
    [store.currentState]
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
    [OnboardingStates.INITIAL_SETUP]: '/onboarding/setup',
    [OnboardingStates.TOUR_ACTIVE]: '/onboarding/tour',
    [OnboardingStates.COMPLETED]: '/onboarding/complete',
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
