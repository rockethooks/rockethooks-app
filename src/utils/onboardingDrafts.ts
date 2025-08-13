import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { organizationSchema } from '@/lib/validations/onboarding';

// ========================================================================================
// Type Definitions
// ========================================================================================

/**
 * Organization draft data collected during onboarding
 */
export interface OrganizationDraft {
  name?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry?: string;
  website?: string;
  description?: string;
}

/**
 * Profile draft data collected during onboarding
 */
export interface ProfileDraft {
  firstName?: string;
  lastName?: string;
  role?: 'developer' | 'manager' | 'admin' | 'other';
  experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  useCases?: string[];
  avatar?: string;
}

/**
 * User preferences draft data collected during onboarding
 */
export interface PreferencesDraft {
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
  alertFrequency?: 'instant' | 'hourly' | 'daily' | 'weekly';
}

/**
 * API target configuration draft data
 */
export interface ApiTargetDraft {
  name?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  authentication?: {
    type?: 'none' | 'bearer' | 'basic' | 'apikey';
    credentials?: Record<string, string>;
  };
  timeout?: number;
  retryConfig?: {
    maxRetries?: number;
    backoffStrategy?: 'exponential' | 'linear' | 'fixed';
  };
}

/**
 * Webhook configuration draft data
 */
export interface WebhookDraft {
  name?: string;
  url?: string;
  events?: string[];
  secret?: string;
  active?: boolean;
  retryConfig?: {
    maxRetries?: number;
    backoffStrategy?: 'exponential' | 'linear' | 'fixed';
    retryDelays?: number[];
  };
  filters?: {
    headers?: Record<string, string>;
    bodyPatterns?: string[];
  };
}

/**
 * Union type for all draft data types
 */
export type DraftData =
  | OrganizationDraft
  | ProfileDraft
  | PreferencesDraft
  | ApiTargetDraft
  | WebhookDraft;

/**
 * Onboarding step names
 */
export type OnboardingStep =
  | 'organization'
  | 'profile'
  | 'preferences'
  | 'apiTarget'
  | 'webhook';

/**
 * Internal storage structure for draft data
 */
interface DraftWrapper<T = DraftData> {
  data: T;
  timestamp: number;
  version?: string;
}

/**
 * Return type for auto-save hook
 */
export interface AutoSaveResult {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  forceSave: () => void;
  clearError: () => void;
}

// ========================================================================================
// Constants
// ========================================================================================

const DRAFT_KEY_PREFIX = 'rh-onboarding-draft-';
const DRAFT_EXPIRY_DAYS = 7;
const DEBOUNCE_DELAY = 500;
const DRAFT_VERSION = '1.0';

// ========================================================================================
// Schema Definitions for Validation
// ========================================================================================

// Profile schema for validation
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['developer', 'manager', 'admin', 'other']).optional(),
  experience: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .optional(),
  useCases: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

// Preferences schema for validation
const preferencesSchema = z.object({
  notifications: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  alertFrequency: z.enum(['instant', 'hourly', 'daily', 'weekly']).optional(),
});

// API Target schema for validation
const apiTargetSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  authentication: z
    .object({
      type: z.enum(['none', 'bearer', 'basic', 'apikey']).optional(),
      credentials: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  timeout: z.number().optional(),
  retryConfig: z
    .object({
      maxRetries: z.number().optional(),
      backoffStrategy: z.enum(['exponential', 'linear', 'fixed']).optional(),
    })
    .optional(),
});

// Webhook schema for validation
const webhookSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  events: z.array(z.string()).optional(),
  secret: z.string().optional(),
  active: z.boolean().optional(),
  retryConfig: z
    .object({
      maxRetries: z.number().optional(),
      backoffStrategy: z.enum(['exponential', 'linear', 'fixed']).optional(),
      retryDelays: z.array(z.number()).optional(),
    })
    .optional(),
  filters: z
    .object({
      headers: z.record(z.string(), z.string()).optional(),
      bodyPatterns: z.array(z.string()).optional(),
    })
    .optional(),
});

// Map of step names to their validation schemas
const stepSchemas: Record<OnboardingStep, z.ZodType> = {
  organization: organizationSchema,
  profile: profileSchema,
  preferences: preferencesSchema,
  apiTarget: apiTargetSchema,
  webhook: webhookSchema,
};

// ========================================================================================
// Helper Functions
// ========================================================================================

/**
 * Validate draft data against the schema for a specific step
 * Returns validated data if valid, null if invalid
 */
function validateDraftData(
  step: OnboardingStep,
  data: unknown
): DraftData | null {
  const schema = stepSchemas[step];
  // Schema is always defined for valid OnboardingStep values

  try {
    const validated = schema.parse(data);
    return validated as DraftData;
  } catch (error) {
    console.warn(`Draft data validation failed for step ${step}:`, error);
    return null;
  }
}

/**
 * Get the localStorage key for a specific onboarding step
 */
function getDraftKey(step: OnboardingStep): string {
  return `${DRAFT_KEY_PREFIX}${step}`;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a draft is expired based on the 7-day rule
 */
function isDraftExpired(timestamp: number): boolean {
  const now = Date.now();
  const expiryTime = DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return now - timestamp > expiryTime;
}

/**
 * Safely parse JSON with error handling
 */
function safeParse(json: string): DraftWrapper | null {
  try {
    return JSON.parse(json) as DraftWrapper;
  } catch (error) {
    console.error('Failed to parse draft JSON:', error);
    return null;
  }
}

/**
 * Validate draft wrapper structure
 */
function isValidDraftWrapper(obj: unknown): obj is DraftWrapper {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    'timestamp' in obj &&
    typeof (obj as { timestamp: unknown }).timestamp === 'number'
  );
}

