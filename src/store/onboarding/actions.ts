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
export const markTourStepCompleted = (stepName: string) => {
  return (context: OnboardingContext): void => {
    context.completedTourSteps.add(stepName);
    context.lastUpdatedAt = new Date().toISOString();
  };
};

/**
 * Action: Mark step as skipped
 */
export const advanceTourStep = (context: OnboardingContext): void => {
  if (context.currentTourStep < context.totalTourSteps) {
    context.currentTourStep++;
    context.lastUpdatedAt = new Date().toISOString();
  }
};

/**
 * Action: Increment step
 */
export const startTour = (context: OnboardingContext): void => {
  context.currentTourStep = 1;
  context.completedTourSteps.clear();
  context.skippedTour = false;
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Decrement step
 */
export const skipTour = (context: OnboardingContext): void => {
  context.skippedTour = true;
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Set specific step
 */
export const completeOnboarding = (context: OnboardingContext): void => {
  context.isComplete = true;
  context.completedAt = new Date().toISOString();
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Action: Mark onboarding as complete
 */
export const setSuggestedOrganizationName = (
  context: OnboardingContext,
  suggestedName: string
): void => {
  context.suggestedOrganizationName = suggestedName;
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
  stepName: 'organization',
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
export const clearDraft = (stepName: 'organization') => {
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

  // Clear optional properties
  delete context.organizationId;
  delete context.suggestedOrganizationName;
  delete context.organizationName;
  delete context.organizationCreationError;
  delete context.startedAt;
  delete context.completedAt;
  delete context.draftData;

  // Reset required properties
  Object.assign(context, {
    userId,
    isCreatingOrganization: false,
    currentTourStep: 1,
    totalTourSteps: 3,
    completedTourSteps: new Set<string>(),
    skippedTour: false,
    isComplete: false,
    isLoading: false,
    errors: [],
    lastUpdatedAt: new Date().toISOString(),
  });
};

/**
 * Composite action: Handle organization creation
 */
export const handleOrganizationCreated = (
  context: OnboardingContext,
  payload: { organizationId: string; organizationName: string }
): void => {
  setOrganizationId(context, { organizationId: payload.organizationId });
  context.organizationName = payload.organizationName;
  context.isCreatingOrganization = false;
  delete context.organizationCreationError;
  context.lastUpdatedAt = new Date().toISOString();
};

/**
 * Composite action: Handle profile completion
 */
export const handleNextTourStep = (
  context: OnboardingContext,
  payload: { stepData?: Record<string, unknown> }
): void => {
  // Mark current step as completed
  const stepName = `step-${String(context.currentTourStep)}`;
  markTourStepCompleted(stepName)(context);

  // Save step data if provided
  if (payload.stepData) {
    saveDraft('organization', payload.stepData)(context);
  }

  // Advance to next tour step
  advanceTourStep(context);
};

/**
 * Composite action: Handle preferences saved
 */
export const handleSkipOrganization = (context: OnboardingContext): void => {
  // No organization created, continue with tour
  delete context.organizationId;
  delete context.organizationName;
  context.isCreatingOrganization = false;
  context.lastUpdatedAt = new Date().toISOString();
};

// Removed duplicate function

// No longer needed in 3-state system
