/**
 * Unit tests for OrganizationNameGenerator
 * Tests organization name generation from OAuth emails and validation
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { OrganizationNameGenerator } from '../organizationGenerator';

describe('OrganizationNameGenerator', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  describe('generateSuggestions', () => {
    describe('Corporate email domain extraction', () => {
      test('should extract company name from standard corporate domain', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'john@rockethooks.com',
          'John Doe'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeDefined();
        expect(corporateSuggestion?.name).toBe('Rockethooks');
        expect(corporateSuggestion?.source).toBe('email-domain');
        expect(corporateSuggestion?.confidence).toBe('high');
      });

      test('should handle hyphenated company domains', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'jane@my-company.com',
          'Jane Smith'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('My Company');
      });

      test('should handle underscored company domains', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'bob@tech_corp.io',
          'Bob Johnson'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('Tech Corp');
      });

      test('should handle complex corporate domains with subdomains', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'alice@mail.company-name.io',
          'Alice Brown'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('Company Name');
      });

      test('should handle corporate domains with numbers', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'user@startup123.com',
          'Test User'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('Startup123');
      });

      test('should handle single-letter corporate domains', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'user@x.com',
          'Test User'
        );

        // Single letter domains should not generate corporate suggestions
        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });
    });

    describe('Personal email handling', () => {
      test('should handle Gmail as personal email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'john@gmail.com',
          'John Doe'
        );

        // Should not have corporate suggestion
        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();

        // Should have personal suggestions
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle Outlook as personal email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'jane@outlook.com',
          'Jane Smith'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });

      test('should handle Yahoo as personal email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'bob@yahoo.com',
          'Bob Johnson'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });

      test('should handle iCloud as personal email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'alice@icloud.com',
          'Alice Brown'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });

      test('should handle ProtonMail as personal email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'user@protonmail.com',
          'Test User'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });
    });

    describe('GitHub noreply email handling', () => {
      test('should handle GitHub noreply emails as personal', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          '12345+username@users.noreply.github.com',
          'GitHub User'
        );

        // Should not have corporate suggestion
        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();

        // Should have personal suggestions
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle different GitHub noreply email formats', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'username@users.noreply.github.com',
          'GitHub User'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion).toBeUndefined();
      });
    });

    describe('Display name-based personal workspace generation', () => {
      test('should generate personal workspace from first name', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'john@gmail.com',
          'John Doe'
        );

        const displayNameSuggestion = suggestions.find(
          (s) => s.source === 'display-name'
        );
        expect(displayNameSuggestion?.name).toBe("John's Workspace");
        expect(displayNameSuggestion?.isPersonal).toBe(true);
        expect(displayNameSuggestion?.confidence).toBe('medium');
      });

      test('should handle single name display names', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'alice@gmail.com',
          'Alice'
        );

        const displayNameSuggestion = suggestions.find(
          (s) => s.source === 'display-name'
        );
        expect(displayNameSuggestion?.name).toBe("Alice's Workspace");
      });

      test('should handle display names with multiple words', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'mary@gmail.com',
          'Mary Jane Watson'
        );

        const displayNameSuggestion = suggestions.find(
          (s) => s.source === 'display-name'
        );
        expect(displayNameSuggestion?.name).toBe("Mary's Workspace");
      });

      test('should fallback to "My" when display name is empty', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'user@gmail.com',
          ''
        );

        // Should not have display-name source suggestion
        const displayNameSuggestion = suggestions.find(
          (s) => s.source === 'display-name'
        );
        expect(displayNameSuggestion).toBeUndefined();

        // Should have default suggestions
        const defaultSuggestions = suggestions.filter(
          (s) => s.source === 'default'
        );
        expect(defaultSuggestions.length).toBeGreaterThan(0);
      });
    });

    describe('Default personal workspace suggestions', () => {
      test('should always include default personal workspace options', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'test@gmail.com',
          'Test User'
        );

        const defaultSuggestions = suggestions.filter(
          (s) => s.source === 'default' && s.isPersonal
        );

        expect(defaultSuggestions.length).toBeGreaterThan(0);
        expect(defaultSuggestions.some((s) => s.name === 'My Workspace')).toBe(
          true
        );
        expect(defaultSuggestions.some((s) => s.name === 'Personal')).toBe(
          true
        );
        expect(
          defaultSuggestions.some((s) => s.name === 'Private Workspace')
        ).toBe(true);

        defaultSuggestions.forEach((s) => {
          expect(s.confidence).toBe('low');
        });
      });
    });

    describe('Edge cases and error handling', () => {
      test('should handle invalid email formats gracefully', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'invalid-email',
          'Test User'
        );

        // Should fallback to personal suggestions
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle emails without @ symbol', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'notemail',
          'Test User'
        );

        // Should fallback to personal suggestions
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle empty email', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          '',
          'Test User'
        );

        // Should fallback to personal suggestions
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle email with multiple @ symbols', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'test@@example.com',
          'Test User'
        );

        // Should handle gracefully and provide suggestions
        expect(suggestions.length).toBeGreaterThan(0);
      });

      test('should handle undefined display name', () => {
        const suggestions =
          OrganizationNameGenerator.generateSuggestions('test@example.com');

        expect(suggestions.length).toBeGreaterThan(0);
        // Should not have display-name based suggestion
        const displayNameSuggestion = suggestions.find(
          (s) => s.source === 'display-name'
        );
        expect(displayNameSuggestion).toBeUndefined();
      });

      test('should handle special characters in email domain', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'test@comp-any.co.uk',
          'Test User'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('Comp Any');
      });
    });

    describe('Mixed scenarios', () => {
      test('should prioritize corporate suggestions over personal for business emails', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'john@acmecorp.com',
          'John Doe'
        );

        expect(suggestions.length).toBeGreaterThan(0);

        // Should have both corporate and personal suggestions
        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        const personalSuggestions = suggestions.filter((s) => s.isPersonal);

        expect(corporateSuggestion).toBeDefined();
        expect(corporateSuggestion?.name).toBe('Acmecorp');
        expect(personalSuggestions.length).toBeGreaterThan(0);
      });

      test('should handle case-insensitive domains', () => {
        const suggestions = OrganizationNameGenerator.generateSuggestions(
          'user@COMPANY.COM',
          'Test User'
        );

        const corporateSuggestion = suggestions.find((s) => !s.isPersonal);
        expect(corporateSuggestion?.name).toBe('Company');
      });
    });
  });

  describe('getPrimarySuggestion', () => {
    test('should prioritize business suggestions over personal', () => {
      const primary = OrganizationNameGenerator.getPrimarySuggestion(
        'john@acmecorp.com',
        'John Doe'
      );

      expect(primary.isPersonal).toBe(false);
      expect(primary.name).toBe('Acmecorp');
      expect(primary.confidence).toBe('high');
    });

    test('should return personal suggestion for personal emails', () => {
      const primary = OrganizationNameGenerator.getPrimarySuggestion(
        'john@gmail.com',
        'John Doe'
      );

      expect(primary.isPersonal).toBe(true);
      expect(primary.name).toBe("John's Workspace");
      expect(primary.source).toBe('display-name');
    });

    test('should return default suggestion when no display name for personal email', () => {
      const primary =
        OrganizationNameGenerator.getPrimarySuggestion('john@gmail.com');

      expect(primary.isPersonal).toBe(true);
      expect(primary.source).toBe('default');
      expect(['My Workspace', 'Personal', 'Private Workspace']).toContain(
        primary.name
      );
    });

    test('should handle edge cases and always return a suggestion', () => {
      const primary = OrganizationNameGenerator.getPrimarySuggestion(
        'invalid-email',
        ''
      );

      expect(primary).toBeDefined();
      expect(primary.name).toBeDefined();
      expect(primary.name.length).toBeGreaterThan(0);
    });
  });

  describe('validateOrganizationName', () => {
    describe('Valid organization names', () => {
      test('should accept valid organization names', () => {
        const validNames = [
          'Acme Corp',
          'My Company',
          'Tech-Startup',
          'Company_Name',
          'Organization 123',
          'A Valid Name',
          'Testing Organization',
        ];

        validNames.forEach((name) => {
          const result =
            OrganizationNameGenerator.validateOrganizationName(name);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      test('should accept names with exactly 3 characters', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('Abc');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should accept names with exactly 50 characters', () => {
        const fiftyCharName = 'A'.repeat(50);
        const result =
          OrganizationNameGenerator.validateOrganizationName(fiftyCharName);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('Names that are too short', () => {
      test('should reject empty names', () => {
        const result = OrganizationNameGenerator.validateOrganizationName('');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Organization name is required');
      });

      test('should reject whitespace-only names', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('   ');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Organization name is required');
      });

      test('should reject names with less than 3 characters', () => {
        const shortNames = ['A', 'AB', 'X'];

        shortNames.forEach((name) => {
          const result =
            OrganizationNameGenerator.validateOrganizationName(name);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(
            'Organization name must be at least 3 characters'
          );
        });
      });

      test('should reject names with less than 3 characters after trimming', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('  A  ');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Organization name must be at least 3 characters'
        );
      });
    });

    describe('Names with invalid characters', () => {
      test('should reject names with invalid characters', () => {
        const invalidChars = ['<', '>', ':', '"', '\\', '|', '?', '*'];

        invalidChars.forEach((char) => {
          const name = `Test${char}Name`;
          const result =
            OrganizationNameGenerator.validateOrganizationName(name);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(
            'Organization name contains invalid characters'
          );
        });
      });

      test('should reject names with multiple invalid characters', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('Test<>:"Name');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Organization name contains invalid characters'
        );
      });
    });

    describe('Names that are too long', () => {
      test('should reject names longer than 50 characters', () => {
        const longName = 'A'.repeat(51);
        const result =
          OrganizationNameGenerator.validateOrganizationName(longName);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Organization name must be less than 50 characters'
        );
      });

      test('should reject very long names', () => {
        const veryLongName =
          'This is a very long organization name that exceeds the maximum allowed length limit';
        const result =
          OrganizationNameGenerator.validateOrganizationName(veryLongName);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Organization name must be less than 50 characters'
        );
      });
    });

    describe('Multiple validation errors', () => {
      test('should return multiple errors for names with multiple issues', () => {
        // Too short AND contains invalid characters
        const result = OrganizationNameGenerator.validateOrganizationName('A<');
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(2);
        expect(result.errors).toContain(
          'Organization name must be at least 3 characters'
        );
        expect(result.errors).toContain(
          'Organization name contains invalid characters'
        );
      });

      test('should handle null input', () => {
        const result = OrganizationNameGenerator.validateOrganizationName(
          null as unknown as string
        );
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Organization name is required');
      });

      test('should handle undefined input', () => {
        const result = OrganizationNameGenerator.validateOrganizationName(
          undefined as unknown as string
        );
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Organization name is required');
      });
    });

    describe('Edge cases', () => {
      test('should handle names with leading/trailing whitespace', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('  Valid Name  ');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should handle names with internal whitespace', () => {
        const result = OrganizationNameGenerator.validateOrganizationName(
          'My   Company   Name'
        );
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should handle names with numbers', () => {
        const result =
          OrganizationNameGenerator.validateOrganizationName('Company123');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should handle names with allowed special characters', () => {
        const validSpecialChars = [
          '-',
          '_',
          '.',
          ',',
          '(',
          ')',
          ' ',
          '&',
          '+',
          "'",
        ];

        validSpecialChars.forEach((char) => {
          const name = `Test${char}Name`;
          const result =
            OrganizationNameGenerator.validateOrganizationName(name);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });
    });
  });
});
