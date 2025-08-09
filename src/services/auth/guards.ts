// src/services/auth/guards.ts
import type { RouteGuard } from '@/types/auth'

export const requireAuth: RouteGuard = (context) => {
  if (!context.isAuthenticated) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'Authentication required',
    }
  }
  return { allowed: true }
}

export const requireOnboarding: RouteGuard = (context) => {
  // Skip for new users currently in onboarding
  if (context.isNewUser && window.location.pathname.startsWith('/onboarding')) {
    return { allowed: true }
  }

  if (!context.onboardingComplete) {
    return {
      allowed: false,
      redirectTo: '/onboarding/1',
      reason: 'Please complete onboarding',
    }
  }
  return { allowed: true }
}

export const publicOnly: RouteGuard = (context) => {
  if (context.isAuthenticated) {
    const redirectTo = context.onboardingComplete
      ? '/dashboard'
      : '/onboarding/1'
    return {
      allowed: false,
      redirectTo,
      reason: 'Already authenticated',
    }
  }
  return { allowed: true }
}

// Utility for combining guards
export function combineGuards(...guards: RouteGuard[]): RouteGuard {
  return async (context) => {
    for (const guard of guards) {
      const result = await guard(context)
      if (!result.allowed) return result
    }
    return { allowed: true }
  }
}
