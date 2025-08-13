import { useMemo } from 'react';
import {
  type OnboardingContext,
  OnboardingEvents,
  type OnboardingProgress,
  OnboardingStates,
  useOnboardingStore,
} from './machine';

/**
 * State checks interface for TypeScript support
 */
interface OnboardingStateChecks {
  isStart: boolean;
  isCheckingOrganization: boolean;
  isOrgSetup: boolean;
  isProfile: boolean;
  isPreferences: boolean;
  isCompletion: boolean;
  isDashboard: boolean;
  isError: boolean;
  isComplete: boolean;
}

/**
 * Context data interface for easy access
 */
interface OnboardingContextData {
  userId: string;
  organizationId: string | null;
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<string>;
  skippedSteps: Set<string>;
  isComplete: boolean;
  startedAt: string | null;
  completedAt: string | null;
  errors: Array<{ timestamp: string; error: string; state: string }>;
}

/**
 * All available actions interface
 */
interface OnboardingActions {
  // Core state machine actions
  begin: () => boolean;
  hasOrganization: () => boolean;
  noOrganization: () => boolean;

  // Step completion actions
  setOrganization: (organizationId: string) => boolean;
  completeOrganization: () => boolean;
  skipOrganization: () => boolean;
  completeProfile: () => boolean;
  savePreferences: () => boolean;
  skipPreferences: () => boolean;
  complete: () => boolean;

  // Navigation actions
  goBack: () => boolean;
  skip: () => boolean;
  reset: () => void;
  retry: () => boolean;

  // Context management actions
  updateContext: (updates: Partial<OnboardingContext>) => void;
  addError: (error: string) => void;
  clearErrors: () => void;

  // Initialization
  initialize: (userId: string, organizationId?: string) => void;
}

/**
 * Capabilities interface for conditional rendering
 */
interface OnboardingCapabilities {
  canGoBack: boolean;
  canSkip: boolean;
  canProceed: boolean;
}

/**
 * Complete onboarding hook interface
 */
interface UseOnboardingReturn {
  // Current state
  currentState: OnboardingStates;

  // State checks
  stateChecks: OnboardingStateChecks;

  // Context data
  context: OnboardingContextData;

  // Progress tracking
  progress: OnboardingProgress;

  // Actions
  actions: OnboardingActions;

  // Capabilities
  capabilities: OnboardingCapabilities;

  // Route information
  currentRoute: string;
}

/**
 * Main hook providing comprehensive onboarding state machine access
 *
 * @returns Complete onboarding state and actions interface
 * @example
 * ```tsx
 * function OnboardingComponent() {
 *   const { stateChecks, actions, progress, capabilities } = useOnboarding();
 *
 *   if (stateChecks.isStart) {
 *     return <button onClick={actions.begin}>Start Onboarding</button>;
 *   }
 *
 *   if (stateChecks.isOrgSetup) {
 *     return (
 *       <div>
 *         <OrganizationForm onComplete={actions.completeOrganization} />
 *         {capabilities.canSkip && <button onClick={actions.skip}>Skip</button>}
 *         {capabilities.canGoBack && <button onClick={actions.goBack}>Back</button>}
 *       </div>
 *     );
 *   }
 *
 *   return null;
 * }
 * ```
 */
