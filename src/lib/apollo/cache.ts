/**
 * Apollo Client InMemoryCache Configuration
 * Defines cache policies and key fields for GraphQL types
 */

import { InMemoryCache, type TypePolicies } from '@apollo/client';

// Type definitions for GraphQL entities
interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface WebhookEvent {
  id: string;
  webhookId: string;
  status: string;
  payload: Record<string, unknown>;
  response?: Record<string, unknown>;
  createdAt: string;
}

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
        merge: (_, incoming: Member[] = []) => {
          return incoming;
        },
      },
    },
  },
  Webhook: {
    keyFields: ['id'],
    fields: {
      events: {
        merge: (_, incoming: WebhookEvent[] = []) => {
          return incoming;
        },
      },
    },
  },
  WebhookEvent: {
    keyFields: ['id'],
  },
  // Add more type policies as needed for other GraphQL types
};

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
  });
};
