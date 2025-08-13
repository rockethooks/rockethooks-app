/**
 * Apollo Client Authentication Link
 * Handles JWT token injection from Clerk authentication
 */

import { setContext } from '@apollo/client/link/context';
import { loggers } from '@/utils';

const logger = loggers.auth;

/**
 * Create authentication link that accepts a token getter function
 * This allows for flexible token management with Clerk's useAuth hook
 */
export const createAuthLinkWithTokenGetter = (
  getToken: () => Promise<string | null>
) => {
  return setContext(async (_, { headers }) => {
    try {
      const token = await getToken();

      return {
        headers: {
          ...(headers as Record<string, string>),
          ...(token && { authorization: `Bearer ${token}` }),
        },
      };
    } catch (error) {
      logger.error('Failed to get authentication token:', error);
      return {
        headers: {
          ...(headers as Record<string, string>),
        },
      };
    }
  });
};
