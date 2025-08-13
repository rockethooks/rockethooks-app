/**
 * Guard functions for onboarding state machine transitions
 */

import type { OnboardingContext } from './types';

/**
 * Type guard to validate context structure
 */
export function isValidContext(context: unknown): context is OnboardingContext {
  if (!context || typeof context !== 'object') {
    return false;
  }

  const ctx = context as Partial<OnboardingContext>;

  return (
    typeof ctx.userId === 'string' &&
    (ctx.organizationId === undefined ||
      typeof ctx.organizationId === 'string') &&
    typeof ctx.currentStep === 'number' &&
    typeof ctx.totalSteps === 'number' &&
    ctx.completedSteps instanceof Set &&
    ctx.skippedSteps instanceof Set &&
    typeof ctx.isComplete === 'boolean' &&
    Array.isArray(ctx.errors)
  );
}

/**
 * Type guard to validate context updates
 */
export function isValidContextUpdate(
  updates: unknown
): updates is Partial<OnboardingContext> {
  if (!updates || typeof updates !== 'object') {
    return false;
  }

  const upd = updates as Record<string, unknown>;

  // Check each provided field is valid
  for (const [key, value] of Object.entries(upd)) {
    switch (key) {
      case 'userId':
        if (typeof value !== 'string') return false;
        break;
      case 'organizationId':
        if (value !== null && typeof value !== 'string') return false;
        break;
      case 'currentStep':
      case 'totalSteps':
        if (typeof value !== 'number') return false;
        break;
      case 'completedSteps':
      case 'skippedSteps':
        if (!(value instanceof Set)) return false;
        break;
      case 'isComplete':
      case 'isLoading':
        if (typeof value !== 'boolean') return false;
        break;
      case 'errors':
        if (!Array.isArray(value)) return false;
        break;
      case 'startedAt':
      case 'completedAt':
      case 'lastUpdatedAt':
        if (value !== undefined && typeof value !== 'string') return false;
        break;
      case 'draftData':
        if (value !== undefined && typeof value !== 'object') return false;
        break;
      default:
        // Unknown field
        return false;
    }
  }

  return true;
}

/**
 * Type guard to validate event payload
 */
export function isValidEventPayload(event: string, payload: unknown): boolean {
  // Add event-specific payload validation here
  switch (event) {
    case 'BEGIN':
      return (
        typeof payload === 'object' &&
        payload !== null &&
        'userId' in payload &&
        typeof (payload as Record<string, unknown>).userId === 'string'
      );
    case 'HAS_ORGANIZATION':
    case 'ORGANIZATION_CREATED':
      return (
        typeof payload === 'object' &&
        payload !== null &&
        'organizationId' in payload &&
        typeof (payload as Record<string, unknown>).organizationId === 'string'
      );
    case 'ERROR':
      return (
        typeof payload === 'object' &&
        payload !== null &&
        'error' in payload &&
        typeof (payload as Record<string, unknown>).error === 'string'
      );
    default:
      // Events without required payload
      return true;
  }
}

/**
 * Guard: Check if user has an organization
 */
export const hasOrganization = (context: OnboardingContext): boolean => {
  try {
    return isValidContext(context) && context.organizationId !== undefined;
  } catch (error) {
    console.error('Guard hasOrganization failed:', error);
    return false;
  }
};

/**
 * Guard: Check if user doesn't have an organization
 */
export const noOrganization = (context: OnboardingContext): boolean => {
  try {
    return isValidContext(context) && context.organizationId === undefined;
  } catch (error) {
    console.error('Guard noOrganization failed:', error);
    return false;
  }
};

/**
 * Guard: Check if organization step was skipped
 */
export const organizationSkipped = (context: OnboardingContext): boolean => {
  try {
    return isValidContext(context) && context.skippedSteps.has('organization');
  } catch (error) {
    console.error('Guard organizationSkipped failed:', error);
    return false;
  }
};

/**
 * Guard: Check if profile step is completed
 */
export const profileCompleted = (context: OnboardingContext): boolean => {
  try {
    return isValidContext(context) && context.completedSteps.has('profile');
  } catch (error) {
    console.error('Guard profileCompleted failed:', error);
    return false;
  }
};

/**
 * Guard: Check if we can go back
 */
export const canGoBackGuard = (context: OnboardingContext): boolean => {
  try {
    return isValidContext(context) && context.currentStep > 1;
  } catch (error) {
    console.error('Guard canGoBackGuard failed:', error);
    return false;
  }
};

/**
 * Guard: Check if current step can be skipped
 */
export const canSkipGuard = (context: OnboardingContext): boolean => {
  try {
    if (!isValidContext(context)) return false;

    // Define which steps can be skipped
    const skippableSteps = ['organization', 'preferences'];
    const currentStepName = getCurrentStepName(context.currentStep);

    return skippableSteps.includes(currentStepName);
  } catch (error) {
    console.error('Guard canSkipGuard failed:', error);
    return false;
  }
};

/**
 * Guard: Check if onboarding is complete
 */
export const isOnboardingComplete = (context: OnboardingContext): boolean => {
  try {
    if (!isValidContext(context)) return false;

    const requiredSteps = ['profile'];
    return requiredSteps.every(
      (step) =>
        context.completedSteps.has(step) || context.skippedSteps.has(step)
    );
  } catch (error) {
    console.error('Guard isOnboardingComplete failed:', error);
    return false;
  }
};

/**
 * Helper: Get step name from step number
 */
function getCurrentStepName(stepNumber: number): string {
  const stepMap: Record<number, string> = {
    1: 'organization',
    2: 'profile',
    3: 'preferences',
    4: 'account',
  };
  return stepMap[stepNumber] ?? 'unknown';
}
