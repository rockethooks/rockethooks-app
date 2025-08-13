/**
 * Apollo Client Error Handling Link
 * Handles GraphQL errors, network errors, and implements retry logic
 */

import { Observable } from '@apollo/client';
import { type ErrorResponse, onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import toast from 'react-hot-toast';
import { GraphQLErrorClassifier } from '@/lib/errors/classifier';
import { ErrorType, RateLimitError } from '@/lib/errors/types';

interface RetryErrorWithNetwork {
  networkError?: unknown;
  graphQLErrors?: Array<{
    extensions?: Record<string, unknown>;
  }>;
}

/**
 * Handle authentication errors by redirecting to sign-in
 */
const handleAuthError = () => {
  // Store current location for redirect after login
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
  }

  // Redirect to sign-in page
  const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL ?? '/sign-in';

  if (window.location.pathname !== signInUrl) {
    window.location.href = signInUrl;
  }
};

/**
 * Log errors for debugging and monitoring
 */
const logError = (error: ErrorResponse) => {
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.group('Apollo Client Error');
    console.error('Operation:', error.operation.operationName);
    console.error('Variables:', error.operation.variables);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
    console.groupEnd();
  }
};

/**
 * Create enhanced error link for handling GraphQL and network errors
 */
export const createErrorLink = () => {
  return onError((errorResponse) => {
    const classifiedError = GraphQLErrorClassifier.classify(errorResponse);
    // Log the error for debugging
    logError(errorResponse);

    // Don't show toast for validation errors
    if (classifiedError.type === ErrorType.VALIDATION) {
      // Let the mutation handler deal with it
      return undefined;
    }

    // Handle rate limiting with retry
    if (classifiedError instanceof RateLimitError) {
      const retryAfter = classifiedError.retryAfter ?? 60;

      return new Observable((observer) => {
        let countdown = retryAfter;
        const toastId = 'rate-limit-countdown';

        const interval = setInterval(() => {
          if (countdown > 0) {
            toast.loading(
              `Rate limited. Retrying in ${String(countdown)}s...`,
              {
                id: toastId,
              }
            );
            countdown--;
          } else {
            clearInterval(interval);
            toast.dismiss(toastId);
            errorResponse.forward(errorResponse.operation).subscribe(observer);
          }
        }, 1000);

        // Initial toast
        toast.loading(`Rate limited. Retrying in ${String(countdown)}s...`, {
          id: toastId,
        });
      });
    }

    // Handle network errors with retry
    if (
      errorResponse.networkError &&
      classifiedError.type === ErrorType.NETWORK
    ) {
      const retryCount = (errorResponse.operation.getContext().retryCount ??
        0) as number;

      if (retryCount < 3) {
        const delay = 2 ** retryCount * 1000;

        return new Observable((observer) => {
          const toastId = toast.loading('Retrying...', {
            id: 'network-retry',
          });

          setTimeout(() => {
            toast.dismiss(toastId);

            errorResponse.operation.setContext({ retryCount: retryCount + 1 });
            errorResponse.forward(errorResponse.operation).subscribe(observer);
          }, delay);
        });
      }

      // Max retries reached
      toast.error(
        'Connection failed. Please check your internet and try again.'
      );
      return undefined;
    }

    // Handle auth errors
    if (classifiedError.type === ErrorType.AUTH) {
      toast.error(classifiedError.message);
      handleAuthError();
      return undefined;
    }

    // Handle other errors (webhook, graphql)
    if (
      classifiedError.type === ErrorType.WEBHOOK ||
      classifiedError.type === ErrorType.GRAPHQL
    ) {
      toast.error(classifiedError.message);
    }

    return undefined;
  });
};

/**
 * Create retry link for handling network failures with exponential backoff
 */
export const createRetryLink = () => {
  return new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error: unknown) => {
        const retryError = error as RetryErrorWithNetwork;

        // Only retry network errors and specific GraphQL errors
        if (retryError.networkError) {
          return true;
        }

        if (retryError.graphQLErrors) {
          // Don't retry authentication or authorization errors
          const hasAuthError = retryError.graphQLErrors.some((gqlError) => {
            const code = gqlError.extensions?.code;
            return code === 'UNAUTHENTICATED' || code === 'FORBIDDEN';
          });

          return !hasAuthError;
        }

        return false;
      },
    },
  });
};
