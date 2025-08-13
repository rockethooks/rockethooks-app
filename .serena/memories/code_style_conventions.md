# Code Style and Conventions

## File Naming Conventions
- **React Components**: PascalCase (e.g., `UserNav.tsx`, `DashboardLayout.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useOnboarding.ts`)
- **Context Files**: PascalCase (e.g., `AuthContext.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `generateId.ts`)
- **Styles**: kebab-case (e.g., `themes.css`, `index.css`)
- **Tests**: Component name + `.test.tsx` or `.spec.tsx`
- **Stories**: Component name + `.stories.tsx`
- **Index files**: lowercase `index.ts` or `index.tsx`

## Import Patterns
- Use `@/` alias for src imports: `import { Button } from '@/components/ui/button'`
- Group imports: external libs → internal modules → relative paths
- Prefer named exports over default exports

## TypeScript Conventions
- **Strict Mode**: All strict checks enabled
- **Interfaces vs Types**: Interfaces for object shapes, types for unions/primitives
- **Return Types**: Explicit return types for functions
- **No Implicit Any**: Forbidden, explicit types required
- **Unused Variables**: Not allowed, enforced by linter

## Code Formatting (Biome)
- **Indentation**: 2 spaces
- **Line Width**: 80 characters
- **Quote Style**: Single quotes
- **Semicolons**: Always required
- **Trailing Commas**: ES5 style
- **Import Organization**: Automatic

## Component Architecture
- **ShadCN Components**: Pre-built UI components in `src/components/ui/`
- **Domain Components**: Business logic components in `src/components/rockethooks/`
- **Form Handling**: React Hook Form with Zod validation
- **Error Boundaries**: Implement graceful error handling

## State Management Patterns
- **Zustand Stores**: Located in `src/store/`
- **Immer Integration**: Used for immutable state updates
- **Store Pattern**: Separate stores for different domains (auth, app, onboarding)
- **DevTools**: Redux DevTools integration for debugging

## Commit Message Format
- **Format**: `type(scope): description`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- **Example**: `feat(auth): add OAuth login with GitHub`
- **Issue Reference**: Include issue number `#63` when applicable