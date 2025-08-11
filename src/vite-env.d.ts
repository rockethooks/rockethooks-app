/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPSYNC_GRAPHQL_URL: string
  readonly VITE_GRAPHQL_URL?: string // For backward compatibility
  readonly VITE_ENVIRONMENT?: string
  readonly VITE_AWS_REGION?: string
  readonly VITE_WS_URL?: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_CLERK_SIGN_IN_URL?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG?: string
  readonly VITE_PUBLIC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
