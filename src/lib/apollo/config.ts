/**
 * Apollo Client Configuration
 * Environment-specific configuration for AWS AppSync GraphQL endpoints
 */

interface AppSyncConfig {
  graphqlUrl: string
  region: string
  environment: string
}

type Environment = 'local' | 'sandbox' | 'staging' | 'production'

/**
 * Get the current environment from environment variables
 */
export const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_ENVIRONMENT as Environment | undefined
  return env ?? 'local'
}

/**
 * Get the AWS region from environment variables
 */
export const getAwsRegion = (): string => {
  return import.meta.env.VITE_AWS_REGION ?? 'us-east-1'
}

/**
 * Get the GraphQL endpoint URL
 * Checks for both VITE_APPSYNC_GRAPHQL_URL and VITE_GRAPHQL_URL for backward compatibility
 */
export const getGraphqlUrl = (): string => {
  const url =
    import.meta.env.VITE_APPSYNC_GRAPHQL_URL || import.meta.env.VITE_GRAPHQL_URL
  if (!url) {
    console.warn(
      'VITE_APPSYNC_GRAPHQL_URL or VITE_GRAPHQL_URL not found, falling back to localhost'
    )
    return 'http://localhost:4000/graphql'
  }
  return url
}

/**
 * Get the complete AppSync configuration
 */
export const getAppSyncConfig = (): AppSyncConfig => {
  return {
    graphqlUrl: getGraphqlUrl(),
    region: getAwsRegion(),
    environment: getEnvironment(),
  }
}

/**
 * Validate that all required environment variables are present
 */
export const validateConfig = (): void => {
  const config = getAppSyncConfig()

  if (!config.graphqlUrl) {
    throw new Error('VITE_APPSYNC_GRAPHQL_URL is required')
  }

  if (!config.region) {
    throw new Error('VITE_AWS_REGION is required')
  }

  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required for authentication')
  }
}
