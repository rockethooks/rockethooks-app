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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const retryAfter = (error.networkError as any).headers?.get?.(
              'Retry-After'
            )
            return new RateLimitError(
              'Too many requests',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              retryAfter ? parseInt(retryAfter) : 60
            )
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
          const retryAfter = firstError.extensions?.['retryAfter'] as number
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return new RateLimitError(firstError.message, retryAfter ?? 60)
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
      return new GraphQLError(
        firstError.message,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        (error as any).operation?.operationName
      )
    }

    // Fallback to generic error
    return new AppError('An unexpected error occurred', ErrorType.GRAPHQL)
  },
}
