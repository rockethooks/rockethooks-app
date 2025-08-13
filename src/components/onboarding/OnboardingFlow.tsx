import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  SkipForward,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useOnboarding, useOnboardingProgress } from '@/store/onboarding/hooks';

/**
 * Centralized OnboardingFlow component demonstrating the new state machine hooks
 *
 * This component serves as both a working example and reference implementation
 * showing how to use the new hooks from src/store/onboarding/hooks.ts
 */
export function OnboardingFlow() {
  const {
    stateChecks,
    context,
    progress,
    actions,
    capabilities,
    currentRoute,
  } = useOnboarding();

  const progressDetails = useOnboardingProgress();

  // Error state handling
  if (stateChecks.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Onboarding Error
            </CardTitle>
            <CardDescription>
              Something went wrong during the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {context.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div>
                  <p className="font-semibold">Latest Error:</p>
                  <p>
                    {context.errors[context.errors.length - 1]?.message ??
                      'Unknown error'}
                  </p>
                </div>
              </Alert>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={actions.reset}>
                Start Over
              </Button>
              <Button onClick={actions.retry}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion state
  if (stateChecks.isDashboard || stateChecks.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Onboarding Complete!
            </CardTitle>
            <CardDescription>
              Welcome to RocketHooks! You&apos;re all set up and ready to go.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>User:</strong> {context.userId}
              </p>
              {context.organizationId && (
                <p>
                  <strong>Organization:</strong> {context.organizationId}
                </p>
              )}
              <p>
                <strong>Completed Steps:</strong> {context.completedSteps.size}
              </p>
              {context.completedAt && (
                <p>
                  <strong>Completed:</strong>{' '}
                  {new Date(context.completedAt).toLocaleString()}
                </p>
              )}
            </div>
            <Button className="w-full">Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {capabilities.canGoBack && (
                <Button variant="ghost" size="sm" onClick={actions.goBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold">
                  {getStepTitle(stateChecks)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Step {progress.currentStep} of {progress.totalSteps}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{progress.percentage}% complete</Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Start State */}
          {stateChecks.isStart && (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to RocketHooks</CardTitle>
                <CardDescription>
                  Let&apos;s get you set up with your account and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={actions.begin} className="w-full">
                  Start Onboarding
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Checking Organization State */}
          {stateChecks.isCheckingOrganization && (
            <Card>
              <CardHeader>
                <CardTitle>Checking Organization</CardTitle>
                <CardDescription>
                  We&apos;re checking your organization status...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="animate-spin h-8 w-8 border border-current border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    This will just take a moment
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organization Setup State */}
          {stateChecks.isOrgSetup && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Setup</CardTitle>
                <CardDescription>
                  Set up your organization profile to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This step helps us customize your experience.
                </p>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {capabilities.canSkip && (
                      <Button variant="ghost" onClick={actions.skip}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip
                      </Button>
                    )}
                  </div>
                  <Button onClick={actions.completeOrganization}>
                    Complete Setup
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Completion State */}
          {stateChecks.isProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>
                  Complete your profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tell us more about yourself to personalize your experience.
                </p>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {capabilities.canGoBack && (
                      <Button variant="outline" onClick={actions.goBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    )}
                    {capabilities.canSkip && (
                      <Button variant="ghost" onClick={actions.skip}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip
                      </Button>
                    )}
                  </div>
                  <Button onClick={actions.completeProfile}>
                    Complete Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences State */}
          {stateChecks.isPreferences && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Set your preferences and notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Customize how you want to interact with RocketHooks.
                </p>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {capabilities.canGoBack && (
                      <Button variant="outline" onClick={actions.goBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    )}
                    <Button variant="ghost" onClick={actions.skipPreferences}>
                      <SkipForward className="h-4 w-4 mr-2" />
                      Skip Preferences
                    </Button>
                  </div>
                  <Button onClick={actions.savePreferences}>
                    Save Preferences
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion State */}
          {stateChecks.isCompletion && (
            <Card>
              <CardHeader>
                <CardTitle>Almost Done!</CardTitle>
                <CardDescription>
                  Just one final step to complete your onboarding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Progress Summary:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Completed steps: {context.completedSteps.size}</li>
                    <li>Skipped steps: {context.skippedSteps.size}</li>
                    {progressDetails.stepsRemaining > 0 && (
                      <li>Remaining steps: {progressDetails.stepsRemaining}</li>
                    )}
                  </ul>
                </div>
                <Button onClick={actions.complete} className="w-full">
                  Complete Onboarding
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Debug Information (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div>
                  <strong>Current Route:</strong> {currentRoute}
                </div>
                <div>
                  <strong>User ID:</strong> {context.userId}
                </div>
                <div>
                  <strong>Organization ID:</strong>{' '}
                  {context.organizationId ?? 'Not set'}
                </div>
                <div>
                  <strong>Started At:</strong>{' '}
                  {context.startedAt ?? 'Not started'}
                </div>
                <div>
                  <strong>Can Proceed:</strong>{' '}
                  {capabilities.canProceed ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Is First Step:</strong>{' '}
                  {progressDetails.isFirstStep ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Is Last Step:</strong>{' '}
                  {progressDetails.isLastStep ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Capabilities:</strong>
                </div>
                <ul className="list-disc list-inside ml-4">
                  <li>Can go back: {capabilities.canGoBack ? 'Yes' : 'No'}</li>
                  <li>Can skip: {capabilities.canSkip ? 'Yes' : 'No'}</li>
                  <li>Can proceed: {capabilities.canProceed ? 'Yes' : 'No'}</li>
                </ul>
                {context.errors.length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {context.errors.map((error) => (
                        <li key={`${error.timestamp}-${error.code}`}>
                          {error.timestamp}: {error.message} (Code: {error.code}
                          )
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Helper function to get step title based on current state
 */
function getStepTitle(
  stateChecks: ReturnType<typeof useOnboarding>['stateChecks']
) {
  if (stateChecks.isStart) return 'Welcome';
  if (stateChecks.isCheckingOrganization) return 'Checking Organization';
  if (stateChecks.isOrgSetup) return 'Organization Setup';
  if (stateChecks.isProfile) return 'Profile Completion';
  if (stateChecks.isPreferences) return 'Preferences';
  if (stateChecks.isCompletion) return 'Final Step';
  if (stateChecks.isDashboard) return 'Complete';
  if (stateChecks.isError) return 'Error';
  return 'Onboarding';
}
