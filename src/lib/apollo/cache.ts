/**
 * Apollo Client InMemoryCache Configuration
 * Defines cache policies and key fields for GraphQL types
 */

import { InMemoryCache, type TypePolicies } from '@apollo/client'

/**
 * Type policies for caching GraphQL types
 */
const typePolicies: TypePolicies = {
  User: {
    keyFields: ['id'],
    fields: {
      // Cache user data for 5 minutes
      createdAt: {
        merge: false,
      },
      updatedAt: {
        merge: false,
      },
    },
  },
  Organization: {
    keyFields: ['id'],
    fields: {
      members: {
        merge: (_, incoming: unknown[] = []) => {
          return incoming
        },
      },
    },
  },
  Webhook: {
    keyFields: ['id'],
    fields: {
      events: {
        merge: (_, incoming: unknown[] = []) => {
          return incoming
        },
      },
    },
  },
  WebhookEvent: {
    keyFields: ['id'],
  },
  // Add more type policies as needed for other GraphQL types
}

/**
 * Create and configure the Apollo InMemoryCache
 */
export const createApolloCache = (): InMemoryCache => {
  return new InMemoryCache({
    typePolicies,
    // Add introspection fragment matcher if needed
    possibleTypes: {},
    // Configure cache persistence if needed in the future
    resultCaching: true,
  })
}
