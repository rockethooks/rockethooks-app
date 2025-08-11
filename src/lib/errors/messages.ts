export const errorMessages: Record<string, string> = {
  // Network errors
  'Failed to fetch': 'Connection lost. Please check your internet connection.',
  NetworkError: 'Unable to connect to our servers. Please try again.',
  ECONNREFUSED: 'Cannot reach the server. Please try again later.',
  ETIMEDOUT: 'Request timed out. Please try again.',

  // Auth errors
  'Token expired': 'Your session has expired. Please log in again.',
  Unauthorized: "You don't have permission to perform this action.",
  'Invalid token': 'Authentication failed. Please log in again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',

  // Webhook specific
  'Webhook timeout': 'The webhook endpoint took too long to respond.',
  'Invalid webhook URL':
    'The provided URL is not valid. Please check and try again.',
  'Webhook unreachable':
    'Cannot reach the webhook endpoint. Please verify the URL.',
  'Webhook validation failed': 'The webhook endpoint failed validation.',

  // Rate limiting
  'Rate limit exceeded':
    'Too many requests. Please wait a moment and try again.',
  'Too many requests': "You're making requests too quickly. Please slow down.",

  // Validation
  'Validation failed': 'Please check your input and try again.',
  'Invalid input': 'The provided data is invalid.',

  // Generic
  'Internal server error':
    "Something went wrong on our end. We're working on it.",
  'Bad request': "The request couldn't be processed. Please check your input.",
  'Service unavailable':
    'The service is temporarily unavailable. Please try again later.',
}

export function getUserFriendlyMessage(error: unknown): string {
  const errorString = error?.toString() ?? ''
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const errorMessage = (error as any)?.message ?? ''

  // Check for exact matches first

  if (errorMessages[errorMessage as string]) {
    return (
      errorMessages[errorMessage as string] ??
      'An unexpected error occurred. Please try again.'
    )
  }

  // Check for pattern matches
  for (const [pattern, message] of Object.entries(errorMessages)) {
    if (
      errorString.includes(pattern) ||
      (errorMessage as string).includes(pattern)
    ) {
      return message
    }
  }

  // Default message
  return 'An unexpected error occurred. Please try again.'
}
