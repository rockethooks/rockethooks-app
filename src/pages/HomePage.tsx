import { DashboardPage } from '@/shared/components/PageLayout'

export function HomePage() {
  return (
    <DashboardPage
      title="Dashboard"
      description="Overview of your RocketHooks workspace"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-2xl font-bold">24</h3>
          <p className="text-sm text-muted-foreground">Active Webhooks</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-2xl font-bold">1,429</h3>
          <p className="text-sm text-muted-foreground">Events Today</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-2xl font-bold">98.5%</h3>
          <p className="text-sm text-muted-foreground">Success Rate</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-2xl font-bold">12ms</h3>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
        </div>
      </div>
    </DashboardPage>
  )
}
