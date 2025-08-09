// src/components/auth/ProtectedRoute.tsx
import { useAuth, useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  const [guardsResult, setGuardsResult] = useState<GuardResult | null>(null)
  const [guardsLoading, setGuardsLoading] = useState(false)

  // Create stable reference for guards to prevent infinite re-renders
  const guardsRef = useRef<RouteGuard[]>([])
  const guardsHashRef = useRef<string>('')

  // Create a hash of the guards functions to detect changes
  const guardsHash = useMemo(() => {
    return `${guards.map((guard) => guard.toString()).join('|')}:${guards.length.toString()}`
  }, [guards])

  // Update guards ref only when the hash changes
  useEffect(() => {
    if (guardsHashRef.current !== guardsHash) {
      guardsRef.current = guards
      guardsHashRef.current = guardsHash
    }
  }, [guards, guardsHash])

  // Build guard context
  const context = useMemo(
    () => ({
      isAuthenticated: Boolean(isSignedIn),
      user,
      isNewUser,
      onboardingComplete: !shouldRedirectToOnboarding,
      currentPath: location.pathname,
    }),
    [isSignedIn, user, isNewUser, shouldRedirectToOnboarding, location.pathname]
  )

  // Evaluate guards asynchronously
  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      return
    }

    if (guardsRef.current.length === 0) {
      setGuardsResult(null)
      return
    }

    const evaluateGuards = async () => {
      setGuardsLoading(true)

      try {
        for (const guard of guardsRef.current) {
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
  }, [context, fallbackPath, authLoaded, userLoaded])

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

  // Check guard results - show loading if guard explicitly requests it
  if (guardsResult && !guardsResult.allowed) {
    if (guardsResult.showLoading) {
      return (
        loadingComponent ?? (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
      )
    }
    return <Navigate to={guardsResult.redirectTo ?? fallbackPath} replace />
  }

  // Default auth check if no guards provided
  if (guardsRef.current.length === 0 && !isSignedIn) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}
