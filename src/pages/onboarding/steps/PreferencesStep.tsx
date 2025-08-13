import { zodResolver } from '@hookform/resolvers/zod'
import {
  Bell,
  CheckCircle,
  Clock,
  Globe2,
  Palette,
  Settings,
} from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { useOnboarding } from '@/hooks/useOnboarding'
import {
  type PreferencesFormData,
  preferencesSchema,
} from '@/lib/validations/onboarding'
import type { PreferencesDraft } from '@/utils/onboardingDrafts'

export interface PreferencesStepProps {
  onComplete?: () => void
  onNext?: () => void
}

// Common timezones organized by region
const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { value: 'Asia/Shanghai', label: 'China Standard Time' },
  { value: 'Asia/Kolkata', label: 'India Standard Time' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time' },
] as const

// Common languages
const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'it', label: 'Italiano (Italian)' },
  { value: 'pt', label: 'Português (Portuguese)' },
  { value: 'ru', label: 'Русский (Russian)' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'zh', label: '中文 (Chinese)' },
] as const

// Theme options
const themes = [
  { value: 'light', label: 'Light', description: 'Light mode interface' },
  { value: 'dark', label: 'Dark', description: 'Dark mode interface' },
  { value: 'system', label: 'System', description: 'Follow system preference' },
] as const

// Alert frequency options
const alertFrequencies = [
  {
    value: 'instant',
    label: 'Instant',
    description: 'Receive alerts immediately',
  },
  { value: 'hourly', label: 'Hourly', description: 'Digest every hour' },
  { value: 'daily', label: 'Daily', description: 'Daily summary' },
  { value: 'weekly', label: 'Weekly', description: 'Weekly digest' },
] as const

