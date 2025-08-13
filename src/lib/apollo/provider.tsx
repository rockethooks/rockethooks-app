/**
 * Apollo Provider with Clerk Integration
 * Wraps the app with Apollo Provider and integrates with Clerk authentication
 */

import { ApolloProvider } from '@apollo/client';
import { useAuth } from '@clerk/clerk-react';
import type React from 'react';
import { useMemo } from 'react';
import { loggers } from '@/utils';

const logger = loggers.auth;

import { getApolloClient } from './client';

interface ApolloWrapperProps {
  children: React.ReactNode;
}

/**
 * Apollo Provider wrapper that integrates with Clerk authentication
 */
export function ApolloWrapper({ children }: ApolloWrapperProps) {
  const { getToken } = useAuth();

  // Create Apollo Client with Clerk token getter
  const apolloClient = useMemo(() => {
    return getApolloClient(async () => {
      try {
        // Get JWT token using Clerk's getToken method with the AppSync template
        return await getToken({ template: '1day-template' });
      } catch (error) {
        logger.error('Failed to get Clerk token:', error);
        return null;
      }
    });
  }, [getToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
