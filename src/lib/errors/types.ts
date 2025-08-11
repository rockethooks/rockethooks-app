// List of sensitive field names to sanitize
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'secret',
  'authorization',
  'creditCard',
  'ssn',
  'socialSecurityNumber',
  'sessionId',
  'refreshToken',
  'accessToken',
  'privateKey',
  'clientSecret',
]

// Sanitize error context to remove sensitive data
function sanitizeContext(context: unknown): unknown {
  if (!context || typeof context !== 'object') {
    return context
  }

  if (Array.isArray(context)) {
    return context.map((item) => sanitizeContext(item))
  }

  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(context)) {
    // Check if field name contains sensitive keywords (case-insensitive)
    const lowerKey = key.toLowerCase()
    const isSensitive = SENSITIVE_FIELDS.some((field) =>
      lowerKey.includes(field.toLowerCase())
    )

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeContext(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

// Base error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly timestamp: Date
  public readonly context: Record<string, unknown> | undefined

  constructor(
    message: string,
    type: ErrorType,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    this.type = type
    this.timestamp = new Date()
    // Sanitize context to prevent sensitive data exposure
    this.context = context
      ? (sanitizeContext(context) as Record<string, unknown>)
      : undefined
  }
}

// Network connection errors
export class NetworkError extends AppError {
  public readonly statusCode: number | undefined

  constructor(
    message: string,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.NETWORK, context)
    this.statusCode = statusCode
  }
}

// Authentication/authorization errors
export class AuthenticationError extends AppError {
  public readonly code: string | undefined

  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.AUTH, context)
    this.code = code
  }
}

// Form validation errors
export class ValidationError extends AppError {
  public readonly fields: Record<string, string> | undefined

  constructor(
    message: string,
    fields?: Record<string, string>,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.VALIDATION, context)
    this.fields = fields
  }
}

// Webhook-specific errors
export class WebhookError extends AppError {
  public readonly webhookId: string | undefined
  public readonly webhookUrl: string | undefined

  constructor(
    message: string,
    webhookId?: string,
    webhookUrl?: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.WEBHOOK, context)
    this.webhookId = webhookId
    this.webhookUrl = webhookUrl
  }
}

// Generic GraphQL errors
export class GraphQLError extends AppError {
  public readonly operation: string | undefined

  constructor(
    message: string,
    operation?: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.GRAPHQL, context)
    this.operation = operation
  }
}

// Rate limit errors (extends NetworkError)
export class RateLimitError extends NetworkError {
  public readonly retryAfter: number | undefined

  constructor(
    message: string,
    retryAfter?: number,
    context?: Record<string, unknown>
  ) {
    super(message, 429, context)
    this.retryAfter = retryAfter
  }
}

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  WEBHOOK = 'WEBHOOK',
  GRAPHQL = 'GRAPHQL',
  RATE_LIMIT = 'RATE_LIMIT',
}
