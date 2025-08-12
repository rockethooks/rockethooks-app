import { ArrowRight, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from '@/hooks/useOnboarding'

interface OnboardingFooterProps {
  navigation: {
    isFirstStep: boolean
    isLastStep: boolean
    currentRoute: string
    canGoBack: boolean
    canSkip: boolean
    canProceed: boolean
  }
  currentStep: string
}

export function OnboardingFooter({
  navigation,
  currentStep,
}: OnboardingFooterProps) {
  const { goBack, skipStep, completeStep, canProceed } = useOnboarding()

  // Don't show footer on completion step
  if (currentStep === 'complete') {
    return null
  }

  return (
    <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div>
            {navigation.canGoBack ? (
              <Button variant="outline" onClick={goBack} className="gap-2">
                Back
              </Button>
            ) : (
              <div />
            )}
          </div>

          {/* Right side - Skip and Continue */}
          <div className="flex items-center gap-3">
            {navigation.canSkip && (
              <Button variant="ghost" onClick={skipStep} className="gap-2">
                <SkipForward className="h-4 w-4" />
                Skip
              </Button>
            )}

            <Button
              onClick={() => completeStep()}
              disabled={!canProceed}
              className="gap-2"
            >
              {navigation.isLastStep ? 'Complete' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