export function useOnboarding(): UseOnboardingReturn {
  const store = useOnboardingStore();

  // State checks memoized for performance
  const stateChecks = useMemo<OnboardingStateChecks>(
    () => ({
      isStart: store.currentState === OnboardingStates.START,
      isCheckingOrganization:
        store.currentState === OnboardingStates.CHECK_ORGANIZATION,
      isOrgSetup: store.currentState === OnboardingStates.ORGANIZATION_SETUP,
      isProfile: store.currentState === OnboardingStates.PROFILE_COMPLETION,
      isPreferences: store.currentState === OnboardingStates.PREFERENCES,
      isCompletion: store.currentState === OnboardingStates.COMPLETION,
      isDashboard: store.currentState === OnboardingStates.DASHBOARD,
      isError: store.currentState === OnboardingStates.ERROR,
      isComplete: store.context.isComplete,
    }),
    [store.currentState, store.context.isComplete]
  );

  // Context data for easy access
  const context = useMemo<OnboardingContextData>(
    () => ({
      userId: store.context.userId,
      organizationId: store.context.organizationId,
      currentStep: store.context.currentStep,
      totalSteps: store.context.totalSteps,
      completedSteps: store.context.completedSteps,
      skippedSteps: store.context.skippedSteps,
      isComplete: store.context.isComplete,
      startedAt: store.context.startedAt,
      completedAt: store.context.completedAt,
      errors: store.context.errors,
    }),
    [store.context]
  );

  // Progress information with proper Zustand selector
  const progress = useMemo<OnboardingProgress>(
    () => store.getProgress(),
    [store]
  );

  // Actions with useCallback for stable references
  const actions = useMemo<OnboardingActions>(
    () => ({
      // Core state machine actions
      begin: () => store.sendEvent(OnboardingEvents.BEGIN),
      hasOrganization: () => store.sendEvent(OnboardingEvents.HAS_ORGANIZATION),
      noOrganization: () => store.sendEvent(OnboardingEvents.NO_ORGANIZATION),

      // Step completion actions
      setOrganization: (organizationId: string) => {
        store.updateContext({ organizationId });
        return store.sendEvent(OnboardingEvents.ORGANIZATION_CREATED);
      },
      completeOrganization: () =>
        store.sendEvent(OnboardingEvents.ORGANIZATION_CREATED),
      skipOrganization: () =>
        store.sendEvent(OnboardingEvents.SKIP_ORGANIZATION),
      completeProfile: () =>
        store.sendEvent(OnboardingEvents.PROFILE_COMPLETED),
      savePreferences: () =>
        store.sendEvent(OnboardingEvents.PREFERENCES_SAVED),
      skipPreferences: () => store.sendEvent(OnboardingEvents.SKIP_PREFERENCES),
      complete: () => store.sendEvent(OnboardingEvents.COMPLETE),

      // Navigation actions
      goBack: store.goBack,
      skip: store.skip,
      reset: store.reset,
      retry: () => store.sendEvent(OnboardingEvents.RETRY),

      // Context management actions
      updateContext: store.updateContext,
      addError: store.addError,
      clearErrors: store.clearErrors,

      // Initialization
      initialize: store.initialize,
    }),
    [store]
  );

  // Capabilities for conditional rendering
  const capabilities = useMemo<OnboardingCapabilities>(
    () => ({
      canGoBack: store.canGoBack(),
      canSkip: store.canSkip(),
      canProceed: progress.canProceed,
    }),
    [store, progress.canProceed]
  );

  // Current route
  const currentRoute = useMemo(() => store.getCurrentRoute(), [store]);

  return {
    currentState: store.currentState,
    stateChecks,
    context,
    progress,
    actions,
    capabilities,
    currentRoute,
  };
}

/**
 * Focused hook for progress tracking only
 *
 * @returns Progress information and navigation capabilities
 * @example
 * ```tsx
 * function ProgressBar() {
 *   const { percentage, currentStep, totalSteps, canGoBack, canSkip } = useOnboardingProgress();
 *
 *   return (
 *     <div>
 *       <div>Step {currentStep} of {totalSteps} ({percentage}%)</div>
 *       <ProgressBarComponent value={percentage} />
 *       {canGoBack && <button>← Back</button>}
 *       {canSkip && <button>Skip →</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnboardingProgress() {
  const store = useOnboardingStore();

  return useMemo(() => {
    const progress = store.getProgress();
    return {
      ...progress,
      // Add convenience properties
      isFirstStep: progress.currentStep === 1,
      isLastStep: progress.currentStep === progress.totalSteps,
      stepsRemaining: progress.totalSteps - progress.currentStep,
    };
  }, [store]);
}

/**
 * Hook for state checks only (lightweight)
 *
 * @returns Boolean state checks for conditional rendering
 * @example
 * ```tsx
 * function ConditionalContent() {
 *   const { isOrgSetup, isProfile, isComplete } = useOnboardingState();
 *
 *   if (isComplete) return <DashboardContent />;
 *   if (isOrgSetup) return <OrganizationSetup />;
 *   if (isProfile) return <ProfileCompletion />;
 *
 *   return null;
 * }
 * ```
 */
export function useOnboardingState(): OnboardingStateChecks {
  const currentState = useOnboardingStore((state) => state.currentState);
  const isComplete = useOnboardingStore((state) => state.context.isComplete);

  return useMemo<OnboardingStateChecks>(
    () => ({
      isStart: currentState === OnboardingStates.START,
      isCheckingOrganization:
        currentState === OnboardingStates.CHECK_ORGANIZATION,
      isOrgSetup: currentState === OnboardingStates.ORGANIZATION_SETUP,
      isProfile: currentState === OnboardingStates.PROFILE_COMPLETION,
      isPreferences: currentState === OnboardingStates.PREFERENCES,
      isCompletion: currentState === OnboardingStates.COMPLETION,
      isDashboard: currentState === OnboardingStates.DASHBOARD,
      isError: currentState === OnboardingStates.ERROR,
      isComplete,
    }),
    [currentState, isComplete]
  );
}

