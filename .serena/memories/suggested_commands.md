# Suggested Commands for RocketHooks WebApp

## Daily Development Commands

### Development Server
```bash
yarn dev          # Start development server on port 3000
yarn debug        # Start development server on port 8080 (for testing)
yarn preview      # Preview production build
```

### Code Quality (Run Before Committing)
```bash
yarn quality      # Run complete quality check (type-check + biome + eslint)
yarn type-check   # TypeScript compilation check
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues automatically
yarn check        # Run Biome checks
yarn check:fix    # Fix Biome issues automatically
yarn format       # Format code with Biome
```

### Build and Testing
```bash
yarn build        # Build for production
yarn storybook    # Run Storybook dev server
yarn build-storybook  # Build Storybook for production
```

## Git Workflow Commands
```bash
git add .
git commit -m "feat(scope): description"  # Conventional commits enforced
git push
```

## System Commands (macOS)
```bash
ls -la           # List files with details
find . -name "*.ts" -type f  # Find TypeScript files
grep -r "pattern" src/       # Search in source files
cd path/to/directory         # Change directory
pwd                          # Print working directory
```

## Package Management
```bash
yarn install     # Install dependencies
yarn add package # Add new dependency
yarn add -D package  # Add dev dependency
yarn remove package  # Remove dependency
```

## Environment Setup
```bash
cp .env.example .env  # Copy environment template
# Edit .env with actual values
```

## Quality Gates
- Pre-commit: type-check, biome check, eslint fix
- Pre-push: full build, all quality checks, security audit
- Commit message: conventional commit format enforced