# RocketHooks Frontend - Project Overview

## Purpose
RocketHooks is a React-based SaaS platform for API monitoring and webhook management. It provides real-time monitoring, webhook handling, and comprehensive API management features for developers and teams.

## Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS v4.1.11 (CRITICAL: Not v3!)
- **UI Components**: ShadCN/UI components library
- **State Management**: Zustand 5.0
- **Routing**: React Router DOM 7.8
- **Authentication**: Clerk (OAuth with Google/GitHub)
- **API Client**: Apollo Client 3.13 with GraphQL
- **Forms**: React Hook Form 7.62 with Zod validation
- **Testing**: Playwright for E2E testing
- **Component Development**: Storybook 8.6

## Architecture
- GraphQL APIs with real-time capabilities via Apollo Client
- Clerk authentication with OAuth providers
- Component-based architecture with ShadCN UI system
- Mobile-first responsive design
- Path aliases using `@/*` for src imports

## Key Features
- API monitoring and webhook management
- Real-time data updates via GraphQL subscriptions
- OAuth authentication (Google, GitHub)
- Organization-based access control
- Multi-step onboarding process
- Dashboard with analytics

## Related Projects
- Backend API: `/Users/adnene/Projects/RocketHooks/services/api-service`
- Data Models: `/Users/adnene/Projects/RocketHooks/03_Back/data-model`
- GitHub Repo: https://github.com/rockethooks/rockethooks-app