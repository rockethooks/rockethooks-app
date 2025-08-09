import { useParams } from 'react-router-dom'
import { OrganizationStep } from './steps/OrganizationStep'

// Map of step names to components
const stepComponents = {
  organization: OrganizationStep,
  // Additional steps can be added here as they're implemented
  // preferences: PreferencesStep,
  // apiTarget: ApiTargetStep,
  // webhook: WebhookStep,
} as const

type StepName = keyof typeof stepComponents

export function OnboardingPage() {
  const { step } = useParams<{ step: string }>()

  // Default to 'organization' if no step is provided or step is invalid
  const currentStep =
    step && step in stepComponents ? (step as StepName) : 'organization'
  const StepComponent = stepComponents[currentStep]

  return (
    <div className="min-h-screen bg-background">
      <StepComponent />
    </div>
  )
}
