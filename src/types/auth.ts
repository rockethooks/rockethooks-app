// src/types/auth.ts
import type { UserResource } from '@clerk/types';

export interface GuardContext {
  isAuthenticated: boolean;
  user: UserResource | null | undefined;
  isNewUser: boolean;
  onboardingComplete: boolean;
  currentPath: string;
  // Future: organizationId, organizationRole, permissions
}

export interface GuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
  showLoading?: boolean;
}

export type RouteGuard = (
  context: GuardContext
) => GuardResult | Promise<GuardResult>;
