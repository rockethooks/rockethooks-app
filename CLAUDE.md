# CLAUDE.md

## 🚨 CRITICAL: Load CLAUDE_CONTEXT.md First
**MANDATORY REQUIREMENT**: Before working with any RocketHooks project, you MUST first read and load the shared development guidelines from:

**`@/Users/adnene/Projects/RocketHooks/specification/CLAUDE_CONTEXT.md`**

This template contains essential shared patterns, standards, and guidelines that apply across ALL RocketHooks services and projects.

---

## Project: RocketHooks WebApp

### Overview
RocketHooks frontend - React-based SaaS platform for API monitoring and webhook management with real-time features, OAuth authentication, and organization-based access control.

## Technology Stack
- **Language**: TypeScript 5.7.2 (strict mode)
- **Framework**: React 19.0.0 with React Router 7.8.0
- **State Management**: Zustand 5.0.7 with Immer
- **UI Framework**: Tailwind CSS v4.1.11 + ShadCN components
- **GraphQL Client**: Apollo Client 3.13.9
- **Authentication**: Clerk 5.40.0 (OAuth with Google/GitHub)
- **Build Tool**: Vite 6.0.1
- **Package Manager**: Yarn
- **Code Quality**: ESLint 9.15.0, Biome 2.1.3
- **Git Hooks**: Lefthook
- **Testing**: Playwright E2E
- **Component Development**: Storybook 8.6.14

## Project Status
**Breaking Changes Policy**: As this is a greenfield project with no production users, feel free to make breaking changes without migration paths or backward compatibility concerns. Prioritize clean architecture over legacy support.

## Project Structure
```
rockethooks-app/
├── .claude/              # Claude-specific configurations
├── .github/              # GitHub workflows and templates
├── .serena/              # Serena MCP configurations
├── .storybook/           # Storybook configuration
├── dist/                 # Production build output
├── docs/                 # Project documentation
│   ├── authentication-flow-guide.md
│   └── legacy-docs/      # Historical documentation
├── logs/                 # Application logs
├── mockups/              # UI mockups and designs
├── node_modules/         # Dependencies
├── public/               # Static assets
└── src/                  # Source code
    ├── components/       # React components
    │   ├── auth/        # Authentication components
    │   ├── onboarding/  # Onboarding flow components
    │   ├── rockethooks/ # Domain-specific components
    │   └── ui/          # ShadCN UI components
    ├── config/          # Application configuration
    ├── hooks/           # Custom React hooks
    ├── layouts/         # Page layouts
    ├── lib/             # Utility libraries
    ├── pages/           # Route pages/views
    ├── providers/       # React context providers
    ├── router/          # React Router configuration
    ├── services/        # API and external services
    ├── shared/          # Shared utilities
    ├── store/           # Zustand state stores
    │   ├── app.store.ts
    │   ├── auth.store.ts
    │   └── onboarding/  # Onboarding state machine
    ├── stories/         # Storybook stories
    ├── styles/          # Global styles
    ├── types/           # TypeScript type definitions
    └── utils/           # Utility functions
```

## Key Conventions

### Code Style
- **File Naming**:
  - React Components: PascalCase (e.g., `UserNav.tsx`, `DashboardLayout.tsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useOnboarding.ts`)
  - Context Files: PascalCase (e.g., `AuthContext.tsx`)
  - Utilities: camelCase (e.g., `formatDate.ts`, `generateId.ts`)
  - Styles: kebab-case (e.g., `themes.css`, `index.css`)
  - Tests: Component name + `.test.tsx` or `.spec.tsx`
  - Stories: Component name + `.stories.tsx`
  - Index files: lowercase `index.ts` or `index.tsx`

- **Import Patterns**:
  - Use `@/` alias for src imports: `import { Button } from '@/components/ui/button'`
  - Group imports: external libs → internal modules → relative paths
  - Prefer named exports over default exports

- **TypeScript Conventions**:
  - Interfaces for object shapes, types for unions/primitives
  - Explicit return types for functions
  - No implicit any, unused variables, or unreachable code

