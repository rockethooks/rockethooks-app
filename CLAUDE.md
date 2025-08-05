# CLAUDE.md

## 🚨 CRITICAL: Load CLAUDE-TEMPLATE.md First
**MANDATORY REQUIREMENT**: Before working with any RocketHooks project, you MUST first read and load the shared development guidelines from:

**`/Users/adnene/Projects/RocketHooks/specification/CLAUDE_CONTEXT.md`**

This template contains essential shared patterns, standards, and guidelines that apply across ALL RocketHooks services and projects.
Reading this file first ensures consistency and prevents duplication of common patterns.
---

## Project Overview

RocketHooks frontend - React-based SaaS platform for API monitoring and webhook management.

**Architecture**: GraphQL APIs with Clerk authentication and Apollo Client for real-time features.

## Github Repository
- [RocketHooks Frontend Webapp](https://github.com/rockethooks/rockethooks-app)


## Authentication Integration

### Clerk Setup

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

All ShadCN components available via `@/components/ui/`:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

## Styling Guidelines

- Use Tailwind utility classes
- Mobile-first responsive design
- Primary color: Indigo Blue (#6366f1)
- Font: Inter family

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

### General Documentation
- `legacy-docs/` - Folder containing legacy documentation, which is no longer maintained but may contain useful information

## Important Notes

- **Error Handling**: Always implement error boundaries and graceful failures
- **GraphQL**: Use Apollo Client error policy `'all'` for comprehensive error handling
- **Playwright**: Use Playwright MCP for UI testing, validation and debugging
- Before using Playwright MCP, make sure that server is running on port 8080, otherwise, you can use `yarn dev` to start the server on a custom port.
- If you start a server on a custom port, make sure to do it in parallel
- If you started the server on a custom port, make sure it's stopped when your task is done
- **Documentation**: Keep all documentation up-to-date with code changes
- When you add a document in `docs/`, ensure it is linked in section `## Reference Documentation` above.

## Playwright MCP Specific Notes
- When running Playwright MCP, make sure that server is not already started before starting a new one.
- **Parallel Server Management**: When running Playwright MCP, ensure to:
  - Run the server in parallel mode
  - Turn off the server once the task is completed

IMPORTANT: Always use web fetch tool to read Clerk documentation when implementing authentication features: <https://clerk.com/docs/quickstarts/react>

## Library Usage Guidelines

- When using any library in the project, make sure to use Context7 MCP to check if any information is available about the library and see how to use the library

## GraphQL Development Notes

- **Backend GraphQL Implementation Check**: To check if a GraphQL mutation or query is implemented on the backend refer to project `/Users/adnene/Projects/RocketHooks/services/api-service`

## React Development Notes

- When creating or editing hooks, useEffect, or any other React features make sure the dependency can not cause infinite re-renders
