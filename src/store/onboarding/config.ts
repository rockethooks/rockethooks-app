/**
 * Configuration for the onboarding state machine
 */

import type { OnboardingContext, StepConfig } from './types';
import { OnboardingStates } from './types';

/**
 * Step configurations for the onboarding flow
 */
export const stepConfigs: Record<string, StepConfig> = {
  initialSetup: {
    id: 'initialSetup',
    title: 'Organization Setup',
    description: 'Create your organization and workspace',
    state: OnboardingStates.INITIAL_SETUP,
  },
  tourActive: {
    id: 'tourActive',
    title: 'Quick Tour',
    description: 'Learn the basics of RocketHooks',
    state: OnboardingStates.TOUR_ACTIVE,
  },
  completed: {
    id: 'completed',
    title: 'Welcome!',
    description: 'You are all set up and ready to go',
    state: OnboardingStates.COMPLETED,
  },
};

/**
 * Calculate total steps dynamically
 */
export const calculateTotalSteps = (): number => {
  // Fixed 3 states: INITIAL_SETUP, TOUR_ACTIVE, COMPLETED
  return 3;
};

/**
 * Get step configuration by ID
 */
export const getStepConfig = (stepId: string): StepConfig | undefined => {
  return stepConfigs[stepId];
};

/**
 * Get step configuration by state
 */
export const getStepConfigByState = (
  state: OnboardingStates
): StepConfig | undefined => {
  return Object.values(stepConfigs).find((config) => config.state === state);
};

/**
 * Get required steps
 */
export const getRequiredSteps = (): StepConfig[] => {
  // All steps are required in the 3-state system
  return Object.values(stepConfigs);
};

/**
 * Get skippable steps
 */
export const getSkippableSteps = (): StepConfig[] => {
  // Organization setup and tour can be skipped
  return [stepConfigs.initialSetup, stepConfigs.tourActive].filter(
    (config): config is StepConfig => Boolean(config)
  );
};

/**
 * Initial context configuration
 */
export const getInitialContext = (): OnboardingContext => ({
  // Organization setup
  isCreatingOrganization: false,

  // Tour progress (3 meaningful steps)
  currentTourStep: 1,
  totalTourSteps: 3,
  completedTourSteps: new Set<string>(),
  skippedTour: false,

  // State flags
  isComplete: false,
  isLoading: false,

  // Error handling
  errors: [],
});

/**
 * Storage configuration
 */
export const STORAGE_KEY = 'onboarding-state';
export const STORAGE_VERSION = 1;

/**
 * Allowed fields for context updates
 */
export const ALLOWED_CONTEXT_FIELDS = [
  'userId',
  'organizationId',
  'suggestedOrganizationName',
  'organizationName',
  'isCreatingOrganization',
  'organizationCreationError',
  'currentTourStep',
  'totalTourSteps',
  'completedTourSteps',
  'skippedTour',
  'isComplete',
  'isLoading',
  'errors',
  'draftData',
  'startedAt',
  'completedAt',
  'lastUpdatedAt',
] as const;

/**
 * DevTools configuration
 */
export const DEVTOOLS_CONFIG = {
  name: 'Onboarding State Machine',
  trace: true,
  anonymize: false,
};