/**
 * Clean up expired drafts from localStorage
 */
function cleanupExpiredDrafts(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    const draftKeys = keys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));

    for (const key of draftKeys) {
      const stored = localStorage.getItem(key);
      if (!stored) continue;

      const wrapper = safeParse(stored);
      if (!wrapper || !isValidDraftWrapper(wrapper)) {
        // Invalid format, remove it
        localStorage.removeItem(key);
        continue;
      }

      if (isDraftExpired(wrapper.timestamp)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup expired drafts:', error);
  }
}

// ========================================================================================
// Core Draft Management Functions
// ========================================================================================

/**
 * Save draft data for a specific onboarding step
 */
export function saveDraft(step: OnboardingStep, data: DraftData): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    // Clean up expired drafts before saving new ones
    cleanupExpiredDrafts();

    const wrapper: DraftWrapper = {
      data,
      timestamp: Date.now(),
      version: DRAFT_VERSION,
    };

    const key = getDraftKey(step);
    localStorage.setItem(key, JSON.stringify(wrapper));
    return true;
  } catch (error) {
    console.error(`Failed to save draft for step ${step}:`, error);
    return false;
  }
}

/**
 * Retrieve draft data for a specific onboarding step
 * Includes schema validation to ensure data integrity
 */
export function getDraft(step: OnboardingStep): DraftData | null {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return null;
  }

  try {
    const key = getDraftKey(step);
    const stored = localStorage.getItem(key);

    if (!stored) {
      return null;
    }

    const wrapper = safeParse(stored);
    if (!wrapper || !isValidDraftWrapper(wrapper)) {
      // Invalid format, remove it
      localStorage.removeItem(key);
      return null;
    }

    if (isDraftExpired(wrapper.timestamp)) {
      // Expired draft, remove it
      localStorage.removeItem(key);
      return null;
    }

    // Validate the draft data against the current schema
    const validatedData = validateDraftData(step, wrapper.data);
    if (!validatedData) {
      // Data doesn't match current schema, remove it to prevent errors
      console.warn(
        `Removing invalid draft for step ${step} due to schema mismatch`
      );
      localStorage.removeItem(key);
      return null;
    }

    return validatedData;
  } catch (error) {
    console.error(`Failed to get draft for step ${step}:`, error);
    return null;
  }
}

/**
 * Get all draft data for all onboarding steps
 */
export function getAllDrafts(): Partial<Record<OnboardingStep, DraftData>> {
  const drafts: Partial<Record<OnboardingStep, DraftData>> = {};
  const steps: OnboardingStep[] = [
    'organization',
    'profile',
    'preferences',
    'apiTarget',
    'webhook',
  ];

  for (const step of steps) {
    const draft = getDraft(step);
    if (draft) {
      drafts[step] = draft;
    }
  }

  return drafts;
}

/**
 * Clear all draft data
 */
export function clearDrafts(): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    const keys = Object.keys(localStorage);
    const draftKeys = keys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));

    for (const key of draftKeys) {
      localStorage.removeItem(key);
    }

    return true;
  } catch (error) {
    console.error('Failed to clear all drafts:', error);
    return false;
  }
}

/**
 * Clear draft data for a specific onboarding step
 */
export function clearStepDraft(step: OnboardingStep): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    const key = getDraftKey(step);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to clear draft for step ${step}:`, error);
    return false;
  }
}

// ========================================================================================
// React Hook for Auto-Save with Debouncing
// ========================================================================================

/**
 * Hook for automatically saving draft data with debouncing
 *
 * @param step - The onboarding step name
 * @param data - The form data to save
 * @param options - Configuration options
 * @returns Auto-save result with status and controls
 */
export function useAutoSaveDraft(
  step: OnboardingStep,
  data: DraftData | undefined,
  options: {
    debounceDelay?: number;
    enabled?: boolean;
  } = {}
): AutoSaveResult {
  const { debounceDelay = DEBOUNCE_DELAY, enabled = true } = options;

  // Store data in a ref to avoid dependency issues
  const dataRef = useRef(data);
  dataRef.current = data;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Save function with error handling
  const performSave = useCallback(
    async (dataToSave: DraftData | undefined) => {
      if (!isMountedRef.current || !dataToSave) return;

      setIsSaving(true);
      setError(null);

      try {
        // Simulate async operation to prevent blocking UI
        await new Promise((resolve) => setTimeout(resolve, 0));

        const success = saveDraft(step, dataToSave);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!isMountedRef.current) return;

        if (success) {
          setLastSaved(new Date());
        } else {
          setError('Failed to save draft data');
        }
      } catch (saveError) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!isMountedRef.current) return;

        const errorMessage =
          saveError instanceof Error ? saveError.message : 'Unknown save error';
        setError(errorMessage);
        console.error(`Auto-save failed for step ${step}:`, saveError);
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [step]
  );

  // Force save function (bypasses debouncing)
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    void performSave(dataRef.current);
  }, [performSave]);

  // Debounced save effect with stable dependencies
  useEffect(() => {
    if (!enabled || !data || Object.keys(data).length === 0) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      void performSave(data);
    }, debounceDelay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [data, enabled, debounceDelay, performSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    error,
    forceSave,
    clearError,
  };
}

// ========================================================================================
// Additional Exports for State Machine Integration
// ========================================================================================

/**
 * Validate draft data for use with state machine
 * @param step - The onboarding step name
 * @param data - The data to validate
 * @returns True if data is valid, false otherwise
 */
export function validateDraft(step: OnboardingStep, data: unknown): boolean {
  return validateDraftData(step, data) !== null;
}
