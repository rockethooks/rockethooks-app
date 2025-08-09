# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled with all strict checks
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **Path Aliases**: `@/*` maps to `./src/*`
- **No unused locals/parameters**
- **No implicit returns**
- **Force consistent casing**

## File Naming Conventions
- **React Components**: PascalCase (e.g., `AuthCallback.tsx`, `UserNav.tsx`)
- **Custom Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Context Files**: PascalCase (e.g., `AuthContext.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Style Files**: kebab-case (e.g., `themes.css`)
- **Test Files**: `Component.test.tsx` or `Component.spec.tsx`
- **Story Files**: `Component.stories.tsx`
- **Index Files**: lowercase `index.ts` or `index.tsx`

## Code Formatting (Biome)
- **Indent**: 2 spaces
- **Line Width**: 80 characters
- **Quotes**: Single quotes for JavaScript/TypeScript
- **Trailing Commas**: ES5 style
- **Semicolons**: As needed (ASI)
- **Import Organization**: Automatic with Biome

## Component Structure
```typescript
// Import order (auto-organized by Biome)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from './types'

// Component definition
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState()
  
  // Event handlers
  const handleClick = () => {}
  
  // Render
  return <div>...</div>
}
```

## Styling Guidelines
- **Framework**: Tailwind CSS v4 (NOT v3!)
- **Components**: ShadCN UI components
- **Approach**: Mobile-first responsive design
- **Primary Color**: Indigo Blue (#6366f1)
- **Font**: Inter family
- **Classes**: Use Tailwind utility classes
- **Custom Styles**: Avoid inline styles

## React Best Practices
- **Hooks**: Ensure proper dependencies to avoid infinite re-renders
- **Error Boundaries**: Implement for graceful failures
- **TypeScript**: Always fix TypeScript errors
- **Components**: Prefer function components with hooks
- **Props**: Use proper TypeScript interfaces/types
- **State**: Use Zustand for global state

## GraphQL/Apollo
- **Error Policy**: Use 'all' for comprehensive error handling
- **Queries**: Define in separate .graphql files or constants
- **Types**: Generate from GraphQL schema when possible

## Import Guidelines
```typescript
// Use path aliases
import { Component } from '@/components/Component'
// NOT: import { Component } from '../../../components/Component'

// Group imports logically
// 1. React/external libraries
// 2. Internal components
// 3. Utils/helpers
// 4. Types
// 5. Styles
```

## Git Commit Conventions
- Use conventional commits (feat:, fix:, chore:, etc.)
- Never use `--no-verify` flag
- Fix all linting errors before committing
- Lefthook runs pre-commit checks automatically