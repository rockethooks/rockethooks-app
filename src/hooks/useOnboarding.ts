import { useAuth, useUser } from '@clerk/clerk-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import {
  getCurrentRoute,
  initializeOnboarding,
  OnboardingEvents,
  OnboardingStates,
  useOnboardingStore,
} from '@/store/onboarding';
import {
  clearStepDraft,
  type DraftData,
  type OnboardingStep,
  saveDraft,
  useAutoSaveDraft,
} from '@/utils/onboardingDrafts';

/**
 * Hook configuration options
 */
interface UseOnboardingOptions {
  /**
   * Whether to auto-initialize the state machine on mount
   * @default true
   */
  autoInitialize?: boolean;

  /**
   * Whether to auto-navigate based on state changes
   * @default true
   */
  autoNavigate?: boolean;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Bridge hook that combines state machine with draft system and existing auth store
 *
 * This hook provides a unified interface for:
 * - State machine navigation and flow control
 * - Draft data persistence and auto-save
 * - Integration with existing auth store
 */
export function useOnboarding(options: UseOnboardingOptions = {}) {
  const { autoInitialize = true, autoNavigate = true, debug = false } = options;

  // External hooks
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Store hooks
  const authStore = useAuthStore();
  const store = useOnboardingStore();

  // Initialize state machine when auth is ready
  useEffect(() => {
    if (!autoInitialize || !authLoaded) return;

    if (isSignedIn && user) {
      const organizationId = user.publicMetadata.organizationId as
        | string
        | undefined;
      initializeOnboarding(user.id, organizationId);

      if (debug) {
        console.log('[useOnboarding] Initialized with:', {
          userId: user.id,
          organizationId,
          currentState: store.currentState,
        });
      }
    }
  }, [authLoaded, isSignedIn, user, autoInitialize, debug, store.currentState]);

  // Auto-navigation based on state changes
  useEffect(() => {
    if (!autoNavigate) return;

    const route = getCurrentRoute();
    const currentPath = window.location.pathname;

    if (route !== currentPath) {
      if (debug) {
        console.log('[useOnboarding] Navigating:', {
          from: currentPath,
          to: route,
          state: store.currentState,
        });
      }
      void navigate(route);
    }
  }, [store.currentState, autoNavigate, navigate, debug]);

  // Helper to get current step name for draft system
  const currentStep = useMemo((): OnboardingStep => {
    const stepMap: Record<OnboardingStates, OnboardingStep> = {
      [OnboardingStates.ORGANIZATION_SETUP]: 'organization',
      [OnboardingStates.PROFILE_COMPLETION]: 'profile',
      [OnboardingStates.PREFERENCES_SETUP]: 'preferences',
      [OnboardingStates.ACCOUNT_SETUP]: 'account',
      [OnboardingStates.START]: 'organization',
      [OnboardingStates.CHECK_ORGANIZATION]: 'organization',
      [OnboardingStates.COMPLETE]: 'organization',
      [OnboardingStates.ERROR]: 'organization',
    };
    return stepMap[store.currentState];
  }, [store.currentState]);

  // Draft management
  const { draftData, setDraftData } = useAutoSaveDraft(currentStep);

  const saveDraftData = useCallback(
    (data: DraftData) => {
      setDraftData(data);
      saveDraft(currentStep, data);

      if (debug) {
        console.log('[useOnboarding] Draft saved:', {
          step: currentStep,
          data,
        });
      }
    },
    [currentStep, setDraftData, debug]
  );

  const clearDraft = useCallback(() => {
    clearStepDraft(currentStep);
    setDraftData(null);

    if (debug) {
      console.log('[useOnboarding] Draft cleared:', currentStep);
    }
  }, [currentStep, setDraftData, debug]);

  // Navigation actions
  const completeStep = useCallback(
    (data?: DraftData) => {
      let event: OnboardingEvents | null = null;

      switch (store.currentState) {
        case OnboardingStates.ORGANIZATION_SETUP:
          event = OnboardingEvents.ORGANIZATION_CREATED;
          break;
        case OnboardingStates.PROFILE_COMPLETION:
          event = OnboardingEvents.PROFILE_COMPLETED;
          break;
        case OnboardingStates.PREFERENCES_SETUP:
          event = OnboardingEvents.PREFERENCES_SAVED;
          break;
        case OnboardingStates.ACCOUNT_SETUP:
          event = OnboardingEvents.ACCOUNT_COMPLETED;
          break;
      }

      if (event) {
        const success = store.sendEvent(event, data);
        if (success) {
          clearDraft();
        }
        return success;
      }
      return false;
    },
    [store, clearDraft]
  );

  const skipStep = useCallback(() => {
    const success = store.skip();
    if (success) {
      clearDraft();
    }
    return success;
  }, [store, clearDraft]);

  const goBack = useCallback(() => {
    return store.goBack();
  }, [store]);

  const handleError = useCallback(
    (error: string) => {
      store.addError(error);
      store.sendEvent(OnboardingEvents.ERROR, { error });
    },
    [store]
  );

  // Progress tracking
  const progress = useMemo(() => {
    const progressData = store.getProgress();
    return {
      ...progressData,
      isFirstStep: progressData.current === 1,
      isLastStep: progressData.current === progressData.total,
      stepsRemaining: progressData.total - progressData.current,
    };
  }, [store]);

  // State checks
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
      isError: store.currentState === OnboardingStates.ERROR,
      needsOnboarding: !store.context.isComplete && isSignedIn,
    }),
    [store.currentState, store.context.isComplete, isSignedIn]
  );

  // Capabilities
  const capabilities = useMemo(
    () => ({
      canGoBack: store.canGoBack(),
      canSkip: store.canSkip(),
      canProceed: !!currentStep,
    }),
    [store, currentStep]
  );

  return {
    // Current state
    currentState: store.currentState,
    context: store.context,

    // State checks
    ...stateChecks,

    // Progress
    progress,

    // Capabilities
    ...capabilities,

    // Draft management
    draftData,
    saveDraftData,
    clearDraft,

    // Actions
    completeStep,
    skipStep,
    goBack,
    handleError,
    reset: store.reset,
    clearErrors: store.clearErrors,

    // Error helpers (for backward compatibility)
    hasErrors: store.context.errors.length > 0,
    latestError: store.context.errors[store.context.errors.length - 1]?.message,

    // Utilities
    currentStep,
    getCurrentRoute,

    // Debug info
    debug: debug
      ? {
          store: store,
          authStore: authStore,
          currentStep,
          draftData,
        }
      : undefined,
  };
}
