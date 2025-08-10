/**
 * Apollo Client HTTP Link Configuration
 * Configures HTTP transport for GraphQL requests to AWS AppSync
 */

import { createHttpLink } from '@apollo/client/link/http'
import { getGraphqlUrl } from '../config'

/**
 * Create HTTP link for GraphQL requests
 */
export const createAppSyncHttpLink = () => {
  return createHttpLink({
    uri: getGraphqlUrl(),
    // Configure for AWS AppSync
    headers: {
      'Content-Type': 'application/json',
    },
    // Fetch options
    fetchOptions: {
      // Enable credentials for cross-origin requests if needed
      credentials: 'same-origin',
    },
    // Custom fetch implementation if needed
    fetch: (uri, options) => {
      // Add any custom fetch logic here if needed
      // For example, request/response interceptors
      return fetch(uri, options)
    },
  })
}
