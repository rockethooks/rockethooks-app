import {
  ArrowRight,
  Building,
  CheckCircle,
  Settings,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  getExperienceLevelLabel,
  getProfileRoleLabel,
} from '@/lib/validations/onboarding';
import {
  clearDrafts,
  getAllDrafts,
  type OrganizationDraft,
  type PreferencesDraft,
  type ProfileDraft,
} from '@/utils/onboardingDrafts';

export interface CompletionStepProps {
  onComplete?: () => void;
  onNext?: () => void;
}

export function CompletionStep({ onComplete, onNext }: CompletionStepProps) {
  const navigate = useNavigate();
  const { completeStep, hasErrors, latestError, clearErrors, progress } =
    useOnboarding();

  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all collected onboarding data for summary
  const allDrafts = getAllDrafts();
  const organizationData = allDrafts.organization as
    | OrganizationDraft
    | undefined;
  const profileData = allDrafts.profile as ProfileDraft | undefined;
  const preferencesData = allDrafts.preferences as PreferencesDraft | undefined;

  // Get user name for personalization
  const userName = profileData?.firstName ?? 'there';

  // Generate avatar initials
  const getAvatarInitials = () => {
    const firstName = profileData?.firstName ?? '';
    const lastName = profileData?.lastName ?? '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Handle onboarding completion
  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      setError(null);
      clearErrors();

      // Complete the final step using the state machine
      const success = completeStep();

      if (success) {
        // Clear all onboarding drafts from localStorage
        const draftsClearSuccess = clearDrafts();
        if (!draftsClearSuccess) {
          console.warn('Failed to clear onboarding drafts from localStorage');
        }

        // Call completion callbacks for backward compatibility
        onComplete?.();

        // Small delay for UX (let user see the completion state)
        await new Promise<void>((resolve) => setTimeout(resolve, 500));

        // Navigate to dashboard or call next callback
        if (onNext) {
          onNext();
        } else {
          void navigate('/dashboard');
        }
      } else {
        setError('Failed to complete onboarding');
      }
    } catch (completionError) {
      console.error('Failed to complete onboarding:', completionError);
      const errorMessage =
        completionError instanceof Error
          ? completionError.message
          : 'Failed to complete setup';
      setError(errorMessage);
    } finally {
      setIsCompleting(false);
    }
  };

  // Summary sections for collected data
  const summaryItems = [];

  // Organization summary
  if (organizationData?.name) {
    summaryItems.push({
      icon: Building,
      title: 'Organization',
      content: (
        <div className="space-y-2">
          <div className="font-medium">{organizationData.name}</div>
          {organizationData.size && (
            <Badge variant="secondary">
              {organizationData.size.charAt(0).toUpperCase() +
                organizationData.size.slice(1)}{' '}
              company
            </Badge>
          )}
          {organizationData.industry && (
            <div className="text-sm text-muted-foreground">
              {organizationData.industry}
            </div>
          )}
        </div>
      ),
    });
  }

  // Profile summary
  if (profileData?.firstName) {
    summaryItems.push({
      icon: User,
      title: 'Profile',
      content: (
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileData.avatar} alt="Profile avatar" />
            <AvatarFallback>
              {getAvatarInitials() || <User className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">
              {profileData.firstName} {profileData.lastName}
            </div>
            {profileData.role && (
              <div className="text-sm text-muted-foreground">
                {getProfileRoleLabel(profileData.role)}
              </div>
            )}
            {profileData.experience && (
              <Badge variant="outline" className="text-xs">
                {getExperienceLevelLabel(profileData.experience)}
              </Badge>
            )}
            {profileData.useCases && profileData.useCases.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profileData.useCases.slice(0, 3).map((useCase) => (
                  <Badge key={useCase} variant="secondary" className="text-xs">
                    {useCase}
                  </Badge>
                ))}
                {profileData.useCases.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profileData.useCases.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    });
  }

  // Preferences summary
  if (preferencesData) {
    const hasNotifications = preferencesData.notifications;
    const notificationTypes = [];
    if (hasNotifications?.email) notificationTypes.push('Email');
    if (hasNotifications?.sms) notificationTypes.push('SMS');
    if (hasNotifications?.push) notificationTypes.push('Push');

    summaryItems.push({
      icon: Settings,
      title: 'Preferences',
      content: (
        <div className="space-y-2">
          {notificationTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {notificationTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type} notifications
                </Badge>
              ))}
            </div>
          )}
          {preferencesData.theme && (
            <div className="text-sm text-muted-foreground">
              Theme:{' '}
              {preferencesData.theme.charAt(0).toUpperCase() +
                preferencesData.theme.slice(1)}
            </div>
          )}
          {preferencesData.language && (
            <div className="text-sm text-muted-foreground">
              Language: {preferencesData.language.toUpperCase()}
            </div>
          )}
        </div>
      ),
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Main Success Card */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            {/* Trophy Icon with sparkle effect */}
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              <Sparkles
                className="h-4 w-4 text-blue-400 absolute -bottom-1 -left-1 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Congratulations, {userName}!
          </CardTitle>

          <CardDescription className="text-lg text-gray-700">
            You&apos;ve successfully completed your RocketHooks setup. Your
            workspace is ready to help you monitor APIs and manage webhooks with
            confidence.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Setup Summary */}
          {summaryItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Your Setup Summary
              </h3>

              <div className="grid gap-4">
                {summaryItems.map((item) => (
                  <Card
                    key={item.title}
                    className="bg-white border border-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <item.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          {item.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* What's Next Section */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              What&apos;s next?
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Set up your first API monitoring target
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Configure webhook endpoints for real-time notifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Explore the dashboard to familiarize yourself with the tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Invite team members to collaborate (if applicable)
              </li>
            </ul>
          </div>

          {/* Error Display */}
          {((hasErrors || latestError) ?? error) && (
            <Alert variant="destructive">
              <div className="flex items-center justify-between">
                <span>
                  {error ??
                    latestError ??
                    'An error occurred during completion'}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    clearErrors();
                  }}
                  aria-label="Dismiss error"
                >
                  ×
                </Button>
              </div>
            </Alert>
          )}

          {/* Completion Button */}
          <div className="pt-4">
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
              size="lg"
            >
              {isCompleting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border border-current border-t-transparent rounded-full" />
                  Completing Setup...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Setup & Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">
          Step {progress.current} of {progress.total} - Setup Complete!
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>
        <div className="text-xs text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
          <Trophy className="h-3 w-3" />
          100% Complete
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Welcome to RocketHooks! We&apos;re excited to help you build better
          APIs and manage webhooks effectively.
        </p>
      </div>
    </div>
  );
}
