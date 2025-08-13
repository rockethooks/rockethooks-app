import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/Card';
import { useReturnUrl } from '@/hooks/auth/useReturnUrl';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

/**
 * AuthCallback component handles post-authentication logic
 * - Detects if user is new (created within last minute)
 * - Shows welcome toast for new users
 * - Redirects to appropriate destination based on user status
 * - Handles return URLs for redirecting users to their intended destination
 */
export function AuthCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { getReturnUrl, clearReturnUrl } = useReturnUrl();
  const {
    isLoading: onboardingLoading,
    isNewUser,
    shouldRedirectToOnboarding,
    error,
  } = useOnboardingStatus();

  useEffect(() => {
    // Wait for both auth and onboarding status to load
    if (!isLoaded || onboardingLoading) {
      return;
    }

    // If not signed in, redirect to login
    if (!isSignedIn) {
      void navigate('/login', { replace: true });
      return;
    }

    // Handle onboarding status error
    if (error) {
      console.error('Error determining onboarding status:', error);
      toast.error('Welcome to RocketHooks!', {
        description:
          'There was an issue loading your profile, but you can still continue.',
        duration: 5000,
      });
      // Fallback to dashboard on error
      void navigate('/dashboard', { replace: true });
      return;
    }

    // Show welcome toast for new users
    if (isNewUser) {
      toast.success('Welcome to RocketHooks! 🎉', {
        description: "Let's get you set up with a quick onboarding process.",
        duration: 6000,
      });
    }

    // Navigate based on onboarding status
    if (shouldRedirectToOnboarding) {
      void navigate('/onboarding/1', { replace: true });
    } else {
      // Check for return URL for existing users
      const returnUrl = getReturnUrl();
      if (returnUrl) {
        clearReturnUrl();
        void navigate(returnUrl, { replace: true });
      } else {
        // Default to dashboard if no return URL
        void navigate('/dashboard', { replace: true });
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    onboardingLoading,
    isNewUser,
    shouldRedirectToOnboarding,
    error,
    navigate,
    getReturnUrl,
    clearReturnUrl,
  ]);

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h2 className="text-lg font-semibold">
                Setting up your account...
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we prepare your RocketHooks workspace.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthCallback;
