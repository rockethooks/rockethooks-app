/**
 * Guard functions for onboarding state machine transitions
 */

import { loggers } from '@/utils';
import type { OnboardingContext } from './types';

const logger = loggers.onboarding;

/**
 * Type guard to validate context structure
 */
export function isValidContext(context: unknown): context is OnboardingContext {
  if (!context || typeof context !== 'object') {
    return false;
  }

  const ctx = context as Partial<OnboardingContext>;

  return (
    (ctx.userId === undefined || typeof ctx.userId === 'string') &&
    (ctx.organizationId === undefined ||
      typeof ctx.organizationId === 'string') &&
    typeof ctx.isCreatingOrganization === 'boolean' &&
    typeof ctx.currentTourStep === 'number' &&
    typeof ctx.totalTourSteps === 'number' &&
    ctx.completedTourSteps instanceof Set &&
    typeof ctx.skippedTour === 'boolean' &&
    typeof ctx.isComplete === 'boolean' &&
    typeof ctx.isLoading === 'boolean' &&
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
        if (value !== undefined && typeof value !== 'string') return false;
        break;
      case 'organizationId':
        if (value !== undefined && typeof value !== 'string') return false;
        break;
      case 'suggestedOrganizationName':
      case 'organizationName':
      case 'organizationCreationError':
        if (value !== undefined && typeof value !== 'string') return false;
        break;
      case 'isCreatingOrganization':
      case 'skippedTour':
      case 'isComplete':
      case 'isLoading':
        if (typeof value !== 'boolean') return false;
        break;
      case 'currentTourStep':
      case 'totalTourSteps':
        if (typeof value !== 'number') return false;
        break;
      case 'completedTourSteps':
        if (!(value instanceof Set)) return false;
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
    case 'ORGANIZATION_CREATED':
      return (
        typeof payload === 'object' &&
        payload !== null &&
        'organizationId' in payload &&
        'organizationName' in payload &&
        typeof (payload as Record<string, unknown>).organizationId ===
          'string' &&
        typeof (payload as Record<string, unknown>).organizationName ===
          'string'
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
    logger.error('Guard hasOrganization failed:', error);
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
    logger.error('Guard noOrganization failed:', error);
    return false;
  }
};

/**
 * Guard: Check if organization step was skipped
 */
export const canAdvanceTourStep = (context: OnboardingContext): boolean => {
  try {
    return (
      isValidContext(context) &&
      context.currentTourStep < context.totalTourSteps
    );
  } catch (error) {
    logger.error('Guard canAdvanceTourStep failed:', error);
    return false;
  }
};

/**
 * Guard: Check if profile step is completed
 */
export const isTourComplete = (context: OnboardingContext): boolean => {
  try {
    return (
      isValidContext(context) &&
      context.currentTourStep >= context.totalTourSteps
    );
  } catch (error) {
    logger.error('Guard isTourComplete failed:', error);
    return false;
  }
};

/**
 * Guard: Check if we can go back
 */
export const canGoBackGuard = (context: OnboardingContext): boolean => {
  try {
    // Can go back from TOUR_ACTIVE to INITIAL_SETUP
    return isValidContext(context) && context.currentTourStep > 1;
  } catch (error) {
    logger.error('Guard canGoBackGuard failed:', error);
    return false;
  }
};

/**
 * Guard: Check if current step can be skipped
 */
export const canSkipGuard = (context: OnboardingContext): boolean => {
  try {
    // Both organization setup and tour can be skipped
    return isValidContext(context);
  } catch (error) {
    logger.error('Guard canSkipGuard failed:', error);
    return false;
  }
};

/**
 * Guard: Check if onboarding is complete
 */
export const isOnboardingComplete = (context: OnboardingContext): boolean => {
  try {
    if (!isValidContext(context)) return false;

    // Onboarding is complete when we reach the COMPLETED state
    return context.isComplete;
  } catch (error) {
    logger.error('Guard isOnboardingComplete failed:', error);
    return false;
  }
};

/**
 * Helper: Get step name from step number
 */
// Removed helper function - no longer needed in 3-state system