export function PreferencesStep({ onComplete, onNext }: PreferencesStepProps) {
  // Use the new onboarding hook instead of directly accessing stores
  const {
    draft,
    saveDraft,
    autoSave,
    completeStep,
    skipStep,
    goBack,
    canProceed,
    isFirstStep,
    hasErrors,
    latestError,
    clearErrors,
    progress,
  } = useOnboarding()

  // Initialize form with existing draft data
  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      notifications: {
        email: true, // Default to email notifications on
        sms: false,
        push: true,
      },
      timezone: undefined,
      language: 'en', // Default to English
      theme: 'system', // Default to system theme
      alertFrequency: 'instant', // Default to instant alerts
    },
  })

  const { watch, setValue } = form
  const formData = watch()

  // Load existing draft data on mount
  useEffect(() => {
    const existingDraft = draft as PreferencesDraft | null

    if (existingDraft) {
      // Populate form with existing draft data
      if (existingDraft.notifications) {
        if (existingDraft.notifications.email !== undefined) {
          setValue('notifications.email', existingDraft.notifications.email)
        }
        if (existingDraft.notifications.sms !== undefined) {
          setValue('notifications.sms', existingDraft.notifications.sms)
        }
        if (existingDraft.notifications.push !== undefined) {
          setValue('notifications.push', existingDraft.notifications.push)
        }
      }
      if (existingDraft.timezone) setValue('timezone', existingDraft.timezone)
      if (existingDraft.language) setValue('language', existingDraft.language)
      if (existingDraft.theme) setValue('theme', existingDraft.theme)
      if (existingDraft.alertFrequency)
        setValue('alertFrequency', existingDraft.alertFrequency)
    }
  }, [setValue, draft])

  // Auto-save form changes with debouncing
  useEffect(() => {
    if (
      Object.keys(formData).some(
        (key) => formData[key as keyof typeof formData]
      )
    ) {
      saveDraft(formData as PreferencesDraft)
    }
  }, [formData, saveDraft])

  // Handle form submission
  const handleSubmit = (data: PreferencesFormData) => {
    try {
      // Clear any previous errors
      clearErrors()

      // Complete the step using the state machine
      const success = completeStep(data as PreferencesDraft)

      if (success) {
        // Call completion callbacks for backward compatibility
        onComplete?.()
        if (onNext) {
          onNext()
        }
      } else {
        // Error handling is managed by the state machine
        console.error('Failed to complete preferences step')
      }
    } catch (error) {
      console.error('Failed to complete preferences step:', error)
    }
  }

  // Handle skip action
  const handleSkip = () => {
    skipStep()

    // Call completion callbacks for backward compatibility
    onComplete?.()
    if (onNext) {
      onNext()
    }
  }

  // Handle back navigation
  const handleBack = () => {
    goBack()
  }

  // Since all fields are optional, we can always proceed
  const canSubmit = canProceed

  // Get current browser timezone as suggestion
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Set your preferences
          </CardTitle>
          <CardDescription>
            Customize your experience with notification settings, language, and
            theme preferences. All settings are optional and can be changed
            later.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              {/* Notification Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Notification Preferences
                  </h3>
                </div>

                <div className="space-y-4 pl-7">
                  {/* Email Notifications */}
                  <FormField
                    control={form.control}
                    name="notifications.email"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive important updates and alerts via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* SMS Notifications */}
                  <FormField
                    control={form.control}
                    name="notifications.sms"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            SMS Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive critical alerts via SMS (may incur charges)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Push Notifications */}
                  <FormField
                    control={form.control}
                    name="notifications.push"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Push Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications in your browser
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Regional Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Regional Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  {/* Timezone */}
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Timezone
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Browser timezone suggestion */}
                            {browserTimezone && (
                              <>
                                <SelectItem
                                  value={browserTimezone}
                                  className="font-medium"
                                >
                                  {browserTimezone} (Detected)
                                </SelectItem>
                                <div className="h-px bg-border my-1" />
                              </>
                            )}
                            {timezones.map((timezone) => (
                              <SelectItem
                                key={timezone.value}
                                value={timezone.value}
                              >
                                {timezone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Used for displaying times and scheduling notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Language */}
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4" />
                          Language
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem
                                key={language.value}
                                value={language.value}
                              >
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Interface language for the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Appearance & Behavior */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Appearance & Behavior</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  {/* Theme */}
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Theme
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                <div className="flex flex-col">
                                  <span>{theme.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {theme.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred interface theme
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Alert Frequency */}
                  <FormField
                    control={form.control}
                    name="alertFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Alert Frequency
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {alertFrequencies.map((frequency) => (
                              <SelectItem
                                key={frequency.value}
                                value={frequency.value}
                              >
                                <div className="flex flex-col">
                                  <span>{frequency.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {frequency.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How often you want to receive non-critical alerts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Save Status and Error Handling */}
              <div className="space-y-2">
                {(hasErrors || latestError) && (
                  <Alert variant="destructive">
                    <div className="flex items-center justify-between">
                      <span>{latestError?.error ?? 'An error occurred'}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearErrors}
                        aria-label="Dismiss error"
                      >
                        ×
                      </Button>
                    </div>
                  </Alert>
                )}

                {autoSave.isSaving && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                    Saving preferences...
                  </div>
                )}

                {autoSave.lastSaved &&
                  !autoSave.isSaving &&
                  !autoSave.error && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Preferences saved at{' '}
                      {autoSave.lastSaved.toLocaleTimeString()}
                    </div>
                  )}

                {autoSave.error && (
                  <Alert variant="destructive">
                    <div className="flex items-center justify-between">
                      <span>Failed to save preferences: {autoSave.error}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={autoSave.clearError}
                        aria-label="Dismiss error"
                      >
                        ×
                      </Button>
                    </div>
                  </Alert>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    All preferences are optional
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!isFirstStep && (
                    <Button type="button" variant="ghost" onClick={handleBack}>
                      Back
                    </Button>
                  )}

                  <Button type="button" variant="outline" onClick={handleSkip}>
                    Skip for now
                  </Button>

                  <Button
                    type="submit"
                    disabled={!canSubmit}
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

      {/* Progress Indicator */}
      <div className="text-center text-sm text-muted-foreground">
        Step {progress.currentStep} of {progress.totalSteps} (
        {progress.percentage}% complete)
      </div>
    </div>
  )
}
