# Suggested Commands for RocketHooks Development

## Development Commands
```bash
# Start development server (default port 5173)
yarn dev

# Start development server on port 8080 (for testing/debugging)
yarn debug

# Preview production build
yarn preview

# Start Storybook for component development
yarn storybook
```

## Quality & Validation Commands
```bash
# Run all quality checks (type-check + biome check + eslint)
yarn quality

# TypeScript type checking (no emit)
yarn type-check

# Linting with ESLint
yarn lint
yarn lint:fix

# Formatting with Biome
yarn format          # Write changes
yarn format:check    # Check only

# Biome comprehensive check (linting + formatting)
yarn check
yarn check:fix
```

## Build Commands
```bash
# Production build
yarn build

# Build Storybook
yarn build-storybook
```

## Git Commands (macOS/Darwin)
```bash
# Stage and commit (triggers lefthook pre-commit)
git add .
git commit -m "feat: your message"  # Will run quality checks

# NEVER use --no-verify flag
# Always fix linting errors before pushing
```

## System Utilities (macOS/Darwin)
```bash
# File operations
ls -la              # List files with details
find . -name "*.tsx" # Find TypeScript React files
grep -r "pattern" . # Search in files recursively

# Process management
lsof -i :8080       # Check what's using port 8080
kill -9 PID         # Kill process by PID

# Directory navigation
cd src/components   # Navigate to components
pwd                 # Print working directory
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Required environment variables:
# - VITE_CLERK_PUBLISHABLE_KEY
# - VITE_GRAPHQL_URL
```

## Package Management
```bash
# Install dependencies (use yarn, not npm)
yarn install

# Add new dependency
yarn add package-name

# Add dev dependency
yarn add -D package-name
```

## Testing (Playwright)
```bash
# Install Playwright browsers (first time)
yarn test:e2e:install

# Run E2E tests (ensure server is on port 8080)
yarn debug  # In one terminal
# Then run Playwright tests in another terminal
```

## MCP Server Integration
When using MCP servers:
- Context7: For library documentation
- ShadCN MCP: For UI component references
- Playwright MCP: For browser automation testing
- Serena: For code analysis and modifications