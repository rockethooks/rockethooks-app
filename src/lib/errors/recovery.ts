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

interface RecoveryContext {
  retry?: (() => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router?: any // Your router instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authStore?: any // Your auth store
}

export const recoveryStrategies = {
  [ErrorType.NETWORK]: async (
    _error: NetworkError,
    context: RecoveryContext
  ) => {
    const { retry } = context

    if (!retry) return

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
  },

  [ErrorType.AUTH]: (_error: AuthenticationError, context: RecoveryContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { authStore, router } = context

    // Clear auth state
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    authStore?.logout()

    // Store current location for redirect after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
    }

    // Redirect to login
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    router?.push('/login')
  },

  [ErrorType.RATE_LIMIT]: (error: RateLimitError, context: RecoveryContext) => {
    const { retry } = context
    let retryAfter = error.retryAfter ?? 60

    if (!retry) return

    // Show countdown toast
    const toastId = 'rate-limit-countdown'

    const countdown = setInterval(() => {
      if (retryAfter > 0) {
        toast.loading(`Rate limited. Retrying in ${String(retryAfter)}s...`, {
          id: toastId,
        })
        retryAfter--
      } else {
        clearInterval(countdown)
        toast.dismiss(toastId)
        retry()
      }
    }, 1000)

    // Initial toast
    toast.loading(`Rate limited. Retrying in ${String(retryAfter)}s...`, {
      id: toastId,
    })
  },

  [ErrorType.VALIDATION]: (
    _error: ValidationError,
    _context: RecoveryContext
  ) => {
    // Don't show toast - let form handler deal with it
    // Validation errors are handled at the component level
    return
  },

  [ErrorType.WEBHOOK]: (error: WebhookError, _context: RecoveryContext) => {
    // Show webhook-specific error message
    toast.error(error.message, {
      duration: 5000,
    })
  },

  [ErrorType.GRAPHQL]: (error: GraphQLError, _context: RecoveryContext) => {
    // Show generic GraphQL error
    toast.error(error.message)
  },
}

export async function executeRecovery(
  error: AppError,
  context: RecoveryContext
): Promise<void> {
  const strategy = recoveryStrategies[error.type]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (strategy) {
    await strategy(
      error as NetworkError &
        AuthenticationError &
        RateLimitError &
        ValidationError &
        WebhookError &
        GraphQLError,
      context
    )
  } else {
    // Default fallback
    toast.error(error.message)
  }
}
