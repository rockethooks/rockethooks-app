/**
 * Apollo Client Factory
 * Creates and configures Apollo Client instance with all required links
 */

import { ApolloClient, from } from '@apollo/client'
import { createApolloCache } from './cache'
import { validateConfig } from './config'
import { createAuthLinkWithTokenGetter } from './links/auth'
import { createErrorLink, createRetryLink } from './links/error'
import { createAppSyncHttpLink } from './links/http'

/**
 * Create Apollo Client instance with all configured links
 */
export const createApolloClient = (
  getToken: () => Promise<string | null>
): ApolloClient<unknown> => {
  // Validate configuration before creating client
  validateConfig()

  // Create all the links
  const authLink = createAuthLinkWithTokenGetter(getToken)
  const errorLink = createErrorLink()
  const retryLink = createRetryLink()
  const httpLink = createAppSyncHttpLink()

  // Create the cache
  const cache = createApolloCache()

  // Combine links in the correct order
  // Order matters: auth -> error -> retry -> http
  const link = from([authLink, errorLink, retryLink, httpLink])

  return new ApolloClient({
    link,
    cache,
    // Use network-only fetch policy for MVP simplicity
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all', // Return both data and errors
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    // Enable development tools in development
    connectToDevTools: import.meta.env.DEV,
  })
}

/**
 * Singleton Apollo Client instance
 * This will be created once and reused throughout the app
 */
let apolloClientInstance: ApolloClient<unknown> | null = null

/**
 * Get or create the Apollo Client instance
 */
export const getApolloClient = (
  getToken: () => Promise<string | null>
): ApolloClient<unknown> => {
  apolloClientInstance ??= createApolloClient(getToken)
  return apolloClientInstance
}

/**
 * Reset the Apollo Client instance
 * Useful for testing or when switching authentication contexts
 */
export const resetApolloClient = (): void => {
  apolloClientInstance = null
}
