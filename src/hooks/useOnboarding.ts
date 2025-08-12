import { useAuth, useUser } from '@clerk/clerk-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import {
  getCurrentRoute,
  initializeOnboarding,
  useOnboardingStore,
} from '@/store/onboarding.store'
import { OnboardingEvent } from '@/types/onboarding'
import {
  clearStepDraft,
  type DraftData,
  getDraft,
  type OnboardingStep,
  saveDraft,
  useAutoSaveDraft,
} from '@/utils/onboardingDrafts'

/**
 * Hook configuration options
 */
interface UseOnboardingOptions {
  /**
   * Whether to auto-initialize the state machine on mount
   * @default true
   */
  autoInitialize?: boolean

  /**
   * Whether to auto-navigate based on state changes
   * @default true
   */
  autoNavigate?: boolean

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean
}

/**
 * Bridge hook that combines state machine with draft system and existing auth store
 *
 * This hook provides a unified interface for:
 * - State machine navigation and flow control
 * - Draft data persistence and auto-save
 * - Integration with existing auth store
 * - Automatic navigation based on state changes
 */
export function useOnboarding(options: UseOnboardingOptions = {}) {
  const { autoInitialize = true, autoNavigate = true, debug = false } = options

  const navigate = useNavigate()
  const { isLoaded, orgId } = useAuth()
  const { user } = useUser()

  // State machine store
  const {
    currentState,
    context,
    sendEvent,
    canTransition,
    reset,
    goBack,
    skip,
    canGoBack,
    canSkip,
    getProgress,
    addError,
    clearErrors,
  } = useOnboardingStore()

  // Auth store for legacy compatibility
  const { completeOnboardingStep, updateProfile } = useAuthStore()

  // Get current step name for draft system
  const currentStepName = useMemo((): OnboardingStep | null => {
    switch (currentState.type) {
      case 'ORGANIZATION_SETUP':
        return 'organization'
      case 'PREFERENCES':
        return 'preferences'
      // Add other steps as they're implemented
      default:
        return null
    }
  }, [currentState.type])

  // Get draft data for current step
  const draft = useMemo(() => {
    return currentStepName ? getDraft(currentStepName) : null
  }, [currentStepName])

  // Auto-save hook for current step
  const autoSave = useAutoSaveDraft(
    currentStepName ?? 'organization', // fallback to valid step name
    draft ?? undefined,
    { enabled: !!currentStepName }
  )

  // Initialize state machine on mount
  useEffect(() => {
    if (!autoInitialize || !isLoaded || !user) return

    // Only initialize if we haven't started or if user changed
    if (currentState.type === 'START' || context.userId !== user.id) {
      if (debug) {
        console.log(
          '[useOnboarding] Initializing state machine for user:',
          user.id
        )
      }

      initializeOnboarding(user.id, orgId ?? undefined)
    }
  }, [
    autoInitialize,
    isLoaded,
    user,
    orgId,
    currentState.type,
    context.userId,
    debug,
  ])

  // Auto-navigation based on state changes
  useEffect(() => {
    if (!autoNavigate) return

    const targetRoute = getCurrentRoute(currentState)
    const currentPath = window.location.pathname

    // Only navigate if we're not already on the target route
    if (
      targetRoute !== currentPath &&
      currentState.type !== 'START' &&
      currentState.type !== 'CHECK_ORGANIZATION'
    ) {
      if (debug) {
        console.log(
          '[useOnboarding] Auto-navigating from',
          currentPath,
          'to',
          targetRoute
        )
      }
      void navigate(targetRoute)
    }
  }, [currentState, navigate, autoNavigate, debug])

  // Sync with auth store for legacy compatibility
  useEffect(() => {
    if (context.completedSteps.size > 0) {
      const completedArray = Array.from(context.completedSteps)

      // Sync completed steps with auth store
      completedArray.forEach((stepName) => {
        completeOnboardingStep(stepName)
      })
    }
  }, [context.completedSteps, completeOnboardingStep])

  // Complete current step
  const completeStep = useCallback(
    (data?: DraftData) => {
      const eventMap = {
        ORGANIZATION_SETUP: OnboardingEvent.ORGANIZATION_CREATED,
        PROFILE_COMPLETION: OnboardingEvent.PROFILE_COMPLETED,
        PREFERENCES: OnboardingEvent.PREFERENCES_SAVED,
        COMPLETION: OnboardingEvent.COMPLETE,
      }

      const event = eventMap[currentState.type as keyof typeof eventMap]
      if (!event) {
        if (debug) {
          console.warn(
            '[useOnboarding] Invalid state for completion:',
            currentState.type
          )
        }
        return false
      }

      try {
        // Save final draft data if provided
        if (data && currentStepName) {
          saveDraft(currentStepName, data)
        }

        // Send state machine event
        const success = sendEvent(event, data)

        if (success) {
          // Clear draft on successful transition
          if (currentStepName) {
            clearStepDraft(currentStepName)
          }

          // Handle specific step completion logic
          if (currentState.type === 'ORGANIZATION_SETUP' && data) {
            // Update profile with organization information
            updateProfile({
              company: (data as { name: string }).name,
            })
          }

          if (debug) {
            console.log(
              '[useOnboarding] Step completed successfully:',
              currentState.type
            )
          }
        }

        return success
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        addError(errorMessage)
        sendEvent(OnboardingEvent.ERROR_OCCURRED, {
          error: errorMessage,
          previousState: currentState,
        })

        if (debug) {
          console.error('[useOnboarding] Step completion failed:', error)
        }

        return false
      }
    },
    [currentState, currentStepName, sendEvent, addError, updateProfile, debug]
  )

  // Skip current step
  const skipStep = useCallback(() => {
    if (!canSkip()) {
      if (debug) {
        console.warn(
          '[useOnboarding] Cannot skip current step:',
          currentState.type
        )
      }
      return false
    }

    const success = skip()

    if (success && currentStepName) {
      // Clear draft when skipping
      clearStepDraft(currentStepName)

      if (debug) {
        console.log('[useOnboarding] Step skipped:', currentState.type)
      }
    }

    return success
  }, [canSkip, skip, currentStepName, currentState.type, debug])

  // Go to previous step
  const goToPreviousStep = useCallback(() => {
    if (!canGoBack()) {
      if (debug) {
        console.warn(
          '[useOnboarding] Cannot go back from current step:',
          currentState.type
        )
      }
      return false
    }

    const success = goBack()

    if (debug && success) {
      console.log('[useOnboarding] Went back from:', currentState.type)
    }

    return success
  }, [canGoBack, goBack, currentState.type, debug])

  // Save draft data
  const saveDraftData = useCallback(
    (data: DraftData) => {
      if (!currentStepName) {
        if (debug) {
          console.warn(
            '[useOnboarding] No current step name, cannot save draft'
          )
        }
        return false
      }

      const success = saveDraft(currentStepName, data)

      if (debug) {
        console.log(
          '[useOnboarding] Draft saved for step:',
          currentStepName,
          success
        )
      }

      return success
    },
    [currentStepName, debug]
  )

  // Check if we can proceed to next step
  const canProceed = useMemo(() => {
    const nextEvent = (() => {
      switch (currentState.type) {
        case 'ORGANIZATION_SETUP':
          return OnboardingEvent.ORGANIZATION_CREATED
        case 'PROFILE_COMPLETION':
          return OnboardingEvent.PROFILE_COMPLETED
        case 'PREFERENCES':
          return OnboardingEvent.PREFERENCES_SAVED
        case 'COMPLETION':
          return OnboardingEvent.COMPLETE
        default:
          return null
      }
    })()

    return nextEvent ? canTransition(nextEvent) : false
  }, [currentState.type, canTransition])

  // Progress information
  const progress = useMemo(() => getProgress(), [getProgress])

  // Navigation helpers
  const navigation = useMemo(
    () => ({
      isFirstStep:
        currentState.type === 'ORGANIZATION_SETUP' &&
        !context.skippedSteps.has('organization'),
      isLastStep: currentState.type === 'COMPLETION',
      currentRoute: getCurrentRoute(currentState),
      canGoBack: canGoBack(),
      canSkip: canSkip(),
      canProceed,
    }),
    [currentState, context.skippedSteps, canGoBack, canSkip, canProceed]
  )

  // Error handling
  const hasErrors = context.errors.length > 0
  const latestError = hasErrors
    ? context.errors[context.errors.length - 1]
    : null

  // Recovery from errors
  const retry = useCallback(() => {
    clearErrors()
    return sendEvent(OnboardingEvent.RETRY)
  }, [clearErrors, sendEvent])

  // Reset onboarding
  const resetOnboarding = useCallback(() => {
    reset()

    // Clear all drafts
    const steps: OnboardingStep[] = [
      'organization',
      'preferences',
      'apiTarget',
      'webhook',
    ]
    steps.forEach((step) => clearStepDraft(step))

    if (debug) {
      console.log('[useOnboarding] Onboarding reset')
    }
  }, [reset, debug])

  return {
    // State
    currentState,
    context,
    progress,
    navigation,

    // Draft management
    draft,
    saveDraft: saveDraftData,
    autoSave,

    // Actions
    completeStep,
    skipStep,
    goBack: goToPreviousStep,
    retry,
    reset: resetOnboarding,

    // Status checks
    canProceed,
    isLoading: !isLoaded || currentState.type === 'CHECK_ORGANIZATION',

    // Error handling
    hasErrors,
    errors: context.errors,
    latestError,
    clearErrors,

    // Legacy compatibility - map to existing patterns
    onComplete: completeStep,
    onNext: completeStep,
    isFirstStep: navigation.isFirstStep,
    isLastStep: navigation.isLastStep,

    // Debug info (only included if debug enabled)
    ...(debug && {
      debug: {
        currentState,
        context,
        transitions: useOnboardingStore
          .getState()
          .transitions.filter((t) => t.from === currentState.type),
      },
    }),
  }
}

/**
 * Simplified hook for basic onboarding functionality
 * Use this when you don't need the full bridge functionality
 */
export function useOnboardingBasic() {
  return useOnboarding({
    autoInitialize: true,
    autoNavigate: false,
    debug: false,
  })
}

/**
 * Hook for debugging onboarding state machine
 * Only use in development
 */
export function useOnboardingDebug() {
  return useOnboarding({
    autoInitialize: true,
    autoNavigate: true,
    debug: true,
  })
}
