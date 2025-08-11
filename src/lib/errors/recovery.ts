import { toast } from 'react-hot-toast'
import {
  type AppError,
  type AuthenticationError,
  ErrorType,
  type GraphQLError,
  type NetworkError,
  type RateLimitError,
  type ValidationError,
  type WebhookError,
} from './types'

// Properly typed router interface
interface Router {
  push: (path: string) => void
}

// Properly typed auth store interface
interface AuthStore {
  logout: () => void
}

export interface RecoveryContext {
  retry?: (() => void) | undefined
  router?: Router
  authStore?: AuthStore
}

// Type for cleanup functions
type CleanupFunction = () => void

// Recovery strategy type with optional cleanup return
type RecoveryStrategy<T extends AppError> = (
  error: T,
  context: RecoveryContext
) => CleanupFunction | undefined | Promise<CleanupFunction | undefined>

// Properly typed recovery strategies with discriminated unions
export const recoveryStrategies: {
  [ErrorType.NETWORK]: RecoveryStrategy<NetworkError>
  [ErrorType.AUTH]: RecoveryStrategy<AuthenticationError>
  [ErrorType.RATE_LIMIT]: RecoveryStrategy<RateLimitError>
  [ErrorType.VALIDATION]: RecoveryStrategy<ValidationError>
  [ErrorType.WEBHOOK]: RecoveryStrategy<WebhookError>
  [ErrorType.GRAPHQL]: RecoveryStrategy<GraphQLError>
} = {
  [ErrorType.NETWORK]: async (
    _error: NetworkError,
    context: RecoveryContext
  ) => {
    const { retry } = context

    if (!retry) return undefined

    // Show retrying toast
    const toastId = toast.loading('Retrying...', {
      id: 'network-retry',
    })

    try {
      // Wait a moment before retry
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Attempt retry
      retry()

      // Dismiss loading toast
      toast.dismiss(toastId)
    } catch {
      toast.error(
        'Connection failed. Please check your internet and try again.',
        {
          id: toastId,
        }
      )
    }

    return undefined
  },

  [ErrorType.AUTH]: (_error: AuthenticationError, context: RecoveryContext) => {
    const { authStore, router } = context

    // Clear auth state
    if (authStore) {
      authStore.logout()
    }

    // Store current location for redirect after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
    }

    // Redirect to login
    if (router) {
      router.push('/login')
    }

    return undefined
  },

  [ErrorType.RATE_LIMIT]: (error: RateLimitError, context: RecoveryContext) => {
    const { retry } = context
    let retryAfter = error.retryAfter ?? 60

    if (!retry) return undefined

    // Generate unique toast ID to prevent collisions
    const toastId = `rate-limit-${Date.now().toString()}`

    // Track interval for cleanup
    let intervalId: NodeJS.Timeout | null = null

    const startCountdown = () => {
      intervalId = setInterval(() => {
        if (retryAfter > 0) {
          toast.loading(`Rate limited. Retrying in ${String(retryAfter)}s...`, {
            id: toastId,
          })
          retryAfter--
        } else {
          if (intervalId) {
            clearInterval(intervalId)
          }
          toast.dismiss(toastId)
          retry()
        }
      }, 1000)
    }

    // Initial toast
    toast.loading(`Rate limited. Retrying in ${String(retryAfter)}s...`, {
      id: toastId,
    })

    startCountdown()

    // Return cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        toast.dismiss(toastId)
      }
    }
  },

  [ErrorType.VALIDATION]: (
    _error: ValidationError,
    _context: RecoveryContext
  ) => {
    // Don't show toast - let form handler deal with it
    // Validation errors are handled at the component level
    return undefined
  },

  [ErrorType.WEBHOOK]: (error: WebhookError, _context: RecoveryContext) => {
    // Show webhook-specific error message with unique ID
    const toastId = `webhook-error-${Date.now().toString()}`
    toast.error(error.message, {
      id: toastId,
      duration: 5000,
    })
    return undefined
  },

  [ErrorType.GRAPHQL]: (error: GraphQLError, _context: RecoveryContext) => {
    // Show generic GraphQL error with unique ID
    const toastId = `graphql-error-${Date.now().toString()}`
    toast.error(error.message, {
      id: toastId,
    })
    return undefined
  },
}

// Type guard functions for proper type discrimination
function isNetworkError(error: AppError): error is NetworkError {
  return error.type === ErrorType.NETWORK
}

function isAuthenticationError(error: AppError): error is AuthenticationError {
  return error.type === ErrorType.AUTH
}

function isRateLimitError(error: AppError): error is RateLimitError {
  return error.type === ErrorType.RATE_LIMIT
}

function isValidationError(error: AppError): error is ValidationError {
  return error.type === ErrorType.VALIDATION
}

function isWebhookError(error: AppError): error is WebhookError {
  return error.type === ErrorType.WEBHOOK
}

function isGraphQLError(error: AppError): error is GraphQLError {
  return error.type === ErrorType.GRAPHQL
}

export async function executeRecovery(
  error: AppError,
  context: RecoveryContext
): Promise<CleanupFunction | undefined> {
  // Use type guards for proper type discrimination
  if (isNetworkError(error)) {
    return recoveryStrategies[ErrorType.NETWORK](error, context)
  }

  if (isAuthenticationError(error)) {
    return recoveryStrategies[ErrorType.AUTH](error, context)
  }

  if (isRateLimitError(error)) {
    return recoveryStrategies[ErrorType.RATE_LIMIT](error, context)
  }

  if (isValidationError(error)) {
    return recoveryStrategies[ErrorType.VALIDATION](error, context)
  }

  if (isWebhookError(error)) {
    return recoveryStrategies[ErrorType.WEBHOOK](error, context)
  }

  if (isGraphQLError(error)) {
    return recoveryStrategies[ErrorType.GRAPHQL](error, context)
  }

  // Default fallback
  toast.error(error.message)
  return undefined
}
