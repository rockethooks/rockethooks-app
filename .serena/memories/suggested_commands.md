# Suggested Commands

## Development Commands
```bash
# Start development server (port 3000)
yarn dev

# Start development server for testing (port 8080)
yarn debug

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn type-check
# or
npx tsc --noEmit

# Linting
yarn lint

# Install dependencies
yarn install
```

## Testing Commands
```bash
# Install Playwright browsers
yarn test:e2e:install

# Run E2E tests
yarn test:e2e

# Run E2E tests in UI mode
yarn test:e2e:ui
```

## Git Commands (macOS)
```bash
# Basic git operations
git status
git add .
git commit -m "message"
git push origin branch-name

# Create feature branch
git checkout -b feature/branch-name

# Switch branches
git checkout branch-name
```

## System Commands (macOS)
```bash
# Directory navigation
ls -la          # List files with details
cd path/to/dir  # Change directory
pwd             # Print working directory

# File operations
cat filename    # Display file contents
grep "pattern" file  # Search in files
find . -name "*.tsx"  # Find files by pattern

# Process management
ps aux | grep node    # Find running processes
kill -9 PID          # Kill process by PID
lsof -ti:3000        # Find process using port 3000
```

## Package Management
```bash
# Yarn commands (preferred)
yarn add package-name
yarn add -D package-name  # Dev dependency
yarn remove package-name
yarn upgrade

# Check package versions
yarn list
yarn outdated
```

## Vite Specific
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Analyze bundle
yarn build --analyze
```