import type { ApolloError } from '@apollo/client'
import {
  AppError,
  AuthenticationError,
  ErrorType,
  GraphQLError,
  NetworkError,
  RateLimitError,
  ValidationError,
  WebhookError,
} from './types'

// Type-safe helper to extract retry-after header
function getRetryAfterFromNetworkError(networkError: unknown): number {
  // Default fallback value
  const DEFAULT_RETRY_AFTER = 60

  if (!networkError || typeof networkError !== 'object') {
    return DEFAULT_RETRY_AFTER
  }

  // Safely check for headers property
  if ('headers' in networkError) {
    const headers = (networkError as { headers?: unknown }).headers

    // Check if headers has a get method
    if (headers && typeof headers === 'object' && 'get' in headers) {
      const getMethod = (headers as { get?: unknown }).get

      if (typeof getMethod === 'function') {
        try {
          const retryAfter = (getMethod as (key: string) => string | null)(
            'Retry-After'
          )
          if (retryAfter) {
            const parsed = parseInt(retryAfter, 10)
            // Validate that it's a positive number
            return parsed > 0 ? parsed : DEFAULT_RETRY_AFTER
          }
        } catch {
          // If extraction fails, return default
          return DEFAULT_RETRY_AFTER
        }
      }
    }
  }

  return DEFAULT_RETRY_AFTER
}

// Type-safe helper to extract operation name
function getOperationName(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  if ('operation' in error) {
    const operation = (error as { operation?: unknown }).operation
    if (
      operation &&
      typeof operation === 'object' &&
      'operationName' in operation
    ) {
      const operationName = (operation as { operationName?: unknown })
        .operationName
      return typeof operationName === 'string' ? operationName : undefined
    }
  }

  return undefined
}

export const GraphQLErrorClassifier = {
  classify(error: ApolloError): AppError {
    // Check for network errors first
    if (error.networkError) {
      if ('statusCode' in error.networkError) {
        const statusCode = error.networkError.statusCode

        switch (statusCode) {
          case 401:
            return new AuthenticationError('Session expired', 'SESSION_EXPIRED')
          case 403:
            return new AuthenticationError('Access denied', 'FORBIDDEN')
          case 429: {
            const retryAfter = getRetryAfterFromNetworkError(error.networkError)
            return new RateLimitError('Too many requests', retryAfter)
          }
          case 500:
          case 502:
          case 503:
            return new NetworkError(
              'Service temporarily unavailable',
              statusCode as number
            )
          default:
            return new NetworkError('Connection failed', statusCode)
        }
      }
      return new NetworkError('Network connection failed')
    }

    // Check GraphQL errors
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const firstError = error.graphQLErrors?.[0]
    if (firstError) {
      const errorCode = firstError.extensions?.['code'] as string
      const errorType = firstError.extensions?.['errorType'] as string

      // Check error code first
      switch (errorCode) {
        case 'UNAUTHENTICATED':
          return new AuthenticationError(firstError.message, errorCode)
        case 'FORBIDDEN':
          return new AuthenticationError(firstError.message, errorCode)
        case 'BAD_USER_INPUT':
        case 'VALIDATION_ERROR': {
          const fields = firstError.extensions?.['fields'] as Record<
            string,
            string
          >
          return new ValidationError(firstError.message, fields)
        }
        case 'RATE_LIMITED': {
          const retryAfterRaw = firstError.extensions?.['retryAfter']
          // Validate and ensure positive number
          const retryAfter =
            typeof retryAfterRaw === 'number' && retryAfterRaw > 0
              ? retryAfterRaw
              : 60
          return new RateLimitError(firstError.message, retryAfter)
        }
      }

      // Check error type
      switch (errorType) {
        case 'WebhookError': {
          const webhookId = firstError.extensions?.['webhookId'] as string
          const webhookUrl = firstError.extensions?.['webhookUrl'] as string
          return new WebhookError(firstError.message, webhookId, webhookUrl)
        }
        case 'ValidationError': {
          const validationFields = firstError.extensions?.['fields'] as Record<
            string,
            string
          >
          return new ValidationError(firstError.message, validationFields)
        }
      }

      // Default to GraphQLError
      return new GraphQLError(firstError.message, getOperationName(error))
    }

    // Fallback to generic error
    return new AppError('An unexpected error occurred', ErrorType.GRAPHQL)
  },
}
