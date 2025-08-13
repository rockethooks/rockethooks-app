/**
 * Apollo Client Module Exports
 * Main entry point for Apollo Client configuration
 */

// Export types if needed
export type { TypePolicies } from '@apollo/client';
export { createApolloCache } from './cache';
export {
  createApolloClient,
  getApolloClient,
  resetApolloClient,
} from './client';
export {
  getAppSyncConfig,
  getAwsRegion,
  getEnvironment,
  getGraphqlUrl,
  validateConfig,
} from './config';
export { useApolloClient } from './hooks';
export { ApolloWrapper } from './provider';
