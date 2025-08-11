/**
 * Apollo Client Error Handling Link
 * Handles GraphQL errors, network errors, and implements retry logic
 */

import type { ErrorResponse } from '@apollo/client/link/error'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import toast from 'react-hot-toast'

interface RetryErrorWithNetwork {
  networkError?: unknown
  graphQLErrors?: Array<{
    extensions?: Record<string, unknown>
  }>
}

/**
 * User-friendly error messages for common GraphQL error codes
 */
const ERROR_MESSAGES = {
  UNAUTHENTICATED: 'Please sign in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  BAD_USER_INPUT: 'Please check your input and try again',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  TIMEOUT: 'Request timed out. Please try again',
} as const

/**
 * Extract user-friendly error message from GraphQL errors
 */
const getErrorMessage = (error: ErrorResponse): string => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0]
    if (graphQLError) {
      const errorCode = graphQLError.extensions?.['code'] as string

      if (errorCode && errorCode in ERROR_MESSAGES) {
        return ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES]
      }

      // Return the GraphQL error message if no mapped message
      return graphQLError.message || 'An unexpected error occurred'
    }
  }

  if (error.networkError) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  return 'An unexpected error occurred'
}

/**
 * Handle authentication errors by redirecting to sign-in
 */
const handleAuthError = () => {
  // Redirect to sign-in page
  const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL ?? '/sign-in'

  if (window.location.pathname !== signInUrl) {
    window.location.href = signInUrl
  }
}

/**
 * Log errors for debugging and monitoring
 */
const logError = (error: ErrorResponse) => {
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.group('Apollo Client Error')
    console.error('Operation:', error.operation.operationName)
    console.error('Variables:', error.operation.variables)
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors)
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError)
    }
    console.groupEnd()
  }
}

/**
 * Create error link for handling GraphQL and network errors
 */
export const createErrorLink = () => {
  return onError((error: ErrorResponse) => {
    const { graphQLErrors, networkError } = error

    // Log the error for debugging
    logError(error)

    // Handle GraphQL errors
    if (graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        const errorCode = graphQLError.extensions?.['code']
        const errorMessage = getErrorMessage(error)

        switch (errorCode) {
          case 'UNAUTHENTICATED':
            console.error('Authentication error:', errorMessage)
            toast.error(errorMessage)
            handleAuthError()
            break

          case 'FORBIDDEN':
            console.error('Authorization error:', errorMessage)
            toast.error(errorMessage)
            break

          case 'BAD_USER_INPUT':
            console.error('Input validation error:', errorMessage)
            toast.error(errorMessage)
            break

          default:
            console.error('GraphQL error:', errorMessage)
            toast.error(errorMessage)
        }
      })
    }

    // Handle network errors
    if (networkError) {
      const errorMessage = getErrorMessage(error)
      console.error('Network error:', errorMessage)

      // Show toast notification for network errors
      toast.error(errorMessage)

      // Network errors will be retried by the RetryLink
    }
  })
}

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
        const retryError = error as RetryErrorWithNetwork

        // Only retry network errors and specific GraphQL errors
        if (retryError.networkError) {
          return true
        }

        if (retryError.graphQLErrors) {
          // Don't retry authentication or authorization errors
          const hasAuthError = retryError.graphQLErrors.some((gqlError) => {
            const code = gqlError.extensions?.['code']
            return code === 'UNAUTHENTICATED' || code === 'FORBIDDEN'
          })

          return !hasAuthError
        }

        return false
      },
    },
  })
}
