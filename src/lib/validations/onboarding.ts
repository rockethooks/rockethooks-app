import { z } from 'zod'

// Organization size options that match the OrganizationDraft interface
export const organizationSizes = [
  'startup',
  'small',
  'medium',
  'large',
  'enterprise',
] as const

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),
  size: z.enum(organizationSizes).optional(),
  industry: z
    .string()
    .max(50, 'Industry must be less than 50 characters')
    .optional(),
  website: z
    .string()
    .refine((url) => {
      if (!url || url.length === 0) return true // Allow empty/optional

      try {
        // Allow URLs with or without protocol
        const urlToTest = url.startsWith('http') ? url : `https://${url}`
        const parsed = new URL(urlToTest)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    }, 'Please enter a valid website URL')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

export type OrganizationFormData = z.infer<typeof organizationSchema>

// ========================================================================================
// Profile Validation Schema
// ========================================================================================

export const profileRoles = ['developer', 'manager', 'admin', 'other'] as const

export const experienceLevels = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  role: z.enum(profileRoles),
  experience: z.enum(experienceLevels).optional(),
  useCases: z
    .array(z.string())
    .max(5, 'Please select at most 5 use cases')
    .optional(),
  avatar: z.url().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// ========================================================================================
// Enhanced Preferences Validation Schema
// ========================================================================================

export const preferencesSchema = z.object({
  notifications: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .optional(),
  timezone: z.string().optional(),
  language: z
    .string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code must be less than 5 characters')
    .optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  alertFrequency: z.enum(['instant', 'hourly', 'daily', 'weekly']).optional(),
})

export type PreferencesFormData = z.infer<typeof preferencesSchema>

// ========================================================================================
// Validation Helper Functions
// ========================================================================================

/**
 * Validate onboarding step completion based on draft data
 */
export function validateStepCompletion(
  step: string,
  data: unknown
): {
  isValid: boolean
  completionPercentage: number
  errors: string[]
  missingFields: string[]
} {
  try {
    let schema: z.ZodType
    let requiredFields: string[] = []

    switch (step) {
      case 'organization':
        schema = organizationSchema
        requiredFields = ['name', 'size']
        break
      case 'profile':
        schema = profileSchema
        requiredFields = ['firstName', 'lastName', 'role']
        break
      case 'preferences':
        schema = preferencesSchema
        requiredFields = [] // All optional
        break
      default:
        return {
          isValid: false,
          completionPercentage: 0,
          errors: [`Unknown step: ${step}`],
          missingFields: [],
        }
    }

    const result = schema.safeParse(data)
    const errors: string[] = []
    const missingFields: string[] = []

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(issue.message)
        if (
          issue.code === 'invalid_type' &&
          'received' in issue &&
          issue.received === 'undefined'
        ) {
          missingFields.push(issue.path.join('.'))
        }
      })
    }

    // Calculate completion percentage
    let completionPercentage = 0
    if (data && typeof data === 'object') {
      const dataObj = data as Record<string, unknown>
      const totalFields = Math.max(
        requiredFields.length,
        Object.keys(dataObj).length
      )
      const filledFields = Object.entries(dataObj).filter(([, value]) => {
        return value !== undefined && value !== null && value !== ''
      }).length

      completionPercentage =
        totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
    }

    return {
      isValid: result.success,
      completionPercentage,
      errors,
      missingFields,
    }
  } catch (error) {
    return {
      isValid: false,
      completionPercentage: 0,
      errors: [error instanceof Error ? error.message : 'Validation error'],
      missingFields: [],
    }
  }
}

/**
 * Check if step can be skipped based on current state and rules
 */
export function canSkipStep(
  step: string,
  context: {
    completedSteps: Set<string>
    skippedSteps: Set<string>
    config: { skipPreferences: boolean; requireProfile: boolean }
  }
): boolean {
  switch (step) {
    case 'organization':
      // Organization step cannot be skipped if user doesn't have one
      return false
    case 'profile':
      // Profile can only be skipped if not required by config
      return !context.config.requireProfile
    case 'preferences':
      // Preferences can be skipped based on config or user choice
      return true
    default:
      return false
  }
}

/**
 * Get minimum completion percentage required for step transition
 */
export function getMinimumCompletionPercentage(step: string): number {
  const minimums = {
    organization: 80, // Name and size required
    profile: 60, // Basic info required
    preferences: 0, // All optional
  }

  return (minimums as Record<string, number>)[step] ?? 50
}

// Helper function to get organization size display name
export function getOrganizationSizeLabel(
  size: (typeof organizationSizes)[number]
): string {
  const sizeLabels = {
    startup: 'Startup (1-10 employees)',
    small: 'Small (11-50 employees)',
    medium: 'Medium (51-200 employees)',
    large: 'Large (201-1000 employees)',
    enterprise: 'Enterprise (1000+ employees)',
  }

  return sizeLabels[size]
}

/**
 * Get profile role display name
 */
export function getProfileRoleLabel(
  role: (typeof profileRoles)[number]
): string {
  const roleLabels = {
    developer: 'Developer',
    manager: 'Manager',
    admin: 'Administrator',
    other: 'Other',
  }

  return roleLabels[role]
}

/**
 * Get experience level display name
 */
export function getExperienceLevelLabel(
  level: (typeof experienceLevels)[number]
): string {
  const levelLabels = {
    beginner: 'Beginner (0-1 years)',
    intermediate: 'Intermediate (1-3 years)',
    advanced: 'Advanced (3-5 years)',
    expert: 'Expert (5+ years)',
  }

  return levelLabels[level]
}