### Component Architecture
- **ShadCN Components**: Pre-built UI components in `src/components/ui/`
- **Domain Components**: Business logic components in `src/components/rockethooks/`
- **Form Handling**: React Hook Form with Zod validation

## Development Commands
```bash
# Install dependencies
yarn install

# Run development server (port 3000)
yarn dev

# Run development server on port 8080 (for testing)
yarn debug

# Build for production
yarn build

# Type checking
yarn type-check

# Linting and formatting
yarn lint          # Run ESLint
yarn lint:fix      # Fix ESLint issues
yarn format        # Format with Biome
yarn check         # Run Biome checks
yarn check:fix     # Fix Biome issues

# Quality check (runs type-check, biome, and eslint)
yarn quality

# Preview production build
yarn preview

# Storybook
yarn storybook       # Run Storybook dev server
yarn build-storybook # Build Storybook
```

## Environment Setup

### Required Environment Variables
Create `.env` from `.env.example` with the following variables:
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication key
- `VITE_APPSYNC_GRAPHQL_URL`: GraphQL API endpoint
- `VITE_APPSYNC_WEBSOCKET_URL`: WebSocket URL for subscriptions

### Configuration Files
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `biome.json`: Biome formatter and linter settings
- `eslint.config.js`: ESLint rules and plugins
- `lefthook.yml`: Git hooks configuration
- `postcss.config.js`: PostCSS configuration for Tailwind
- `components.json`: ShadCN components configuration

## Git Workflow

### Branch Strategy
- Feature branches: `feature/state-machine-components`
- Main branch for production
- Use conventional commits

### Commit Conventions
Enforced by Lefthook commit-msg hook:
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- Example: `feat(auth): add OAuth login with GitHub`
- Include issue number: `fix(onboarding): resolve draft persistence #63`

### Git Hooks (Lefthook)
**Pre-commit**:
- TypeScript type checking
- Biome formatting and linting
- ESLint with auto-fix
- Stages fixed files automatically

**Pre-push**:
- Full type check
- Production build test
- Complete linting
- Security audit (moderate level)

## Testing Infrastructure

