import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';
import type { OnboardingProgress } from '@/types/onboarding';

interface OnboardingHeaderProps {
  progress: OnboardingProgress;
  navigation: {
    isFirstStep: boolean;
    isLastStep: boolean;
    currentRoute: string;
    canGoBack: boolean;
    canSkip: boolean;
    canProceed: boolean;
  };
}

const stepLabels = {
  organization: 'Organization Setup',
  profile: 'Profile Information',
  preferences: 'Preferences',
  complete: 'Complete Setup',
} as const;

export function OnboardingHeader({
  progress,
  navigation,
}: OnboardingHeaderProps) {
  const { goBack, currentState } = useOnboarding();

  const currentStepKey = (() => {
    switch (currentState.type) {
      case 'ORGANIZATION_SETUP':
        return 'organization';
      case 'PROFILE_COMPLETION':
        return 'profile';
      case 'PREFERENCES':
        return 'preferences';
      case 'COMPLETION':
        return 'complete';
      default:
        return 'organization';
    }
  })();

  const currentStepLabel = stepLabels[currentStepKey];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button and Title */}
          <div className="flex items-center gap-4">
            {navigation.canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold">{currentStepLabel}</h1>
              <p className="text-sm text-muted-foreground">
                Step {progress.currentStep} of {progress.totalSteps}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {progress.percentage}% complete
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* Step Breadcrumbs - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center mt-4 gap-2">
          {Object.entries(stepLabels).map(([key, label], index) => {
            const stepNumber = index + 1;
            const isCompleted = progress.completedSteps.includes(key);
            const isCurrent = key === currentStepKey;
            const isSkipped = progress.skippedSteps.includes(key);

            return (
              <div key={key} className="flex items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      'h-px w-8 mx-2',
                      isCompleted ||
                        (isCurrent && stepNumber <= progress.currentStep)
                        ? 'bg-primary'
                        : 'bg-muted'
                    )}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : isSkipped
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isCurrent
                        ? 'text-foreground'
                        : isCompleted
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