/**
 * Hook for actions only (no state)
 *
 * @returns Actions interface for triggering state changes
 * @example
 * ```tsx
 * function ActionButtons() {
 *   const actions = useOnboardingActions();
 *
 *   return (
 *     <div>
 *       <button onClick={actions.completeOrganization}>Complete Setup</button>
 *       <button onClick={actions.skip}>Skip This Step</button>
 *       <button onClick={actions.goBack}>Go Back</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnboardingActions(): OnboardingActions {
  const store = useOnboardingStore();

  return useMemo<OnboardingActions>(
    () => ({
      // Core state machine actions
      begin: () => store.sendEvent(OnboardingEvents.BEGIN),
      hasOrganization: () => store.sendEvent(OnboardingEvents.HAS_ORGANIZATION),
      noOrganization: () => store.sendEvent(OnboardingEvents.NO_ORGANIZATION),

      // Step completion actions
      setOrganization: (organizationId: string) => {
        store.updateContext({ organizationId });
        return store.sendEvent(OnboardingEvents.ORGANIZATION_CREATED);
      },
      completeOrganization: () =>
        store.sendEvent(OnboardingEvents.ORGANIZATION_CREATED),
      skipOrganization: () =>
        store.sendEvent(OnboardingEvents.SKIP_ORGANIZATION),
      completeProfile: () =>
        store.sendEvent(OnboardingEvents.PROFILE_COMPLETED),
      savePreferences: () =>
        store.sendEvent(OnboardingEvents.PREFERENCES_SAVED),
      skipPreferences: () => store.sendEvent(OnboardingEvents.SKIP_PREFERENCES),
      complete: () => store.sendEvent(OnboardingEvents.COMPLETE),

      // Navigation actions
      goBack: store.goBack,
      skip: store.skip,
      reset: store.reset,
      retry: () => store.sendEvent(OnboardingEvents.RETRY),

      // Context management actions
      updateContext: store.updateContext,
      addError: store.addError,
      clearErrors: store.clearErrors,

      // Initialization
      initialize: store.initialize,
    }),
    [store]
  );
}

/**
 * Hook for context data only
 *
 * @returns Context data for read-only access
 * @example
 * ```tsx
 * function UserInfo() {
 *   const { userId, organizationId, completedSteps } = useOnboardingContext();
 *
 *   return (
 *     <div>
 *       <p>User: {userId}</p>
 *       {organizationId && <p>Organization: {organizationId}</p>}
 *       <p>Completed: {completedSteps.size} steps</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnboardingContext(): OnboardingContextData {
  const context = useOnboardingStore((state) => state.context);

  return useMemo<OnboardingContextData>(
    () => ({
      userId: context.userId,
      organizationId: context.organizationId,
      currentStep: context.currentStep,
      totalSteps: context.totalSteps,
      completedSteps: context.completedSteps,
      skippedSteps: context.skippedSteps,
      isComplete: context.isComplete,
      startedAt: context.startedAt,
      completedAt: context.completedAt,
      errors: context.errors,
    }),
    [context]
  );
}

/**
 * Hook for capabilities only (conditional rendering helpers)
 *
 * @returns Capabilities for conditional UI rendering
 * @example
 * ```tsx
 * function NavigationButtons() {
 *   const { canGoBack, canSkip, canProceed } = useOnboardingCapabilities();
 *   const actions = useOnboardingActions();
 *
 *   return (
 *     <div>
 *       {canGoBack && <button onClick={actions.goBack}>← Back</button>}
 *       {canSkip && <button onClick={actions.skip}>Skip →</button>}
 *       {canProceed && <button onClick={actions.completeProfile}>Continue →</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnboardingCapabilities(): OnboardingCapabilities {
  const store = useOnboardingStore();
  const progress = store.getProgress();

  return useMemo<OnboardingCapabilities>(
    () => ({
      canGoBack: store.canGoBack(),
      canSkip: store.canSkip(),
      canProceed: progress.canProceed,
    }),
    [store, progress.canProceed]
  );
}

// Export types for external use
export type {
  OnboardingStateChecks,
  OnboardingContextData,
  OnboardingActions,
  OnboardingCapabilities,
  UseOnboardingReturn,
};
