/**
 * Action functions for onboarding state machine transitions
 */

import type { OnboardingContext } from './types';

/**
 * Action: Set user ID when beginning onboarding
 */
export const setUserId = (
  context: OnboardingContext,
  payload: { userId: string }
): void => {
  context.userId = payload.userId;
  context.startedAt = new Date().toISOString();
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Set organization ID
 */
export const setOrganizationId = (
  context: OnboardingContext,
  payload: { organizationId: string }
): void => {
  context.organizationId = payload.organizationId;
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Mark step as completed
 */
export const markStepCompleted = (stepName: string) => {
  return (context: OnboardingContext): void => {
    context.completedSteps.add(stepName);
    context.skippedSteps.delete(stepName); // Remove from skipped if it was there
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Mark step as skipped
 */
export const markStepSkipped = (stepName: string) => {
  return (context: OnboardingContext): void => {
    context.skippedSteps.add(stepName);
    context.completedSteps.delete(stepName); // Remove from completed if it was there
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Increment step
 */
export const incrementStep = (context: OnboardingContext): void => {
  if (context.currentStep < context.totalSteps) {
    context.currentStep++;
    context.lastUpdatedAt = new Date().toISOString();
  }
};

/**
 * Action: Decrement step
 */
export const decrementStep = (context: OnboardingContext): void => {
  if (context.currentStep > 1) {
    context.currentStep--;
    context.lastUpdatedAt = new Date().toISOString();
  }
};

/**
 * Action: Set specific step
 */
export const setStep = (step: number) => {
  return (context: OnboardingContext): void => {
    if (step >= 1 && step <= context.totalSteps) {
      context.currentStep = step;
      context.lastUpdatedAt = new Date().toISOString();
    }
  };
};

/**
 * Action: Mark onboarding as complete
 */
export const markComplete = (context: OnboardingContext): void => {
  context.isComplete = true;
  context.completedAt = new Date().toISOString();
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Add error
 */
export const addErrorAction = (
  context: OnboardingContext,
  payload: { error: string; code?: string; field?: string }
): void => {
  context.errors.push({
    code: payload.code ?? 'UNKNOWN_ERROR',
    message: payload.error,
    field: payload.field,
    timestamp: new Date().toISOString(),
  });
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Clear all errors
 */
export const clearErrorsAction = (context: OnboardingContext): void => {
  context.errors = [];
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Set loading state
 */
export const setLoading = (isLoading: boolean) => {
  return (context: OnboardingContext): void => {
    context.isLoading = isLoading;
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Save draft data
 */
export const saveDraft = (
  stepName: 'organization' | 'profile' | 'preferences',
  data: Record<string, unknown>
) => {
  return (context: OnboardingContext): void => {
    context.draftData ??= {};
    context.draftData[stepName] = data;
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Clear draft data
 */
export const clearDraft = (
  stepName: 'organization' | 'profile' | 'preferences'
) => {
  return (context: OnboardingContext): void => {
    if (context.draftData) {
      const { [stepName]: _, ...rest } = context.draftData;
      if (Object.keys(rest).length > 0) {
        context.draftData = rest;
      } else {
        delete context.draftData;
      }
    }
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Reset onboarding state
 */
export const resetOnboarding = (context: OnboardingContext): void => {
  // Keep userId but reset everything else
  const userId = context.userId;
  Object.assign(context, {
    userId,
    organizationId: null,
    currentStep: 1,
    totalSteps: context.totalSteps, // Keep the calculated total
    completedSteps: new Set<string>(),
    skippedSteps: new Set<string>(),
    isComplete: false,
    isLoading: false,
    errors: [],
    startedAt: undefined,
    completedAt: undefined,
    lastUpdatedAt: new Date().toISOString(),
    draftData: undefined,
  });
};

/**
 * Composite action: Handle organization creation
 */
export const handleOrganizationCreated = (
  context: OnboardingContext,
  payload: { organizationId: string }
): void => {
  setOrganizationId(context, payload);
  markStepCompleted('organization')(context);
  clearDraft('organization')(context);
  incrementStep(context);
};

/**
 * Composite action: Handle profile completion
 */
export const handleProfileCompleted = (
  context: OnboardingContext,
  payload: { profileData: Record<string, unknown> }
): void => {
  saveDraft('profile', payload.profileData)(context);
  markStepCompleted('profile')(context);
  incrementStep(context);
};

/**
 * Composite action: Handle preferences saved
 */
export const handlePreferencesSaved = (
  context: OnboardingContext,
  payload: { preferences: Record<string, unknown> }
): void => {
  saveDraft('preferences', payload.preferences)(context);
  markStepCompleted('preferences')(context);
  incrementStep(context);
};

/**
 * Composite action: Handle skip organization
 */
export const handleSkipOrganization = (context: OnboardingContext): void => {
  markStepSkipped('organization')(context);
  incrementStep(context);
};

/**
 * Composite action: Handle skip preferences
 */
export const handleSkipPreferences = (context: OnboardingContext): void => {
  markStepSkipped('preferences')(context);
  incrementStep(context);
};
