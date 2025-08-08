import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/root-layout'
import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { DashboardPage } from '@/shared/components/page-layout'
import { ComponentTest } from '@/pages/component-test'

// Demo pages for each route
function HomePage() {
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

function WebhooksPage() {
  return (
    <DashboardPage
      title="Webhooks"
      description="Manage your webhook endpoints and configurations"
    >
      <div className="text-center text-muted-foreground">
        Webhooks page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function EndpointsPage() {
  return (
    <DashboardPage
      title="API Endpoints"
      description="Monitor and manage your API endpoints"
    >
      <div className="text-center text-muted-foreground">
        API Endpoints page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function AnalyticsPage() {
  return (
    <DashboardPage
      title="Analytics"
      description="View detailed analytics and performance metrics"
    >
      <div className="text-center text-muted-foreground">
        Analytics page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function ActivityPage() {
  return (
    <DashboardPage
      title="Activity"
      description="Recent activity and event logs"
    >
      <div className="text-center text-muted-foreground">
        Activity page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function TeamPage() {
  return (
    <DashboardPage
      title="Team"
      description="Manage team members and permissions"
    >
      <div className="text-center text-muted-foreground">
        Team page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function SettingsPage() {
  return (
    <DashboardPage
      title="Settings"
      description="Manage your account settings and preferences"
    >
      <div className="text-center text-muted-foreground">
        Settings page - Coming soon!
      </div>
    </DashboardPage>
  )
}

function ComponentTestPage() {
  return (
    <DashboardPage
      title="Component Test"
      description="Test and showcase UI components"
    >
      <ComponentTest />
    </DashboardPage>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'webhooks',
            element: <WebhooksPage />,
          },
          {
            path: 'endpoints',
            element: <EndpointsPage />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'activity',
            element: <ActivityPage />,
          },
          {
            path: 'team',
            element: <TeamPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'component-test',
            element: <ComponentTestPage />,
          },
        ],
      },
    ],
  },
])

export default router
