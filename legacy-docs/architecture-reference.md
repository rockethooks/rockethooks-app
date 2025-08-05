# Architecture Reference

## Application Architecture

### Authentication Architecture

#### Clerk Integration
- **Provider Setup**: ClerkProvider wraps the entire application
- **Route Protection**: Protected routes check authentication state
- **Token Management**: Automatic token injection into GraphQL requests
- **User State**: Global user state via Clerk hooks

#### Authentication Flow
1. User visits protected route
2. Clerk checks authentication status
3. If not authenticated, redirects to login
4. After login, checks onboarding status
5. Redirects to appropriate page based on state

### Data Architecture

#### GraphQL Integration
- Apollo Client setup with AWS AppSync endpoint
- Authentication middleware using Clerk tokens
- Custom hook for authenticated client creation
- Error handling and retry logic

#### State Management Layers
1. **Server State**: Apollo Client with GraphQL
2. **Local State**: Zustand stores for application state
3. **Form State**: React Hook Form for form management
4. **Authentication State**: Clerk for user management

### Component Architecture

#### Component Categories
- **UI Components** (`src/components/ui/`): Base ShadCN components
- **Feature Components**: Business logic components
- **Layout Components**: Application structure components
- **Page Components**: Route-level components

### Routing Architecture

#### Route Structure
```
/ (Index)
├── /login
├── /signup
├── /sso-callback
├── /auth-callback
├── /onboarding (Protected)
├── /dashboard (Protected)
├── /organizations (Protected)
└── /settings (Protected)
```

#### Route Protection
- **Public Routes**: Login, signup, landing page
- **Protected Routes**: Dashboard, organizations, settings
- **Conditional Routes**: Onboarding (based on completion status)

### Styling Architecture

#### Design System
- **Tailwind CSS**: Utility-first approach
- **CSS Variables**: Theme-aware color system
- **Dark Mode**: Class-based theme switching
- **Responsive Design**: Mobile-first breakpoints

#### Component Styling
- **ShadCN/UI**: Pre-built accessible components
- **Radix UI**: Unstyled primitive components
- **Custom Components**: Tailwind utility classes
- **Animations**: Framer Motion for interactions

### Data Flow Architecture

#### Onboarding Flow
1. User completes authentication
2. Check onboarding status via GraphQL
3. If incomplete, redirect to onboarding
4. Multi-step wizard with Zustand state
5. Save progress to backend via mutations
6. Redirect to dashboard on completion

#### Organization Management
1. Fetch user organizations via Clerk
2. Display organization list
3. Allow switching between organizations
4. Sync organization context with backend

### Error Handling Architecture

#### Error Boundaries
- **Application Level**: Catches all unhandled errors
- **Route Level**: Catches route-specific errors
- **Component Level**: Catches component-specific errors

#### Error Types
- **Network Errors**: GraphQL/API failures
- **Authentication Errors**: Token/session issues
- **Validation Errors**: Form/input validation
- **Application Errors**: Business logic failures

### Performance Architecture

#### Code Splitting
- **Route-based**: Lazy loading of page components
- **Component-based**: Dynamic imports for heavy components
- **Bundle Analysis**: Webpack bundle analyzer integration

#### Optimization Strategies
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive calculations
- **React Query**: Intelligent caching and background updates
- **Apollo Client**: GraphQL query caching

### Security Architecture

#### Authentication Security
- **OAuth Integration**: Google and GitHub OAuth
- **Token Management**: Secure token storage and refresh
- **Route Protection**: Server-side token validation
- **CSRF Protection**: Built-in CSRF protection

#### Data Security
- **Input Validation**: Zod schema validation
- **Sanitization**: XSS prevention measures
- **HTTPS**: Secure communication channels
- **Environment Variables**: Secure configuration management

### Deployment Architecture

#### Build Artifacts
- **Static Assets**: Optimized JS, CSS, and images
- **Environment Configuration**: Build-time variable injection
- **Service Worker**: Offline capability (if implemented)
- **Bundle Analysis**: Size optimization reports

#### Deployment Strategy
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Management**: Development, staging, production
- **CDN Integration**: Asset optimization and delivery
- **Monitoring**: Error tracking and performance monitoring
