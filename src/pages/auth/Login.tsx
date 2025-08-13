import { SignIn, useAuth } from '@clerk/clerk-react';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { loggers } from '@/utils';

const logger = loggers.auth;

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

// Define OAuth error codes and their user-friendly messages
const OAUTH_ERROR_MESSAGES = {
  oauth_access_denied:
    'Access was denied. Please try again or use a different account.',
  oauth_email_domain_blocked:
    'Your email domain is not allowed. Please contact support for assistance.',
  oauth_callback_error:
    'Authentication callback failed. Please try signing in again.',
  oauth_expired:
    'The authentication session has expired. Please start the login process again.',
  oauth_invalid_state:
    'Invalid authentication state. Please try signing in again.',
  oauth_network_error:
    'Network connection error. Please check your internet connection and try again.',
  oauth_server_error:
    'Server error occurred during authentication. Please try again later.',
  oauth_timeout: 'Authentication timed out. Please try again.',
  oauth_cancelled:
    'Authentication was cancelled. Please try again if you want to sign in.',
  oauth_scope_denied:
    'Required permissions were not granted. Please accept all requested permissions to continue.',
  oauth_invalid_client:
    'Authentication configuration error. Please contact support.',
  oauth_unauthorized_client:
    'This application is not authorized. Please contact support.',
  oauth_unsupported_response_type:
    'Authentication method not supported. Please try a different sign-in option.',
  oauth_invalid_request:
    'Invalid authentication request. Please try signing in again.',
  oauth_temporarily_unavailable:
    'Authentication service is temporarily unavailable. Please try again later.',
  oauth_unknown_error:
    'An unknown error occurred during authentication. Please try again.',
} as const;

// Log error with contextual information for debugging
const logError = (error: unknown, context: string) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string }).code ?? 'UNKNOWN',
      name: error instanceof Error ? error.name : 'Error',
      stack: error instanceof Error ? error.stack : undefined,
      ...((error as { status?: number }).status && {
        status: (error as { status: number }).status,
      }),
      ...((error as { statusText?: string }).statusText && {
        statusText: (error as { statusText: string }).statusText,
      }),
    },
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    logger.error('[OAuth Error]', errorInfo);
  }

  // TODO: In production, send to error tracking service (e.g., Sentry)
  // errorTrackingService.captureError(errorInfo)
};

// Process URL parameters and detect OAuth errors
const processAuthError = (searchParams: URLSearchParams): string | null => {
  // Standard OAuth error parameter
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorUri = searchParams.get('error_uri');

  // Clerk-specific error parameters
  const clerkError = searchParams.get('clerk_error');
  const clerkErrorDescription = searchParams.get('clerk_error_description');

  // Check for various error indicators
  if (error) {
    logError(
      {
        code: error,
        description: errorDescription,
        uri: errorUri,
      },
      'OAuth URL Error Parameter'
    );

    const message =
      error in OAUTH_ERROR_MESSAGES
        ? OAUTH_ERROR_MESSAGES[error as keyof typeof OAUTH_ERROR_MESSAGES]
        : (errorDescription ?? OAUTH_ERROR_MESSAGES.oauth_unknown_error);
    return message;
  }

  if (clerkError) {
    logError(
      {
        code: clerkError,
        description: clerkErrorDescription,
      },
      'Clerk URL Error Parameter'
    );

    return clerkErrorDescription ?? OAUTH_ERROR_MESSAGES.oauth_unknown_error;
  }

  return null;
};

export function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasProcessedError, setHasProcessedError] = useState(false);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  // Process and display OAuth errors from URL parameters
  useEffect(() => {
    if (hasProcessedError) return;

    const errorMessage = processAuthError(searchParams);
    if (errorMessage) {
      toast.error('Authentication Failed', {
        description: errorMessage,
        duration: 7000,
        action: {
          label: 'Try Again',
          onClick: () => {
            // Clear error parameters and refresh
            setSearchParams(new URLSearchParams());
            window.location.reload();
          },
        },
      });
      setHasProcessedError(true);
    }
  }, [searchParams, setSearchParams, hasProcessedError]);

  // Redirect if already signed in - now goes to auth callback for proper handling
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const redirectTo = searchParams.get('redirect_url') ?? '/auth/callback';
      void navigate(redirectTo, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, searchParams]);

  // Note: Error handling is now done through Clerk's built-in error handling
  // and URL parameter processing. The error detection and toast notifications
  // are handled by the useEffect above and the processAuthError function.

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // If already signed in, show a message while redirecting
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Already signed in. Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasError = processAuthError(searchParams) !== null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to RocketHooks</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Alert */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              There was an issue with the sign-in process. Please try again or
              contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )}

        {/* Sign-in Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred method to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Clerk SignIn Component with error handling */}
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-0 bg-transparent',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'w-full',
                    formButtonPrimary: 'w-full',
                    footerAction: 'hidden',
                  },
                }}
                signUpUrl="/sign-up"
                forceRedirectUrl="/auth/callback"
                fallbackRedirectUrl="/auth/callback"
                routing="hash"
              />

              {/* Network status and retry options */}
              {hasError && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchParams(new URLSearchParams());
                      window.location.reload();
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/sign-up')}
            >
              Sign up here
            </Button>
          </p>
          <p className="mt-2">
            Need help?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/support')}
            >
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced error boundary for the Login component
export function LoginWithErrorBoundary() {
  return (
    <div className="min-h-screen">
      <Login />
    </div>
  );
}

export default LoginWithErrorBoundary;
