import type { DevtoolsOptions } from 'zustand/middleware';

/**
 * Shared Redux DevTools configuration for all Zustand stores
 * Uses a single store connection to group all state in one DevTools instance
 */
export const devtoolsConfig: DevtoolsOptions = {
  name: 'RocketHooks Store',
  store: 'rockethooks-store', // Single connection identifier
  serialize: {
    // Ensure complex objects are properly serialized
    options: true,
  },
};

/**
 * Creates devtools options for a specific store with proper naming
 */
export const createDevtoolsConfig = (storeName: string): DevtoolsOptions => ({
  ...devtoolsConfig,
  name: `${devtoolsConfig.name ?? 'RocketHooks Store'} - ${storeName}`,
});
