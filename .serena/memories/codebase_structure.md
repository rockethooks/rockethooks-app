# Codebase Structure

## Root Directory
```
rockethooks-app/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Project documentation
├── legacy-docs/            # Historical documentation (reference only)
├── mockups/                # Design mockups
├── .storybook/             # Storybook configuration
├── .github/                # GitHub workflows and templates
├── .serena/                # Serena MCP memories
└── .claude/                # Claude configuration

## Configuration Files
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
├── biome.json              # Biome formatter/linter config
├── eslint.config.js        # ESLint configuration
├── postcss.config.js       # PostCSS for Tailwind
├── components.json         # ShadCN UI configuration
├── lefthook.yml            # Git hooks configuration
└── .env.example            # Environment variables template
```

## Source Code Structure (`src/`)
```
src/
├── app/                    # Application core
│   ├── providers/          # Context providers (Auth, Theme, etc.)
│   ├── layouts/            # Layout components
│   ├── store/              # Zustand state management
│   └── router/             # React Router configuration
│
├── components/             # Reusable components
│   ├── ui/                 # ShadCN UI components
│   ├── rockethooks/        # Business-specific components
│   └── [feature]/          # Feature-specific components
│
├── pages/                  # Page components
│   ├── auth/               # Authentication pages
│   ├── onboarding/         # Onboarding flow
│   ├── dashboard/          # Dashboard pages
│   └── [feature]/          # Feature pages
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useOnboarding.ts
│   └── [feature hooks]
│
├── services/               # API and external services
│   ├── apollo-client.ts   # GraphQL client setup
│   ├── clerk.ts            # Authentication service
│   └── [api services]
│
├── lib/                    # Utility libraries
│   ├── utils.ts            # General utilities
│   └── [helpers]
│
├── stories/                # Storybook stories
│   ├── ui/                 # UI component stories
│   ├── rockethooks/        # Business component stories
│   └── layout/             # Layout stories
│
├── styles/                 # Global styles
│   └── themes.css          # Theme definitions
│
├── assets/                 # Static assets (images, fonts)
│
├── config/                 # App configuration
│
├── shared/                 # Shared types and constants
│
├── App.tsx                 # Root application component
├── main.tsx                # Application entry point
├── index.css               # Global CSS with Tailwind
└── vite-env.d.ts           # Vite environment types
```

## Key Architectural Patterns

### Component Organization
- UI components in `components/ui/` (ShadCN)
- Business components in `components/rockethooks/`
- Page components in `pages/`
- Shared components in `components/`

### State Management
- Global state: Zustand stores in `app/store/`
- Local state: React hooks (useState, useReducer)
- Server state: Apollo Client cache

### Routing Structure
- Configured in `app/router/`
- Protected routes with Clerk authentication
- Public routes for auth and landing

### Service Layer
- GraphQL operations via Apollo Client
- Authentication via Clerk
- API services in `services/`

### Import Paths
- Use `@/` alias for src imports
- Example: `import { Button } from '@/components/ui/button'`

## Important Directories

### Documentation (`docs/`)
- `authentication-flow-guide.md` - Auth implementation details
- Feature documentation
- API documentation

### Storybook (`.storybook/` and `src/stories/`)
- Component development environment
- Visual testing
- Component documentation

### Configuration
- TypeScript: Strict mode with all checks
- Tailwind CSS v4 configuration
- Biome for formatting and linting
- ESLint for additional linting