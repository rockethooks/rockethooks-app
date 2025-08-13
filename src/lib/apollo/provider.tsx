/**
 * Apollo Provider with Clerk Integration
 * Wraps the app with Apollo Provider and integrates with Clerk authentication
 */

import { ApolloProvider } from '@apollo/client';
import { useAuth } from '@clerk/clerk-react';
import type React from 'react';
import { useMemo } from 'react';
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
    const tokenGetter = async () => {
      try {
        // Get JWT token using Clerk's getToken method with the AppSync template
        const token = await getToken({ template: '1day-template' });
        return token;
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
        return null;
      }
    };

    return getApolloClient(tokenGetter);
  }, [getToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