### End-to-End Testing with Playwright
- **Setup**: `yarn test:e2e:install` (install browsers)
- **Run Server**: `yarn debug` (port 8080 for testing)
- **Test Coverage**:
  - Authentication flows (OAuth, demo access)
  - Onboarding process (multi-step forms)
  - Error handling (GraphQL, network failures)
  - Critical bug fixes (#35, #36, #37)

### Testing Guidelines
- Use Playwright MCP for UI testing and validation
- Run server in parallel mode during tests
- Ensure server is stopped after test completion
- No unit tests currently implemented

## Important Patterns

### Authentication Flow
- Clerk handles OAuth with Google/GitHub
- Protected routes via `ProtectedRoute` component
- Public routes via `PublicRoute` component
- User context available through Clerk hooks
- Organization-based access control

### State Management
- **Zustand Stores**: Located in `src/store/` with separate stores for auth, app, and onboarding
- **React Context**: For component tree state sharing  
- **Immer Integration**: Enables immutable state updates
- **Redux DevTools**: Integration for debugging

### Error Handling
- Apollo Client error policy: `'all'`
- Error boundaries for component failures
- GraphQL error handling in mutations
- Network failure recovery
- Toast notifications for user feedback

### API Integration
- **GraphQL Endpoint**: `process.env.VITE_APPSYNC_GRAPHQL_URL`
- **Apollo Client** for GraphQL operations
- **WebSocket URL**: For real-time subscriptions
- **Backend Location**: `/Users/adnene/Projects/RocketHooks/services/api-service`

## Security Considerations
- Never commit `.env` files
- Use environment variables for secrets
- Clerk handles authentication security
- Input validation with Zod schemas
- HTTPS only in production
- No `--no-verify` flag when pushing code

## CSS and Styling

### Tailwind CSS v4
**CRITICAL**: Project uses Tailwind CSS v4.1.11
- **DO NOT** use v3 configuration patterns
- All styling must be v4 compatible
- Use Tailwind Vite plugin for processing

### ShadCN Components
- Pre-configured UI components in `@/components/ui/`
- Use ShadCN MCP for component management
- Consistent theming with CSS variables
- Dark mode support via next-themes

## MCP Tools Integration
- **Serena MCP**: For codebase analysis and memory
- **ShadCN MCP**: For UI component management
- **Context7 MCP**: For library documentation
- **Playwright MCP**: For E2E testing
- **DynamoDB MCP**: For database operations

## Logging Guidelines

### Professional Logging System
The project uses a professional logging utility with automatic production optimization.

#### Logger Usage
```typescript
import { logger, loggers } from '@/utils';

// Basic logging
logger.info('Application started');
logger.error('Failed to load data', error);

// Namespaced loggers for different modules
loggers.onboarding.debug('State transition', { from, to });
loggers.auth.success('User authenticated');
loggers.api.warn('Rate limit approaching');
loggers.graphql.error('Query failed', error);

// Performance tracking
const syncResult = logger.measure('expensive-operation', () => {
  return performExpensiveOperation();
});

const { result: asyncResult, measurement } = await logger.measureAsync('api-call', async () => {
  return await fetchData();
});

// Child loggers for components
const componentLogger = loggers.ui.child('Button');
componentLogger.debug('Rendered with props:', props);
```

#### Available Namespaced Loggers
- `loggers.onboarding` - Onboarding flow and state machine
- `loggers.auth` - Authentication and authorization
- `loggers.api` - API calls and responses
- `loggers.graphql` - GraphQL queries and mutations
- `loggers.store` - State management
- `loggers.router` - Routing and navigation
- `loggers.ui` - UI components and interactions
- `loggers.performance` - Performance monitoring
- `loggers.validation` - Form and data validation
- `loggers.dev` - Development utilities
- `loggers.debug` - Debug-specific logging

#### Log Levels
- `debug` - Detailed debugging information (dev only)
- `info` - General informational messages
- `success` - Success confirmations
- `warn` - Warning messages (preserved in production)
- `error` - Error messages (preserved in production)

#### Production Behavior
- Console.log and console.debug are automatically removed in production builds
- Console.error and console.warn are preserved for critical issues
- Production logging can be enabled via localStorage: `enableDebugLogging()`
- All sensitive data is automatically sanitized (passwords, tokens, keys)

#### Logger Testing
```bash
yarn test:unit         # Run logger unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report
```

## Common Issues & Solutions
- **Port conflicts**: Use `yarn debug` for port 8080
- **Auth issues**: Check `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- **GraphQL errors**: Verify token in network requests
- **Build errors**: Run `npx tsc --noEmit` for TypeScript issues
- **CSS failures**: Ensure Tailwind v4 compatibility

## Deployment
- Build: `yarn build` creates production bundle in `dist/`
- Target: ES2022 for modern browsers
- Source maps enabled for debugging
- Static hosting compatible

## Performance Optimizations
- Code splitting with React.lazy
- Route-based code splitting
- Optimized bundle size with Vite
- Tree shaking for unused code

## Additional Notes

### React Development
- Prevent infinite re-renders in hooks/useEffect
- Always fix TypeScript errors (even non-blocking)
- Use React 19 features appropriately

### GraphQL Development
- Check backend implementation in `/Users/adnene/Projects/RocketHooks/services/api-service`
- Use Apollo Client error handling
- Implement optimistic updates where appropriate

## Code Quality & Documentation

### Code Quality Requirements
- Must pass `yarn quality` before committing (runs type-check, biome, and eslint)
- No TypeScript errors allowed
- Follow ESLint and Biome rules
- Maintain consistent code style
- Always fix linting errors before pushing

### Documentation
- Keep docs up-to-date with code changes
- Use Context7 MCP for library usage guidance
- Available in `docs/` directory:
  - `authentication-flow-guide.md` - Authentication flows, route guards, and user journey
  - `legacy-docs/` - Historical documentation (no longer maintained)

## GitHub Repository
- Repository: [rockethooks/rockethooks-app](https://github.com/rockethooks/rockethooks-app)
- Use conventional commits with issue numbers

## Best Practices
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Internationalization Ready**: Strings are externalized and ready for i18n
- **State Machine Patterns**: Proper use of state machine with guards and actions
- **Development Experience**: Excellent logging and DevTools integration
