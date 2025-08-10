import { DashboardPage } from '@/shared/components/PageLayout'

export function PlaceholderOnboardingPage() {
  return (
    <DashboardPage
      title="Welcome to RocketHooks"
      description="Let's get you set up"
    >
      <div className="text-center text-muted-foreground">
        <h2 className="text-2xl font-semibold mb-4">Onboarding Step 1</h2>
        <p>This is a placeholder for the onboarding process.</p>
        <p className="mt-2 text-sm">
          The onboarding flow will be implemented in future tasks.
        </p>
      </div>
    </DashboardPage>
  )
}
