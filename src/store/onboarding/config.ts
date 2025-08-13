/**
 * Configuration for the onboarding state machine
 */

import type { OnboardingContext, StepConfig } from './types';
import { OnboardingStates } from './types';

/**
 * Step configurations for the onboarding flow
 */
export const stepConfigs: Record<string, StepConfig> = {
  organization: {
    id: 'organization',
    title: 'Organization Setup',
    description: 'Create or join an organization',
    isRequired: false,
    canSkip: true,
    state: OnboardingStates.ORGANIZATION_SETUP,
    validationRules: [
      {
        field: 'name',
        rule: 'required',
        message: 'Organization name is required',
      },
      {
        field: 'name',
        rule: 'minLength:3',
        message: 'Organization name must be at least 3 characters',
      },
    ],
  },
  profile: {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Tell us a bit about yourself',
    isRequired: true,
    canSkip: false,
    state: OnboardingStates.PROFILE_COMPLETION,
    validationRules: [
      {
        field: 'displayName',
        rule: 'required',
        message: 'Display name is required',
      },
      {
        field: 'role',
        rule: 'required',
        message: 'Please select your role',
      },
    ],
  },
  preferences: {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Customize your experience',
    isRequired: false,
    canSkip: true,
    state: OnboardingStates.PREFERENCES_SETUP,
    validationRules: [],
  },
  account: {
    id: 'account',
    title: 'Account Settings',
    description: 'Configure your account settings',
    isRequired: false,
    canSkip: true,
    state: OnboardingStates.ACCOUNT_SETUP,
    validationRules: [],
  },
};

/**
 * Calculate total steps dynamically
 */
export const calculateTotalSteps = (): number => {
  return Object.keys(stepConfigs).length;
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
  return Object.values(stepConfigs).filter((config) => config.isRequired);
};

/**
 * Get skippable steps
 */
export const getSkippableSteps = (): StepConfig[] => {
  return Object.values(stepConfigs).filter((config) => config.canSkip);
};

/**
 * Initial context configuration
 */
export const getInitialContext = (): OnboardingContext => ({
  currentStep: 1,
  totalSteps: calculateTotalSteps(),
  completedSteps: new Set<string>(),
  skippedSteps: new Set<string>(),
  isComplete: false,
  isLoading: false,
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
  'currentStep',
  'totalSteps',
  'completedSteps',
  'skippedSteps',
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
