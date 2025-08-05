# RocketHooks Frontend - Project Overview

## Technology Stack

This React TypeScript application is built using modern frontend technologies:

### Core Technologies
- **React 18** - Component-based UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing

### UI & Styling
- **ShadCN/UI** - High-quality component library built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Tailwind CSS v3** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon library
- **Framer Motion** - Animation library for smooth interactions

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management
- **Apollo Client** - GraphQL client with caching
- **React Hook Form** - Form state management with validation

### Authentication & Integration
- **Clerk React** - Complete authentication solution
- **Apollo Client** - GraphQL API integration
- **Zod** - Schema validation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── onboarding/     # Onboarding flow components
│   ├── organizations/  # Organization management components
│   └── icons/          # Custom icon components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── stores/             # Zustand stores
├── lib/                # Utility functions and configurations
└── graphql/            # GraphQL queries and mutations
```

## Key Features

### Authentication Flow
- **Clerk Integration** - OAuth with Google and GitHub
- **Protected Routes** - Authentication required for dashboard access
- **SSO Callbacks** - Handles authentication redirects
- **User Context** - Global user state management

### Onboarding System
- **Multi-step Flow** - Welcome → Profile → Organization → Preferences → Completion
- **Progress Tracking** - Step-by-step completion status
- **Dynamic Navigation** - Skip/back functionality
- **State Management** - Zustand store for onboarding state

### Organization Management
- **Multi-tenant B2B** - Organization-based access control
- **Role-based Access** - Admin, Member, Viewer roles
- **Team Management** - Invite and manage team members
- **Organization Switching** - Switch between organizations

### Dashboard Features
- **Activity Charts** - Real-time API monitoring visualization
- **API Status** - Health monitoring and status indicators
- **Recent Events** - Live event feed
- **Status Cards** - Key metrics and KPIs

## Development Commands

```bash
# Development server (default port 5173)
npm run dev

# Development server with custom port and host
npm run debug

# Production build
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture Patterns

### Component Organization
- **UI Components** (`components/ui/`) - Base ShadCN components
- **Feature Components** (`components/dashboard/`, `components/onboarding/`) - Feature-specific components
- **Layout Components** (`components/layout.tsx`, `components/header.tsx`) - Application layout
- **Page Components** (`pages/`) - Route-level components

### State Management
- **Zustand** for local application state
- **Apollo Client** for GraphQL server state
- **React Hook Form** for form state
- **Clerk** for authentication state

### Styling System
- **Tailwind CSS** with custom design tokens
- **CSS Variables** for theme support
- **Dark Mode** support with next-themes
- **Responsive Design** with mobile-first approach

## Integration Points

### Backend Communication
- **GraphQL API** via Apollo Client
- **Authentication** via Clerk tokens
- **Real-time Updates** via subscriptions
- **Error Handling** with comprehensive error boundaries

### External Services
- **Clerk** for authentication and user management
- **AWS AppSync** for GraphQL API
- **Lovable** for development tooling