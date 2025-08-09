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
