import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { RootLayout } from '@/layouts/RootLayout'
import {
  ActivityPage,
  AnalyticsPage,
  AuthCallback,
  ComponentTestPage,
  EndpointsPage,
  HomePage,
  LoginWithErrorBoundary,
  PlaceholderOnboardingPage,
  SettingsPage,
  TeamPage,
  WebhooksPage,
} from '@/pages'
import {
  combineGuards,
  requireAuth,
  requireOnboarding,
} from '@/services/auth/guards'

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
            <PlaceholderOnboardingPage />
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
