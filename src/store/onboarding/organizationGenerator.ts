/**
 * Organization name generator for onboarding flow
 * Handles smart organization name generation from OAuth emails
 */

import { parse } from 'tldts';
import { loggers } from '@/utils';

const logger = loggers.onboarding;

/**
 * Configuration for personal email domains
 */
const PERSONAL_EMAIL_DOMAINS = new Set([
  // Google domains
  'gmail.com',
  'googlemail.com',

  // GitHub domains
  'users.noreply.github.com',

  // Other common personal domains
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'me.com',
  'protonmail.com',
  'aol.com',
]);

/**
 * Default workspace names for personal accounts
 */
const DEFAULT_PERSONAL_WORKSPACE_NAMES = [
  'My Workspace',
  'Personal',
  'Private Workspace',
];

/**
 * Interface for generated organization suggestion
 */
export interface OrganizationSuggestion {
  name: string;
  isPersonal: boolean;
  source: 'email-domain' | 'display-name' | 'default';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * OrganizationNameGenerator namespace
 * Generates appropriate organization names based on OAuth user information
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrganizationNameGenerator {
  /**
   * Generate organization name suggestions from user email and display name
   */
  export function generateSuggestions(
    email: string,
    displayName?: string
  ): OrganizationSuggestion[] {
    const suggestions: OrganizationSuggestion[] = [];

    logger.debug('Generating organization suggestions', { email, displayName });

    try {
      // Parse email domain
      const emailDomain = extractDomain(email);
      const isPersonalEmailDomain = isPersonalEmail(emailDomain);

      if (!isPersonalEmailDomain && emailDomain) {
        // Business email - suggest company name from domain
        const companySuggestion = generateCompanyName(emailDomain);
        if (companySuggestion) {
          suggestions.push({
            name: companySuggestion,
            isPersonal: false,
            source: 'email-domain',
            confidence: 'high',
          });
        }
      }

      // Always provide personal workspace options
      if (displayName) {
        // Use display name for personal workspace
        const personalName = generatePersonalWorkspaceName(displayName);
        suggestions.push({
          name: personalName,
          isPersonal: true,
          source: 'display-name',
          confidence: 'medium',
        });
      }

      // Default personal workspace options
      DEFAULT_PERSONAL_WORKSPACE_NAMES.forEach((name) => {
        suggestions.push({
          name,
          isPersonal: true,
          source: 'default',
          confidence: 'low',
        });
      });

      logger.debug('Generated organization suggestions', {
        count: suggestions.length,
        suggestions: suggestions.map((s) => ({
          name: s.name,
          confidence: s.confidence,
        })),
      });

      return suggestions;
    } catch (error) {
      logger.error('Failed to generate organization suggestions', error);

      // Fallback to default suggestions
      return DEFAULT_PERSONAL_WORKSPACE_NAMES.map((name) => ({
        name,
        isPersonal: true,
        source: 'default' as const,
        confidence: 'low' as const,
      }));
    }
  }

  /**
   * Get the primary suggestion (highest confidence)
   */
  export function getPrimarySuggestion(
    email: string,
    displayName?: string
  ): OrganizationSuggestion {
    const suggestions = generateSuggestions(email, displayName);

    // Sort by confidence and prefer business suggestions
    const sortedSuggestions = suggestions.sort((a, b) => {
      // Business suggestions first
      if (!a.isPersonal && b.isPersonal) return -1;
      if (a.isPersonal && !b.isPersonal) return 1;

      // Then by confidence
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    });

    return (
      sortedSuggestions[0] ?? {
        name: DEFAULT_PERSONAL_WORKSPACE_NAMES[0] ?? 'My Workspace',
        isPersonal: true,
        source: 'default',
        confidence: 'low',
      }
    );
  }

  /**
   * Extract domain from email address
   */
  function extractDomain(email: string): string | null {
    try {
      const domain = email.split('@')[1]?.toLowerCase();
      return domain ?? null;
    } catch (error) {
      logger.warn('Failed to extract domain from email', { email, error });
      return null;
    }
  }

  /**
   * Check if email domain is a personal email provider
   */
  function isPersonalEmail(domain: string | null): boolean {
    if (!domain) return true;

    // Handle GitHub noreply emails
    if (domain.includes('users.noreply.github.com')) {
      return true;
    }

    return PERSONAL_EMAIL_DOMAINS.has(domain);
  }

  /**
   * Generate company name from business email domain
   */
  function generateCompanyName(domain: string): string | null {
    try {
      const parsed = parse(`https://${domain}`);
      const domainName = parsed.domain;

      if (!domainName) return null;

      // Extract company name from domain (remove TLD)
      const parts = domainName.split('.');
      const companyPart = parts[0];

      if (!companyPart || companyPart.length < 2) return null;

      // Capitalize and format company name
      const companyName = formatCompanyName(companyPart);

      logger.debug('Generated company name from domain', {
        domain,
        domainName,
        companyName,
      });

      return companyName;
    } catch (error) {
      logger.warn('Failed to parse domain for company name', { domain, error });
      return null;
    }
  }

  /**
   * Format company name (capitalize, handle common patterns)
   */
  function formatCompanyName(name: string): string {
    // Handle common company name patterns
    const formatted = name
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .split(' ')
      .map((word) => {
        // Capitalize first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');

    return formatted;
  }

  /**
   * Generate personal workspace name from display name
   */
  function generatePersonalWorkspaceName(displayName: string): string {
    try {
      // Extract first name or use display name
      const firstName = displayName.split(' ')[0];
      const workspaceName = `${firstName ?? 'My'}'s Workspace`;

      logger.debug('Generated personal workspace name', {
        displayName,
        firstName,
        workspaceName,
      });

      return workspaceName;
    } catch (error) {
      logger.warn('Failed to generate personal workspace name', {
        displayName,
        error,
      });
      return DEFAULT_PERSONAL_WORKSPACE_NAMES[0] ?? 'My Workspace';
    }
  }

  /**
   * Validate organization name
   */
  export function validateOrganizationName(name: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Organization name is required');
    } else if (name.trim().length < 3) {
      errors.push('Organization name must be at least 3 characters');
    } else if (name.trim().length > 50) {
      errors.push('Organization name must be less than 50 characters');
    }

    // Check for invalid characters
    const invalidChars = /[<>:"\\|?*]/;
    if (invalidChars.test(name)) {
      errors.push('Organization name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
