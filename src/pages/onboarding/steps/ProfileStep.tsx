import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Plus, Target, User, UserCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  experienceLevels,
  getExperienceLevelLabel,
  getProfileRoleLabel,
  type ProfileFormData,
  profileRoles,
  profileSchema,
} from '@/lib/validations/onboarding';
import type { ProfileDraft } from '@/utils/onboardingDrafts';

export interface ProfileStepProps {
  onComplete?: () => void;
  onNext?: () => void;
}

// Common use cases for API monitoring and webhook management
const commonUseCases = [
  'API Monitoring',
  'Webhook Management',
  'Event Processing',
  'Data Integration',
  'Real-time Notifications',
  'System Integration',
  'Microservices Communication',
  'Third-party Integrations',
  'DevOps Automation',
  'Business Intelligence',
] as const;

export function ProfileStep({ onComplete, onNext }: ProfileStepProps) {
  // Use the new onboarding hook instead of directly accessing stores
  const {
    draftData,
    saveDraftData,
    completeStep,
    skipStep,
    goBack,
    canProceed,
    hasErrors,
    latestError,
    clearErrors,
    progress,
  } = useOnboarding();

  // State for managing use cases
  const [customUseCase, setCustomUseCase] = useState('');
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  // Initialize form with existing draft data
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      firstName: '',
      lastName: '',
      role: 'developer', // Default to developer instead of undefined
      experience: undefined,
      useCases: [],
      avatar: '',
    },
  });

  const {
    watch,
    setValue,
    formState: { isValid },
  } = form;
  const formData = watch();

  // Load existing draft data on mount
  useEffect(() => {
    const existingDraft = draftData as ProfileDraft | null;

    if (existingDraft) {
      // Populate form with existing draft data
      if (existingDraft.firstName)
        setValue('firstName', existingDraft.firstName);
      if (existingDraft.lastName) setValue('lastName', existingDraft.lastName);
      if (existingDraft.role) setValue('role', existingDraft.role);
      if (existingDraft.experience)
        setValue('experience', existingDraft.experience);
      if (existingDraft.useCases) {
        setValue('useCases', existingDraft.useCases);
        setSelectedUseCases(existingDraft.useCases);
      }
      if (existingDraft.avatar) setValue('avatar', existingDraft.avatar);
    }
  }, [setValue, draftData]);

  // Auto-save form changes with debouncing
  useEffect(() => {
    if (
      Object.keys(formData).some(
        (key) => formData[key as keyof typeof formData]
      )
    ) {
      const draftData = {
        ...formData,
        useCases: selectedUseCases,
      } as ProfileDraft;
      saveDraftData(draftData);
    }
  }, [formData, selectedUseCases, saveDraftData]);

  // Handle adding a use case
  const handleAddUseCase = (useCase: string) => {
    if (
      useCase.trim() &&
      !selectedUseCases.includes(useCase) &&
      selectedUseCases.length < 5
    ) {
      const newUseCases = [...selectedUseCases, useCase.trim()];
      setSelectedUseCases(newUseCases);
      setValue('useCases', newUseCases);
      setCustomUseCase('');
    }
  };

  // Handle removing a use case
  const handleRemoveUseCase = (useCase: string) => {
    const newUseCases = selectedUseCases.filter((uc) => uc !== useCase);
    setSelectedUseCases(newUseCases);
    setValue('useCases', newUseCases);
  };

  // Handle form submission
  const handleSubmit = (data: ProfileFormData) => {
    try {
      // Clear any previous errors
      clearErrors();

      // Include selected use cases in the submitted data
      const submissionData = {
        ...data,
        useCases: selectedUseCases,
      } as ProfileDraft;

      // Complete the step using the state machine
      const success = completeStep(submissionData);

      if (success) {
        // Call completion callbacks for backward compatibility
        onComplete?.();
        if (onNext) {
          onNext();
        }
      } else {
        // Error handling is managed by the state machine
        console.error('Failed to complete profile step');
      }
    } catch (error) {
      console.error('Failed to complete profile step:', error);
    }
  };

  // Handle skip action
  const handleSkip = () => {
    skipStep();

    // Call completion callbacks for backward compatibility
    onComplete?.();
    if (onNext) {
      onNext();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    goBack();
  };

  // Check if form is valid and we can proceed
  const canSubmit = isValid && canProceed;

  // Generate avatar initials
  const getAvatarInitials = () => {
    const firstName = form.getValues('firstName') || '';
    const lastName = form.getValues('lastName') || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Tell us about yourself
          </CardTitle>
          <CardDescription>
            Help us personalize your experience by sharing some information
            about your role and interests.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Avatar Preview */}
              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={form.watch('avatar')}
                    alt="Profile avatar"
                  />
                  <AvatarFallback className="text-lg">
                    {getAvatarInitials() || <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name Fields - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name - Required */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        First Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                          aria-describedby="firstName-description"
                        />
                      </FormControl>
                      <FormDescription id="firstName-description">
                        Your given name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name - Required */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          {...field}
                          aria-describedby="lastName-description"
                        />
                      </FormControl>
                      <FormDescription id="lastName-description">
                        Your family name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role - Required */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Role *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-describedby="role-description">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profileRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {getProfileRoleLabel(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription id="role-description">
                      Your primary role or responsibility
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience Level - Optional */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Experience Level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger aria-describedby="experience-description">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {getExperienceLevelLabel(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription id="experience-description">
                      Your experience level with APIs and webhooks (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Use Cases - Optional */}
              <FormField
                control={form.control}
                name="useCases"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Use Cases
                    </FormLabel>
                    <FormDescription>
                      Select up to 5 use cases that describe how you plan to use
                      RocketHooks (optional)
                    </FormDescription>

                    {/* Selected Use Cases */}
                    {selectedUseCases.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/20">
                        {selectedUseCases.map((useCase) => (
                          <Badge
                            key={useCase}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {useCase}
                            <button
                              type="button"
                              onClick={() => {
                                handleRemoveUseCase(useCase);
                              }}
                              className="ml-1 h-3 w-3 rounded-full hover:bg-muted-foreground/20"
                              aria-label={`Remove ${useCase}`}
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Common Use Cases */}
                    {selectedUseCases.length < 5 && (
                      <div className="space-y-3">
                        <div className="text-sm font-medium">
                          Common use cases:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {commonUseCases
                            .filter(
                              (useCase) => !selectedUseCases.includes(useCase)
                            )
                            .map((useCase) => (
                              <Button
                                key={useCase}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleAddUseCase(useCase);
                                }}
                                className="h-8 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {useCase}
                              </Button>
                            ))}
                        </div>

                        {/* Custom Use Case Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a custom use case..."
                            value={customUseCase}
                            onChange={(e) => {
                              setCustomUseCase(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddUseCase(customUseCase);
                              }
                            }}
                            className="flex-1"
                            aria-label="Custom use case"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleAddUseCase(customUseCase);
                            }}
                            disabled={
                              !customUseCase.trim() ||
                              selectedUseCases.length >= 5
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedUseCases.length >= 5 && (
                      <div className="text-sm text-muted-foreground">
                        Maximum of 5 use cases reached
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avatar URL - Optional */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                        aria-describedby="avatar-description"
                      />
                    </FormControl>
                    <FormDescription id="avatar-description">
                      URL to your profile picture (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Save Status and Error Handling */}
              <div className="space-y-2">
                {(hasErrors || latestError) && (
                  <Alert variant="destructive">
                    <div className="flex items-center justify-between">
                      <span>{latestError ?? 'An error occurred'}</span>
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
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {canSubmit ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Ready to continue
                    </span>
                  ) : (
                    <span>
                      First name, last name, and role are required to continue
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!progress.isFirstStep && (
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
        Step {progress.current} of {progress.total} ({progress.percentage}%
        complete)
      </div>
    </div>
  );
}
