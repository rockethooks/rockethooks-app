# RocketHooks WebApp Project Overview

## Purpose
RocketHooks is a React-based SaaS platform for API monitoring and webhook management with real-time features, OAuth authentication, and organization-based access control.

## Tech Stack
- **Language**: TypeScript 5.7.2 with strict mode enabled
- **Framework**: React 19.0.0 with React Router 7.8.0
- **State Management**: Zustand 5.0.7 with Immer for immutable updates
- **UI Framework**: Tailwind CSS v4.1.11 + ShadCN components
- **GraphQL Client**: Apollo Client 3.13.9
- **Authentication**: Clerk 5.40.0 (OAuth with Google/GitHub)
- **Build Tool**: Vite 6.0.1 with React plugin
- **Package Manager**: Yarn (preferred over npm)
- **Code Quality**: ESLint 9.15.0, Biome 2.1.3, TypeScript strict mode
- **Git Hooks**: Lefthook for pre-commit and pre-push validation
- **Testing**: Playwright for E2E (configured but no unit tests present)
- **Component Development**: Storybook 8.6.14

## Key Features
- OAuth authentication with Clerk
- Organization-based access control
- Real-time features via GraphQL subscriptions
- Multi-step onboarding flow with state machine
- Dark/light theme support
- Component library with Storybook
- Comprehensive error handling
- Performance tracking and logging

## Development Environment
- Node.js project with ESM modules
- Vite dev server with HMR
- TypeScript strict mode with comprehensive checks
- Automated code quality with git hooks
- Environment variables for configuration