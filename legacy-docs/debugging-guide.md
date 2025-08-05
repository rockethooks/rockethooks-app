# Debugging Guide

## Issue Investigation Workflow

### 1. Issue Triage & Reproduction

```bash
# Start development environment
yarn dev

# Navigate to application and reproduce issue
# Document exact steps taken by user
```

### 2. Evidence Collection Strategy

- **Frontend Evidence**: Console errors, network requests, component states
- **Backend Evidence**: GraphQL responses, authentication tokens, API errors
- **User Experience**: Screenshots, error messages, form validation states
- **Technical Context**: Browser, authentication status, organization data

### 3. Frontend vs Backend Issue Identification

**Frontend Issues (investigate first):**
- JavaScript console errors during component rendering
- Authentication flow crashes or redirects
- Form validation or UI component failures
- Apollo Client initialization problems
- React Router navigation issues

**Backend Issues (investigate after frontend cleared):**
- GraphQL mutations returning `UnauthorizedException`
- Direct GraphQL testing fails with valid tokens
- Multiple users experiencing same authentication failures
- GraphQL introspection queries fail

## Systematic Testing Approach

```bash
# Test sequence for comprehensive issue investigation:
1. ✅ Reproduce issue with exact user steps
2. ✅ Document error messages and UI states
3. ✅ Check console for JavaScript errors
4. ✅ Verify authentication flow (Clerk session)
5. ✅ Test GraphQL client integration
6. ✅ Validate network requests and responses
7. ✅ Check component state management (Zustand)
8. ✅ Test direct GraphQL calls with MCP tools
9. ✅ Determine if issue is frontend or backend
10. ✅ Create comprehensive GitHub issue with evidence
```

## Issue Documentation Template

```markdown
## 🐛 Issue Investigation Report

### Problem Summary
[Brief description of the issue and user impact]

### Reproduction Steps
1. [Exact steps to reproduce]
2. [Including form inputs, clicks, navigation]
3. [Expected vs actual behavior]

### Evidence Collected
- **Error Messages**: [User-facing and console errors]
- **Network Analysis**: [GraphQL requests, response times, status codes]
- **Authentication**: [User ID, session status, token format]
- **Component State**: [Zustand store data, form states]

### Technical Analysis
- **Root Cause**: [Frontend/Backend/Integration issue]
- **Impact Scope**: [Affected user types, scenarios]
- **Priority**: [High/Medium/Low based on user impact]

### Proposed Solution
[Specific technical changes needed]

### Testing Verification
[How to verify fix works correctly]
```

## Development Server Management

### Starting Development Server

```bash
# Standard development server (port 5173)
npm run dev

# Custom port for testing (port 8080)
npm run debug

# Check if server is running
curl -I http://localhost:8080/
```

### Common Server Issues

- **Port conflicts**: Use `yarn debug` for port 8080
- **Network access**: Ensure firewall allows local connections
- **Hot reload failures**: Restart server and clear browser cache

## Backend Issue Investigation

### When to Suspect Backend Issues

**⚠️ Important**: Always investigate frontend issues thoroughly first.

#### Symptoms indicating backend issues:
- GraphQL queries return `UnauthorizedException` consistently
- Direct GraphQL testing with MCP tools fails with valid tokens
- Multiple users experiencing same authentication failures
- GraphQL introspection queries fail
- Backend logs show authentication errors

#### Symptoms indicating frontend issues:
- JavaScript console errors during Apollo Client initialization
- Authentication flow works but GraphQL hooks crash
- Inconsistent behavior between users
- Network requests aren't being made at all
- Error boundaries not catching GraphQL errors

### Frontend Investigation Checklist

Before checking backend:

1. **Apollo Client Setup**
   ```javascript
   // Verify Apollo Client is properly initialized
   !!window.__APOLLO_CLIENT__
   ```

2. **Token Generation and Format**
   ```javascript
   // Check if Clerk tokens are being generated correctly
   window.Clerk?.session?.getToken({ template: '1day-token' })
   ```

3. **Request Headers**
   - Verify Authorization headers are being sent
   - Check browser Network tab

4. **Error Handling**
   - Confirm error boundaries are properly implemented
   - Verify GraphQL error policies are set to `'all'`

## Backend Project Reference

**When backend investigation is warranted**:

**Backend Location**: `03_Back/rockethooks-api-service`

**Key Areas to Investigate:**
1. Authentication Configuration
2. GraphQL Schema
3. Database Permissions
4. AWS AppSync Configuration

### Collaboration Pattern

```
1. Frontend Issue Reported
2. ✅ Test Frontend Implementation
3. ✅ Test Direct GraphQL with MCP
4. ❓ If frontend works but GraphQL fails → Backend Issue
5. ✅ Document findings and propose backend investigation
```

## Common Development Issues

### Build Errors
- Check TypeScript types and import paths
- Run `npx tsc --noEmit` for detailed errors

### Authentication Issues
- Verify Clerk configuration
- Check environment variables
- Validate token format

### GraphQL Errors
- Check network requests and API endpoint
- Verify authentication headers
- Test with direct GraphQL calls

### Styling Issues
- Verify Tailwind classes and component imports
- Check for CSS conflicts
- Validate responsive breakpoints
