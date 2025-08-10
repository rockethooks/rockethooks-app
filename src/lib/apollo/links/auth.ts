/**
 * Apollo Client Authentication Link
 * Handles JWT token injection from Clerk authentication
 */

import { setContext } from '@apollo/client/link/context'

/**
 * Create authentication link that adds JWT token to requests
 * Uses Clerk's getToken() method to fetch fresh JWT for each request
 */
export const createAuthLink = () => {
  return setContext(async (_, { headers }) => {
    try {
      // Get the auth context - this will be available in the React component tree
      // We'll use a different approach since we can't use hooks directly in the link
      const token = await getClerkJWT()

      return {
        headers: {
          ...(headers as Record<string, string>),
          ...(token && { authorization: `Bearer ${token}` }),
        },
      }
    } catch (error) {
      console.error('Failed to get authentication token:', error)
      return {
        headers: {
          ...(headers as Record<string, string>),
        },
      }
    }
  })
}

interface ClerkWindow {
  __clerk_frontend_api?: {
    session?: {
      getToken: (options: { template: string }) => Promise<string>
    }
  }
  Clerk?: {
    session?: {
      getToken: (options: { template: string }) => Promise<string>
    }
  }
}

/**
 * Get JWT token from Clerk
 * This function will be called by the auth link to get fresh tokens
 */
const getClerkJWT = async (): Promise<string | null> => {
  try {
    // Access the Clerk instance from the global window object
    // This is available after ClerkProvider is mounted
    const clerkWindow = window as ClerkWindow
    const clerk = clerkWindow.__clerk_frontend_api ?? clerkWindow.Clerk

    if (!clerk?.session) {
      return null
    }

    // Get the JWT token with the AppSync template
    const token = await clerk.session.getToken({
      template: '1day-template', // Use the JWT template configured in Clerk
    })

    return token
  } catch (error) {
    console.error('Error getting Clerk JWT:', error)
    return null
  }
}

/**
 * Alternative auth link factory that accepts a token getter function
 * This allows for more flexible token management
 */
export const createAuthLinkWithTokenGetter = (
  getToken: () => Promise<string | null>
) => {
  return setContext(async (_, { headers }) => {
    try {
      const token = await getToken()

      return {
        headers: {
          ...(headers as Record<string, string>),
          ...(token && { authorization: `Bearer ${token}` }),
        },
      }
    } catch (error) {
      console.error('Failed to get authentication token:', error)
      return {
        headers: {
          ...(headers as Record<string, string>),
        },
      }
    }
  })
}
