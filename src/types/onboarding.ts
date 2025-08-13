/**
 * Legacy type definitions for onboarding - kept for compatibility
 */

/**
 * Organization data interface for type safety
 */
export interface OrganizationData {
  name: string;
  size?: string;
  industry?: string;
  description?: string;
}

/**
 * Profile data interface
 */
export interface ProfileData {
  firstName?: string;
  lastName?: string;
  role?: string;
  company?: string;
}

/**
 * Preferences data interface
 */
export interface PreferencesData {
  notifications?: boolean;
  marketing?: boolean;
  analytics?: boolean;
}

/**
 * Union type for all draft data types
 */
export type DraftDataTypes = OrganizationData | ProfileData | PreferencesData;
