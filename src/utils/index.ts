/**
 * Utility functions and hooks for the RocketHooks application
 */

// Onboarding draft management
export {
  type ApiTargetDraft,
  type AutoSaveResult,
  clearDrafts,
  clearStepDraft,
  type DraftData,
  getAllDrafts,
  getDraft,
  type OnboardingStep,
  // Types
  type OrganizationDraft,
  type PreferencesDraft,
  // Functions
  saveDraft,
  // Hooks
  useAutoSaveDraft,
  type WebhookDraft,
} from './onboardingDrafts';
