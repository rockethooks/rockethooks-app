# Project Structure

```
rockethooks-app/
├── .claude/              # Claude-specific configurations
├── .github/              # GitHub workflows and templates
├── .serena/              # Serena MCP configurations
├── .storybook/           # Storybook configuration
├── dist/                 # Production build output
├── docs/                 # Project documentation
├── logs/                 # Application logs
├── mockups/              # UI mockups and designs
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
    ├── stories/         # Storybook stories
    ├── styles/          # Global styles
    ├── types/           # TypeScript type definitions
    └── utils/           # Utility functions
```

## Key Configuration Files
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration (strict mode)
- `vite.config.ts`: Vite build configuration
- `biome.json`: Biome formatter and linter settings
- `eslint.config.js`: ESLint rules and plugins
- `lefthook.yml`: Git hooks configuration
- `components.json`: ShadCN components configuration
- `.env.example`: Environment variables template

## Important Directories
- `src/types/`: TypeScript type definitions
- `src/components/ui/`: ShadCN UI components
- `src/store/`: Zustand state management
- `src/lib/apollo/`: GraphQL Apollo Client setup
- `src/pages/onboarding/`: Multi-step onboarding flow
- `src/hooks/`: Custom React hooks