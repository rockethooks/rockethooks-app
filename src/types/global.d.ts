/// <reference types="vite/client" />

declare global {
  // Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APPSYNC_GRAPHQL_URL: string;
    readonly VITE_GRAPHQL_URL: string; // For backward compatibility
    readonly VITE_ENVIRONMENT: string;
    readonly VITE_AWS_REGION: string;
    readonly VITE_WS_URL: string;
    readonly VITE_CLERK_PUBLISHABLE_KEY: string;
    readonly VITE_CLERK_SIGN_IN_URL: string;
    readonly VITE_CLERK_AFTER_SIGN_IN_URL: string;
    readonly VITE_CLERK_AFTER_SIGN_UP_URL: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_DEBUG: string;
    readonly VITE_PUBLIC_URL: string;
    readonly VITE_DEMO_EMAIL: string;
    readonly VITE_DEMO_PASSWORD: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
