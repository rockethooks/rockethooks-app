import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { useOnboardingInit } from '@/hooks/useOnboardingInit';
import { useOnboarding } from '@/store/onboarding/hooks';
import { OnboardingErrorBoundary } from './components/OnboardingErrorBoundary';
import { OnboardingFooter } from './components/OnboardingFooter';
import { OnboardingHeader } from './components/OnboardingHeader';
import { CompletionStep } from './steps/CompletionStep';
import { OrganizationStep } from './steps/OrganizationStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ProfileStep } from './steps/ProfileStep';

// Map of step names to components
const stepComponents = {
  organization: OrganizationStep,
  profile: ProfileStep,
  preferences: PreferencesStep,
  complete: CompletionStep,
  // Additional steps can be added here as they're implemented
  // apiTarget: ApiTargetStep,
  // webhook: WebhookStep,
} as const;

type StepName = keyof typeof stepComponents;

export function OnboardingPage() {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();

  // Initialize onboarding with Clerk user information
  const { isInitialized, isInitializing } = useOnboardingInit({
    autoInitialize: true,
    generateSuggestions: true,
  });

  // Use the new state machine hooks
  const { currentRoute, context, stateChecks, progress } = useOnboarding();

  // Default to 'organization' if no step is provided or step is invalid
  const currentStep =
    step && step in stepComponents ? (step as StepName) : 'organization';
  const StepComponent = stepComponents[currentStep];

  // Check if we're still loading - now also checking if initialization is complete
  const isLoading = !isInitialized || isInitializing || context.isLoading;

  // Handle browser navigation and state machine synchronization
  useEffect(() => {
    // If the URL step doesn't match the state machine's expected route, navigate to correct route
    const expectedRoute = currentRoute;
    const expectedStep = expectedRoute.split('/').pop();
    const currentPath = window.location.pathname;

    if (
      expectedRoute &&
      expectedRoute !== currentPath &&
      expectedStep &&
      expectedStep !== currentStep &&
      !stateChecks.isStart &&
      !context.isLoading
    ) {
      // Only navigate if we're not in a loading state and the expected step is valid
      if (!isLoading && expectedStep in stepComponents) {
        void navigate(expectedRoute, { replace: true });
      }
    }
  }, [
    currentRoute,
    currentStep,
    navigate,
    isLoading,
    stateChecks.isStart,
    context.isLoading,
  ]);

  // Handle browser back/forward navigation - validate step access
  useEffect(() => {
    // If user navigates to a step they shouldn't have access to, redirect appropriately
    if (!isLoading && step && step in stepComponents) {
      const stepOrder = {
        organization: 1,
        profile: 2,
        preferences: 3,
        complete: 4,
      } as const;

      const currentStepOrder = stepOrder[step as keyof typeof stepOrder];
      const allowedMaxStep = Math.max(progress.currentStep, 1);

      // If user tries to access a future step they haven't reached, redirect to current step
      if (currentStepOrder > allowedMaxStep) {
        const expectedRoute = currentRoute;
        if (expectedRoute) {
          void navigate(expectedRoute, { replace: true });
        }
      }
    }
  }, [step, progress.currentStep, isLoading, currentRoute, navigate]);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <OnboardingHeader />

      {/* Error Boundary for Step Content */}
      <OnboardingErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <StepComponent />
        </div>
      </OnboardingErrorBoundary>

      {/* Step Navigation Footer */}
      <OnboardingFooter currentStep={currentStep} />
    </div>
  );
}
