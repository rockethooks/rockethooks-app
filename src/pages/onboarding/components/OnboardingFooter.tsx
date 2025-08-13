import { ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useOnboarding, useOnboardingProgress } from '@/store/onboarding/hooks';

interface OnboardingFooterProps {
  currentStep: string;
}

export function OnboardingFooter({ currentStep }: OnboardingFooterProps) {
  const { actions, capabilities, stateChecks } = useOnboarding();
  const progress = useOnboardingProgress();

  // Don't show footer on completion step or dashboard
  if (
    currentStep === 'complete' ||
    stateChecks.isDashboard ||
    stateChecks.isComplete
  ) {
    return null;
  }

  // Determine the appropriate action for the current state
  const handleContinue = () => {
    if (stateChecks.isOrgSetup) {
      actions.completeOrganization();
    } else if (stateChecks.isProfile) {
      actions.completeProfile();
    } else if (stateChecks.isPreferences) {
      actions.savePreferences();
    } else if (stateChecks.isCompletion) {
      actions.complete();
    }
  };

  const getContinueButtonText = () => {
    if (stateChecks.isCompletion || progress.isLastStep) {
      return 'Complete';
    }
    return 'Continue';
  };

  return (
    <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div>
            {capabilities.canGoBack ? (
              <Button
                variant="outline"
                onClick={actions.goBack}
                className="gap-2"
              >
                Back
              </Button>
            ) : (
              <div />
            )}
          </div>

          {/* Right side - Skip and Continue */}
          <div className="flex items-center gap-3">
            {capabilities.canSkip && (
              <Button variant="ghost" onClick={actions.skip} className="gap-2">
                <SkipForward className="h-4 w-4" />
                Skip
              </Button>
            )}

            <Button
              onClick={handleContinue}
              disabled={!capabilities.canProceed}
              className="gap-2"
            >
              {getContinueButtonText()}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
