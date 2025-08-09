import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { RootLayout } from '@/app/layouts/RootLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import AuthCallback from '@/pages/auth/AuthCallback'
import { LoginWithErrorBoundary } from '@/pages/auth/Login'
import { ComponentTest } from '@/pages/ComponentTest'
import {
  combineGuards,
  requireAuth,
  requireOnboarding,
} from '@/services/auth/guards'
import { DashboardPage } from '@/shared/components/PageLayout'

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

// Placeholder onboarding page
function OnboardingPage() {
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginWithErrorBoundary />
          </PublicRoute>
        ),
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />, // Handles its own redirects
      },
      // Onboarding (requires auth only)
      {
        path: 'onboarding/:step',
        element: (
          <ProtectedRoute guards={[requireAuth]}>
            <OnboardingPage />
          </ProtectedRoute>
        ),
      },
      // Protected dashboard routes
      {
        path: '/',
        element: (
          <ProtectedRoute
            guards={[combineGuards(requireAuth, requireOnboarding)]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'dashboard',
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
