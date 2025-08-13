# CLAUDE.md

## 🚨 CRITICAL: Load CLAUDE_CONTEXT.md First
**MANDATORY REQUIREMENT**: Before working with any RocketHooks project, you MUST first read and load the shared development guidelines from:

**`@/Users/adnene/Projects/RocketHooks/specification/CLAUDE_CONTEXT.md`**

This template contains essential shared patterns, standards, and guidelines that apply across ALL RocketHooks services and projects.
Reading this file first ensures consistency and prevents duplication of common patterns.
---

## Project Overview

RocketHooks frontend - React-based SaaS platform for API monitoring and webhook management.

**Architecture**: GraphQL APIs with Clerk authentication and Apollo Client for real-time features.
** CSS ** Tailwind v4 for styling, ShadCN components for UI consistency, use Context7 MCP and Shadcn MCP before making any change.
The project had Tailwind CSS v4.1.11 installed DO NEVER USE v3 configuration patterns, this will cause a complete CSS failure.

## Github Repository
- [RocketHooks Frontend Webapp](https://github.com/rockethooks/rockethooks-app)
- NEVER use `--no-verify` when pushing code, always fix linting errors before pushing code to the repository.


## Authentication Integration

### Clerk Setup
**IMPORTANT**: Always use web fetch tool to read Clerk documentation when implementing authentication features: [Clerk React documentation](https://clerk.com/docs/quickstarts/react)

- OAuth with Google and GitHub
- User context and protected routes
- Organization-based access control

## Backend Integration

- **GraphQL Endpoint**: `process.env.VITE_GRAPHQL_URL`
- **Backend Location**: `/Users/adnene/Projects/RocketHooks/03_Back/rockethooks-api-service`
- **Data Models**: `/Users/adnene/Projects/RocketHooks/03_Back/data-model`

## Common Issues & Solutions

- **Port conflicts**: Use `npm run debug` for port 8080
- **Auth issues**: Check VITE_CLERK_PUBLISHABLE_KEY in .env
- **GraphQL errors**: Verify token in network requests
- **Build errors**: Run `npx tsc --noEmit` for TypeScript issues

## UI Components

- All ShadCN components available via `@/components/ui/`:
- Use Shardcn MCP when working with ShadCN components.

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

## Testing Infrastructure

### End-to-End Testing with Playwright

The project uses Playwright for comprehensive E2E testing covering authentication flows, onboarding processes, and error handling scenarios.

#### Test Coverage

- **Authentication Flow**: OAuth login, demo access, session persistence
- **Onboarding Process**: Multi-step form flows, draft saving/restoration
- **Error Handling**: GraphQL errors, network failures, validation errors
- **Edge Cases**: Browser compatibility, concurrent sessions, performance
- **Critical Bugs**: Coverage for bugs #35, #36, #37

#### Test Environment Setup

1. **Start server**: `yarn debug` (runs on port 8080 for testing)
2. **Environment**: Copy `.env.example` to `.env` with required keys
3. **Browser Installation**: `yarn test:e2e:install`

## Reference Documentation

Detailed documentation available in `docs/` directory:

### Authentication & Security
- `authentication-flow-guide.md` - Complete guide to authentication flows, route guards, and user journey

### General Documentation
- `legacy-docs/` - Folder containing legacy documentation, which is no longer maintained but may contain useful information

## Important Notes
- **Coding Style**: Always read @eslint.config.js, @tsconfig.json, and @biome.json before starting any coding task.
- **Error Handling**: Always implement error boundaries and graceful failures
- **GraphQL**: Use Apollo Client error policy `'all'` for comprehensive error handling
- **Playwright**: Use Playwright MCP for UI testing, validation and debugging
- **Documentation**: Keep all documentation up-to-date with code changes
- When you add a document in `docs/`, ensure it is linked in section `## Reference Documentation` above.

## Playwright MCP Specific Notes
- When running Playwright MCP, make sure that server is not already started before starting a new one.
- **Parallel Server Management**: When running Playwright MCP, ensure to:
- Run the server in parallel mode
- Turn off the server once the task is completed



## Library Usage Guidelines

- When using any library in the project, make sure to use Context7 MCP to check if any information is available about the library and see how to use the library

## GraphQL Development Notes

- **Backend GraphQL Implementation Check**: To check if a GraphQL mutation or query is implemented on the backend refer to project `/Users/adnene/Projects/RocketHooks/services/api-service`

## React Development Notes

- When creating or editing hooks, useEffect, or any other React features make sure the dependency can not cause infinite re-renders
- Always fix typescript errors even if they are not blocking

## File Naming Conventions

- **React Components**: Use PascalCase for all component files (e.g., `AuthCallback.tsx`, `DashboardLayout.tsx`, `UserNav.tsx`)
- **Hooks**: Use camelCase for custom hooks (e.g., `useAuth.ts`, `useOnboarding.ts`)
- **Context Files**: Use PascalCase for context files (e.g., `AuthContext.tsx`, `OnboardingContext.tsx`)
- **Non-component TypeScript/JavaScript**: Use camelCase for utility functions and non-component files (e.g., `formatDate.ts`, `generateId.ts`)
- **Style Files**: Use kebab-case for CSS files (e.g., `themes.css`, `index.css`)
- **Test Files**: Match the component name with `.test.tsx` or `.spec.tsx` suffix
- **Story Files**: Use PascalCase matching the component name with `.stories.tsx` suffix (e.g., `Button.stories.tsx`)
- **Index Files**: Always use lowercase `index.ts` or `index.tsx`
- Whenever you change a css make sure it's compatible with Tailwind v4 and ShadCN components
