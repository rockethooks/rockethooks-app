// src/components/auth/ProtectedRoute.tsx
import { useAuth, useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import type { GuardResult, RouteGuard } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  guards?: RouteGuard[]
  fallbackPath?: string
  loadingComponent?: React.ReactNode
}

export function ProtectedRoute({
  children,
  guards = [],
  fallbackPath = '/login',
  loadingComponent,
}: ProtectedRouteProps) {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { isNewUser, shouldRedirectToOnboarding } = useOnboardingStatus()

  const [guardsResult, setGuardsResult] = useState<GuardResult | null>(null)
  const [guardsLoading, setGuardsLoading] = useState(false)

  // Build guard context
  const context = useMemo(
    () => ({
      isAuthenticated: Boolean(isSignedIn),
      user,
      isNewUser,
      onboardingComplete: !shouldRedirectToOnboarding,
    }),
    [isSignedIn, user, isNewUser, shouldRedirectToOnboarding]
  )

  // Evaluate guards asynchronously
  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      return
    }

    if (guards.length === 0) {
      setGuardsResult(null)
      return
    }

    const evaluateGuards = async () => {
      setGuardsLoading(true)

      try {
        for (const guard of guards) {
          const result = await Promise.resolve(guard(context))
          if (!result.allowed) {
            setGuardsResult(result)
            setGuardsLoading(false)
            return
          }
        }
        // All guards passed
        setGuardsResult({ allowed: true })
      } catch (error) {
        // If guard evaluation fails, deny access
        console.error('Guard evaluation failed:', error)
        setGuardsResult({
          allowed: false,
          redirectTo: fallbackPath,
          reason: 'Guard evaluation failed',
        })
      } finally {
        setGuardsLoading(false)
      }
    }

    void evaluateGuards()
  }, [guards, context, fallbackPath, authLoaded, userLoaded])

  // Show loading while Clerk initializes
  if (!authLoaded || !userLoaded) {
    return (
      loadingComponent ?? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    )
  }

  // Show loading while evaluating guards
  if (guardsLoading) {
    return (
      loadingComponent ?? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    )
  }

  // Check guard results
  if (guardsResult && !guardsResult.allowed) {
    return <Navigate to={guardsResult.redirectTo ?? fallbackPath} replace />
  }

  // Default auth check if no guards provided
  if (guards.length === 0 && !isSignedIn) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}
