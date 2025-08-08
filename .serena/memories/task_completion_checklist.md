# Task Completion Checklist

## Before Completing Any Task

### 1. Code Quality Checks
```bash
# Type checking - must pass
yarn type-check

# Linting - fix all issues
yarn lint

# Build verification - must succeed
yarn build
```

### 2. Testing Requirements
```bash
# Run E2E tests if UI changes made
yarn test:e2e

# Verify development server still works
yarn dev
```

### 3. File Validation
- Ensure no TypeScript errors (`npx tsc --noEmit`)
- Verify all imports are correctly typed
- Check that no unused variables exist
- Confirm all React hooks follow rules of hooks

### 4. Git Workflow
```bash
# Check git status
git status

# Stage changes
git add .

# Create conventional commit
git commit -m "type: description"

# Push to remote
git push origin branch-name
```

### 5. Performance Considerations
- Verify HMR still works after changes
- Check that build size hasn't significantly increased
- Ensure no console errors in development

### 6. Documentation Updates
- Update CLAUDE.md if project structure changes
- Add comments for complex logic
- Update README if user-facing changes

## Common Issues to Check
- Port conflicts (use `yarn debug` for port 8080)
- Auth configuration in .env file
- GraphQL endpoint connectivity
- TypeScript strict mode compliance
- React 19 compatibility

## Pre-Push Checklist
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build succeeds
- [ ] Development server starts properly
- [ ] Git commit messages follow convention