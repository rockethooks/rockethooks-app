# Task Completion Checklist

## Before Committing Code
1. **Type Check**: Run `yarn type-check` to ensure no TypeScript errors
2. **Code Quality**: Run `yarn quality` (combines type-check, biome, and eslint)
3. **Fix Issues**: Run `yarn lint:fix` and `yarn check:fix` to auto-fix issues
4. **Build Test**: Run `yarn build` to ensure production build works

## Git Hooks (Automatic)
The project uses Lefthook for automatic validation:

### Pre-commit (runs automatically)
- TypeScript compilation check
- Biome formatting and linting (auto-fixes and stages)
- ESLint check (auto-fixes and stages)

### Pre-push (runs automatically) 
- Full type check
- Production build test
- Complete linting validation
- Security audit (moderate level)

### Commit Message Format (enforced)
Must follow conventional commit format:
- `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- Example: `feat(auth): add OAuth login with GitHub`
- Include issue number: `fix(onboarding): resolve draft persistence #65`

## Manual Quality Checks
```bash
# Complete quality check
yarn quality

# Individual checks
yarn type-check    # TypeScript compilation
yarn lint         # ESLint check
yarn check        # Biome check
yarn build        # Production build

# Auto-fix issues
yarn lint:fix     # Fix ESLint issues
yarn check:fix    # Fix Biome issues and formatting
```

## Environment Variables
- Never commit `.env` files
- Update `.env.example` when adding new environment variables
- Ensure TypeScript declarations are updated for new Vite env vars

## Important Notes
- Project uses Yarn (never use npm)
- Tailwind CSS v4 (not v3 patterns)
- All code must pass strict TypeScript checks
- No `--no-verify` flag when pushing code