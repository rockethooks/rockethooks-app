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
import { loggers } from '@/utils';
import {
  clearStepDraft,
  type DraftData,
  type OnboardingStep,
  saveDraft,
  useAutoSaveDraft,
} from '@/utils/onboardingDrafts';

const logger = loggers.onboarding;

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
        logger.debug('Initialized with:', {
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
        logger.debug('Navigating:', {
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
      [OnboardingStates.INITIAL_SETUP]: 'organization',
      [OnboardingStates.TOUR_ACTIVE]: 'organization',
      [OnboardingStates.COMPLETED]: 'organization',
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
        logger.debug('Draft saved:', {
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
      logger.debug('Draft cleared:', currentStep);
    }
  }, [currentStep, setDraftData, debug]);

  // Navigation actions
  const completeStep = useCallback(
    (data?: DraftData) => {
      let success = false;

      switch (store.currentState) {
        case OnboardingStates.INITIAL_SETUP:
          // Complete organization setup by creating organization
          if (data && 'organizationName' in data) {
            void store.createOrganization(data.organizationName as string);
            success = true;
          } else {
            // Skip organization setup
            success = store.skipOrganization();
          }
          break;
        case OnboardingStates.TOUR_ACTIVE: {
          // Advance tour step or complete onboarding
          const progress = store.getProgress();
          if (progress.current >= progress.total) {
            success = store.completeOnboarding();
          } else {
            // Convert DraftData to plain object for nextTourStep
            const stepData = data
              ? ({ ...data } as Record<string, unknown>)
              : undefined;
            success = store.nextTourStep(stepData);
          }
          break;
        }
        case OnboardingStates.COMPLETED:
          // Already completed
          success = true;
          break;
        default:
          success = false;
      }

      if (success) {
        clearDraft();
      }
      return success;
    },
    [store, clearDraft]
  );

  const skipStep = useCallback(() => {
    let success = false;

    switch (store.currentState) {
      case OnboardingStates.INITIAL_SETUP:
        success = store.skipOrganization();
        break;
      case OnboardingStates.TOUR_ACTIVE:
        success = store.skipTour();
        break;
      default:
        success = false;
    }

    if (success) {
      clearDraft();
    }
    return success;
  }, [store, clearDraft]);

  // goBack functionality is not available in the new 3-state system
  const goBack = useCallback(() => {
    if (debug) {
      logger.warn('goBack is not supported in the 3-state system');
    }
    return false;
  }, [debug]);

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

    // Map states to step numbers for overall onboarding progress
    let currentStep = 1;
    const totalSteps = 3;

    switch (store.currentState) {
      case OnboardingStates.INITIAL_SETUP:
        currentStep = 1;
        break;
      case OnboardingStates.TOUR_ACTIVE:
        currentStep = 2;
        break;
      case OnboardingStates.COMPLETED:
        currentStep = 3;
        break;
      case OnboardingStates.ERROR:
        currentStep = 1; // Reset to beginning
        break;
    }

    return {
      ...progressData,
      currentStep,
      totalSteps,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === totalSteps,
      stepsRemaining: totalSteps - currentStep,
    };
  }, [store]);

  // State checks
  const stateChecks = useMemo(
    () => ({
      isInitialSetup: store.currentState === OnboardingStates.INITIAL_SETUP,
      isTourActive: store.currentState === OnboardingStates.TOUR_ACTIVE,
      isComplete: store.currentState === OnboardingStates.COMPLETED,
      isError: store.currentState === OnboardingStates.ERROR,
      needsOnboarding: !store.context.isComplete && isSignedIn,

      // Backward compatibility aliases
      isOrgSetup: store.currentState === OnboardingStates.INITIAL_SETUP,
      isStart: store.currentState === OnboardingStates.INITIAL_SETUP,
    }),
    [store.currentState, store.context.isComplete, isSignedIn]
  );

  // Capabilities
  const capabilities = useMemo(
    () => ({
      canGoBack: false, // Not supported in 3-state system
      canSkip:
        store.currentState === OnboardingStates.INITIAL_SETUP ||
        store.currentState === OnboardingStates.TOUR_ACTIVE,
      canProceed: !!currentStep,
    }),
    [store.currentState, currentStep]
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
