# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive type checking
- **No Unused Variables**: Error on unused variables/parameters (use `_` prefix for ignored)
- **Consistent Type Imports**: Use inline type imports (`import { type ... }`)
- **Exact Optional Properties**: Strict optional property handling
- **No Implicit Returns**: All code paths must return values
- **No Fallthrough Cases**: Switch statements must be exhaustive

## Code Organization
- **Path Aliases**: Use `@/` for src directory imports
- **Component Structure**: Functional components with hooks
- **File Naming**: camelCase for TypeScript files, PascalCase for components
- **Export Style**: Default exports for main components

## React Patterns
- **Hooks**: Use React 19 hooks and patterns
- **State Management**: useState for local state, Apollo Client for server state
- **Event Handlers**: Proper event handling with TypeScript types
- **Component Props**: Strict typing with interfaces

## ESLint Rules
- React Hooks rules enforced
- TypeScript strict type checking
- No misused promises in React components
- React Refresh compatibility for HMR

## File Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```