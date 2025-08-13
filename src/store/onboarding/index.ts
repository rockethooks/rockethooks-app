/**
 * Onboarding state machine module exports
 *
 * This module provides a complete state machine implementation for onboarding flow
 * using Zustand with modular architecture for better maintainability
 */

// Actions (for testing or custom usage)
export * as actions from './actions';
// Configuration helpers
export {
  calculateTotalSteps,
  getRequiredSteps,
  getSkippableSteps,
  getStepConfig,
  getStepConfigByState,
} from './config';
// Guards (for testing or custom usage)
export * as guards from './guards';
// Main store and initialization
export {
  getCurrentRoute,
  initializeOnboarding,
  useOnboardingStore,
} from './machine';
// Transitions (for visualization or debugging)
export { findTransition, getAvailableTransitions } from './transitions';
export type {
  OnboardingContext,
  OnboardingEventPayload,
  OnboardingStore,
  StepConfig,
  TransitionConfig,
} from './types';
// Types
export { OnboardingEvents, OnboardingStates } from './types';
