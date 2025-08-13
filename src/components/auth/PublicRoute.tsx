// src/components/auth/PublicRoute.tsx
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo }: PublicRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { shouldRedirectToOnboarding } = useOnboardingStatus();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    const destination =
      redirectTo ??
      (shouldRedirectToOnboarding ? '/onboarding/1' : '/dashboard');
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
