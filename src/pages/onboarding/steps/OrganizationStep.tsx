import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, FileText, Globe, Users } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store/auth.store'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  getOrganizationSizeLabel,
  type OrganizationFormData,
  organizationSchema,
  organizationSizes,
} from '@/lib/validations/onboarding'
import {
  getDraft,
  type OrganizationDraft,
  useAutoSaveDraft,
} from '@/utils/onboardingDrafts'

export interface OrganizationStepProps {
  onComplete?: () => void
  onNext?: () => void
}

export function OrganizationStep({
  onComplete,
  onNext,
}: OrganizationStepProps) {
  const navigate = useNavigate()
  const { completeOnboardingStep, updateProfile, onboarding } = useAuthStore()

  // Initialize form with existing draft data
  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      name: '',
      size: undefined,
      industry: '',
      website: '',
      description: '',
    },
  })

  const {
    watch,
    setValue,
    formState: { isValid },
  } = form
  const formData = watch()

  // Load existing draft data on mount
  useEffect(() => {
    const existingDraft = getDraft('organization') as OrganizationDraft | null

    if (existingDraft) {
      // Populate form with existing draft data
      if (existingDraft.name) setValue('name', existingDraft.name)
      if (existingDraft.size) setValue('size', existingDraft.size)
      if (existingDraft.industry) setValue('industry', existingDraft.industry)
      if (existingDraft.website) setValue('website', existingDraft.website)
      if (existingDraft.description)
        setValue('description', existingDraft.description)
    }
  }, [setValue])

  // Auto-save form changes with debouncing
  const {
    isSaving,
    lastSaved,
    error: saveError,
    clearError: clearSaveError,
  } = useAutoSaveDraft('organization', formData, {
    enabled: true,
    debounceDelay: 500,
  })

  // Handle form submission
  const handleSubmit = (data: OrganizationFormData) => {
    try {
      // Clear any previous save errors
      clearSaveError()

      // Mark the onboarding step as complete
      completeOnboardingStep('organization')

      // Update the user's profile with organization information
      updateProfile({
        company: data.name,
        // Add any other profile fields as needed
      })

      // Call completion callbacks
      onComplete?.()

      // Navigate to the next step or call the next callback
      if (onNext) {
        onNext()
      } else {
        // Default navigation - you may want to adjust this based on your routing structure
        void navigate('/onboarding/preferences')
      }
    } catch (error) {
      console.error('Failed to complete organization step:', error)
    }
  }

  // Check if form is valid using schema validation
  const canProceed = isValid

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Tell us about your organization
          </CardTitle>
          <CardDescription>
            This information helps us customize your experience and provide
            relevant features.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Organization Name - Required */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Organization Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your organization name"
                        {...field}
                        aria-describedby="name-description"
                      />
                    </FormControl>
                    <FormDescription id="name-description">
                      The name of your company, team, or organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Organization Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Organization Size
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger aria-describedby="size-description">
                          <SelectValue placeholder="Select organization size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizationSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {getOrganizationSizeLabel(size)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription id="size-description">
                      Help us understand the scale of your organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Technology, Healthcare, Finance"
                        {...field}
                        aria-describedby="industry-description"
                      />
                    </FormControl>
                    <FormDescription id="industry-description">
                      Your organization&apos;s primary industry or sector
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                        aria-describedby="website-description"
                      />
                    </FormControl>
                    <FormDescription id="website-description">
                      Your organization&apos;s website (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your organization, what you do, or your goals..."
                        {...field}
                        aria-describedby="description-description"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription id="description-description">
                      A brief description of your organization (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Save Status and Error Handling */}
              <div className="space-y-2">
                {saveError && (
                  <Alert variant="destructive">
                    <div className="flex items-center justify-between">
                      <span>Failed to save progress: {saveError}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSaveError}
                        aria-label="Dismiss error"
                      >
                        ×
                      </Button>
                    </div>
                  </Alert>
                )}

                {isSaving && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                    Saving progress...
                  </div>
                )}

                {lastSaved && !isSaving && !saveError && (
                  <div className="text-sm text-muted-foreground">
                    Progress saved at {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {canProceed ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Ready to continue
                    </span>
                  ) : (
                    <span>Organization name is required to continue</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Skip for now
                  </Button>

                  <Button
                    type="submit"
                    disabled={!canProceed}
                    className="min-w-[120px]"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Current Progress Indicator */}
      {onboarding && (
        <div className="text-center text-sm text-muted-foreground">
          Step {(onboarding.currentStep || 0) + 1} of{' '}
          {onboarding.totalSteps || 6}
        </div>
      )}
    </div>
  )
}
