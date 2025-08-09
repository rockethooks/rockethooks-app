# Task Completion Checklist

## Before Marking Any Task Complete

### 1. Code Quality Checks
```bash
# Run the comprehensive quality check
yarn quality
```
This runs:
- TypeScript type checking (`yarn type-check`)
- Biome checks (`yarn check`)
- ESLint (`yarn lint`)

### 2. Fix Any Issues
```bash
# Fix linting issues
yarn lint:fix

# Fix Biome issues (formatting + linting)
yarn check:fix

# Format code
yarn format
```

### 3. TypeScript Validation
```bash
# Ensure no TypeScript errors
yarn type-check
```
- Fix ALL TypeScript errors, even non-blocking ones
- Check for proper type definitions
- Ensure no `any` types without justification

### 4. Component Testing (if UI changes)
```bash
# Start Storybook to verify components
yarn storybook
```
- Verify component renders correctly
- Check all component states
- Test responsive behavior

### 5. Build Verification
```bash
# Ensure production build works
yarn build
```
- Must complete without errors
- Check for any build warnings

### 6. React-Specific Checks
- [ ] No infinite re-render risks in useEffect dependencies
- [ ] Error boundaries implemented for new features
- [ ] Proper cleanup in useEffect returns
- [ ] No memory leaks in event listeners

### 7. Tailwind CSS v4 Compatibility
- [ ] Only use Tailwind v4 syntax (NOT v3)
- [ ] Verify styles work with ShadCN components
- [ ] Check responsive design on mobile-first approach

### 8. GraphQL/Apollo Checks (if applicable)
- [ ] Error handling with policy 'all'
- [ ] Proper loading states
- [ ] Optimistic updates where appropriate
- [ ] Cache updates if needed

### 9. Documentation Updates
- [ ] Update relevant docs in `docs/` directory
- [ ] Update CLAUDE.md if adding new patterns
- [ ] Add JSDoc comments for complex functions
- [ ] Update README if adding new features

### 10. Git Commit
```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "type: description"
```
- Use conventional commit format
- Let lefthook run pre-commit checks
- NEVER use `--no-verify`
- Fix any issues that prevent commit

### 11. Final Verification
- [ ] All automated checks pass
- [ ] Manual testing completed
- [ ] No console errors or warnings
- [ ] Performance acceptable (no obvious lag)
- [ ] Accessibility maintained

## Quick Command Sequence
```bash
# Full validation sequence
yarn quality        # Run all checks
yarn build         # Verify build
git add .
git commit -m "feat: description"
```

## Common Issues to Check
- Port 8080 conflicts (use `lsof -i :8080`)
- Missing environment variables (.env file)
- Clerk authentication keys configured
- GraphQL endpoint accessible
- No hardcoded values that should be in env vars