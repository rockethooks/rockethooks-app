// src/services/auth/guards.ts

import { useAuthStore } from '@/store/auth.store';
import type { RouteGuard } from '@/types/auth';

export const requireAuth: RouteGuard = (context) => {
  if (!context.isAuthenticated) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'Authentication required',
    };
  }
  return { allowed: true };
};

export const requireOnboarding: RouteGuard = (context) => {
  // Import the auth store state to check initialization and onboarding status
  const authState = useAuthStore.getState();

  // If not fully initialized yet, show loading
  if (!authState.isInitialized || !authState.isOnboardingLoaded) {
    return {
      allowed: false,
      showLoading: true,
      reason: 'Loading user data...',
    };
  }

  // Skip for users currently in onboarding flow
  if (context.currentPath.startsWith('/onboarding')) {
    return { allowed: true };
  }

  // Check onboarding completion from the auth store
  const isOnboardingComplete = authState.onboarding?.isCompleted ?? false;

  if (!isOnboardingComplete) {
    return {
      allowed: false,
      redirectTo: '/onboarding/1',
      reason: 'Please complete onboarding',
    };
  }

  return { allowed: true };
};

export const publicOnly: RouteGuard = (context) => {
  if (context.isAuthenticated) {
    // Check auth store for onboarding completion
    const authState = useAuthStore.getState();
    const isOnboardingComplete = authState.onboarding?.isCompleted ?? false;

    const redirectTo = isOnboardingComplete ? '/dashboard' : '/onboarding/1';
    return {
      allowed: false,
      redirectTo,
      reason: 'Already authenticated',
    };
  }
  return { allowed: true };
};

// Utility for combining guards
export function combineGuards(...guards: RouteGuard[]): RouteGuard {
  return async (context) => {
    for (const guard of guards) {
      const result = await guard(context);
      if (!result.allowed) return result;
    }
    return { allowed: true };
  };
}
