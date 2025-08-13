import type { ErrorResponse } from '@apollo/client/link/error';
import { useAuth } from '@clerk/clerk-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLErrorClassifier } from '@/lib/errors/classifier';
import { executeRecovery } from '@/lib/errors/recovery';
import { type AppError, ValidationError } from '@/lib/errors/types';

interface UseGraphQLErrorReturn {
  error: AppError | null;
  validationErrors: Record<string, string> | null;
  isRecovering: boolean;
  handleError: (error: ErrorResponse) => AppError;
  recover: (retryFn?: () => void) => Promise<void>;
  dismiss: () => void;
}

export function useGraphQLError(): UseGraphQLErrorReturn {
  const [error, setError] = useState<AppError | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Use ref to store cleanup function
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleError = useCallback((apolloError: ErrorResponse): AppError => {
    const classifiedError = GraphQLErrorClassifier.classify(apolloError);
    setError(classifiedError);

    // If it's a validation error, extract field errors
    if (classifiedError instanceof ValidationError) {
      setValidationErrors(classifiedError.fields ?? null);
    } else {
      setValidationErrors(null);
    }

    return classifiedError;
  }, []);

  const recover = useCallback(
    async (retryFn?: () => void) => {
      if (!error) return;

      // Clean up any previous recovery
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      setIsRecovering(true);
      try {
        const cleanup = await executeRecovery(error, {
          retry: retryFn ?? undefined,
          router: {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            push: navigate,
          },
          authStore: {
            logout: () => {
              // Fire and forget the async signOut
              void signOut().catch(() => {
                // Silently handle any logout errors
              });
            },
          },
        });

        // Store cleanup function if provided
        if (cleanup) {
          cleanupRef.current = cleanup;
        }

        // Clear error after successful recovery
        if (retryFn) {
          setError(null);
          setValidationErrors(null);
        }
      } finally {
        setIsRecovering(false);
      }
    },
    [error, navigate, signOut]
  );

  const dismiss = useCallback(() => {
    // Clean up any ongoing recovery
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    setError(null);
    setValidationErrors(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      error,
      validationErrors,
      isRecovering,
      handleError,
      recover,
      dismiss,
    }),
    [error, validationErrors, isRecovering, handleError, recover, dismiss]
  );
}
