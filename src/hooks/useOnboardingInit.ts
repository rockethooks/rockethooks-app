/**
 * Hook for initializing onboarding with Clerk OAuth integration
 * Provides smart organization name generation and automatic initialization
 */

import { useUser } from '@clerk/clerk-react';
import { useCallback, useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { OrganizationNameGenerator } from '@/store/onboarding/organization-generator';
import { loggers } from '@/utils';

const logger = loggers.onboarding;

/**
 * Hook options for customizing initialization behavior
 */
interface UseOnboardingInitOptions {
  /**
   * Whether to automatically initialize onboarding when user is loaded
   * @default true
   */
  autoInitialize?: boolean;

  /**
   * Whether to generate organization suggestions from user email
   * @default true
   */
  generateSuggestions?: boolean;

  /**
   * Custom callback when initialization completes
   */
  onInitialized?: (userId: string, suggestedName?: string) => void;

  /**
   * Custom callback when initialization fails
   */
  onError?: (error: Error) => void;
}

/**
 * Return type for the hook
 */
interface UseOnboardingInitReturn {
  /**
   * Whether the onboarding has been initialized
   */
  isInitialized: boolean;

  /**
   * Whether initialization is in progress
   */
  isInitializing: boolean;

  /**
   * Any error that occurred during initialization
   */
  error: string | null;

  /**
   * Suggested organization name (if available)
   */
  suggestedOrganizationName?: string | undefined;

  /**
   * Manually initialize onboarding (useful when autoInitialize is false)
   */
  initialize: () => void;

  /**
   * Get organization suggestions for the current user
   */
  getOrganizationSuggestions: () => Array<{
    name: string;
    isPersonal: boolean;
    source: 'email-domain' | 'display-name' | 'default';
    confidence: 'high' | 'medium' | 'low';
  }>;
}

/**
 * Hook for initializing onboarding with Clerk OAuth integration
 */
export function useOnboardingInit(
  options: UseOnboardingInitOptions = {}
): UseOnboardingInitReturn {
  const {
    autoInitialize = true,
    generateSuggestions = true,
    onInitialized,
    onError,
  } = options;

  // Clerk user data
  const { user, isLoaded: isUserLoaded } = useUser();

  // Onboarding store
  const { context, initializeWithUserInfo, updateContext } =
    useOnboardingStore();

  // Track initialization state
  const isInitialized = Boolean(context.userId);
  const isInitializing = context.isLoading;
  const error = context.errors.length > 0 ? context.errors[0].message : null;

  /**
   * Get organization suggestions for the current user
   */
  const getOrganizationSuggestions = () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      logger.warn('No email address available for organization suggestions');
      return [];
    }

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const displayName = user.fullName ?? user.firstName ?? undefined;

      return OrganizationNameGenerator.generateSuggestions(email, displayName);
    } catch (error) {
      logger.error('Failed to generate organization suggestions:', error);
      return [];
    }
  };

  /**
   * Initialize onboarding with user information
   */
  const initialize = useCallback(() => {
    if (!user?.id) {
      const error = new Error(
        'User not available for onboarding initialization'
      );
      logger.error('Initialization failed:', error.message);
      onError?.(error);
      return;
    }

    try {
      logger.info('Initializing onboarding for user:', user.id);

      // Extract user information
      const userId = user.id;
      const email = user.primaryEmailAddress?.emailAddress;
      const displayName = user.fullName ?? user.firstName ?? undefined;

      // Initialize the onboarding store
      initializeWithUserInfo(userId, email, displayName);

      let suggestion:
        | { name: string; isPersonal: boolean; confidence: string }
        | undefined;

      // Generate and set organization suggestions if enabled
      if (generateSuggestions && email) {
        try {
          suggestion = OrganizationNameGenerator.getPrimarySuggestion(
            email,
            displayName
          );

          updateContext({
            suggestedOrganizationName: suggestion.name,
          });

          logger.debug('Generated organization suggestion:', {
            name: suggestion.name,
            isPersonal: suggestion.isPersonal,
            confidence: suggestion.confidence,
          });
        } catch (suggestionError) {
          logger.warn(
            'Failed to generate organization suggestion:',
            suggestionError
          );
          // Don't fail initialization if suggestion generation fails
        }
      }

      // Call success callback
      onInitialized?.(userId, suggestion?.name);

      logger.success('Onboarding initialization completed');
    } catch (error) {
      const initError =
        error instanceof Error
          ? error
          : new Error('Unknown initialization error');
      logger.error('Onboarding initialization failed:', initError);
      onError?.(initError);
    }
  }, [
    user,
    generateSuggestions,
    initializeWithUserInfo,
    updateContext,
    onInitialized,
    onError,
  ]);

  // Auto-initialize when user is loaded
  useEffect(() => {
    if (!autoInitialize || !isUserLoaded || !user || isInitialized) {
      return;
    }

    // Initialize immediately when all conditions are met
    // No artificial delay needed - user.isLoaded already ensures data is ready
    initialize();
  }, [isUserLoaded, user, isInitialized, autoInitialize, initialize]);

  return {
    isInitialized,
    isInitializing,
    error,
    suggestedOrganizationName: context.suggestedOrganizationName,
    initialize,
    getOrganizationSuggestions,
  };
}

/**
 * Hook for getting organization name validation
 */
export function useOrganizationValidation() {
  return {
    /**
     * Validate an organization name
     */
    validateName: (name: string) => {
      return OrganizationNameGenerator.validateOrganizationName(name);
    },

    /**
     * Get suggestions for a given email and display name
     */
    getSuggestions: (email: string, displayName?: string) => {
      return OrganizationNameGenerator.generateSuggestions(email, displayName);
    },
  };
}

/**
 * Simple hook for just getting organization suggestions without initialization
 */
export function useOrganizationSuggestions() {
  const { user } = useUser();

  const getSuggestions = () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return [];
    }

    const email = user.primaryEmailAddress.emailAddress;
    const displayName = user.fullName ?? user.firstName ?? undefined;

    return OrganizationNameGenerator.generateSuggestions(email, displayName);
  };

  const getPrimarySuggestion = () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return null;
    }

    const email = user.primaryEmailAddress.emailAddress;
    const displayName = user.fullName ?? user.firstName ?? undefined;

    return OrganizationNameGenerator.getPrimarySuggestion(email, displayName);
  };

  return {
    getSuggestions,
    getPrimarySuggestion,
  };
}
