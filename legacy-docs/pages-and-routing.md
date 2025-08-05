# Pages and Routing Reference

## Routing Architecture

### Route Structure
The application uses React Router v6 with the following route hierarchy:

```
/ (Index - Landing page)
├── /login (Public)
├── /signup (Public)
├── /sso-callback (Public)
├── /auth-callback (Public)
├── /onboarding (Protected - Conditional)
├── /dashboard (Protected)
├── /organizations (Protected)
├── /settings (Protected)
└── /* (NotFound - 404 page)
```

### Route Protection
- **Public Routes**: Accessible without authentication
- **Protected Routes**: Require authentication via Clerk
- **Conditional Routes**: Accessible based on user state (e.g., onboarding completion)

## Page Components

### **`Index.tsx` (`src/pages/Index.tsx`)**
- **Purpose**: Landing page for unauthenticated users
- **Features**:
  - Welcome message and product introduction
  - Call-to-action buttons for login/signup
  - Responsive design with hero section
  - Navigation to authentication pages
- **Route**: `/`
- **Access**: Public
- **Dependencies**: `react-router-dom`, UI components
- **Key Elements**:
  - Hero section with product value proposition
  - Feature highlights
  - Getting started buttons
  - Footer with links

### **`Login.tsx` (`src/pages/Login.tsx`)**
- **Purpose**: User authentication page
- **Features**:
  - Clerk authentication integration
  - OAuth with Google and GitHub
  - Email/password login form
  - Link to signup page
  - Responsive design
- **Route**: `/login`
- **Access**: Public
- **Dependencies**: `@clerk/clerk-react`, UI components
- **Key Elements**:
  - `<SignIn />` component from Clerk
  - OAuth provider buttons
  - Form validation
  - Error handling
  - Redirect logic after successful login

### **`Signup.tsx` (`src/pages/Signup.tsx`)**
- **Purpose**: User registration page
- **Features**:
  - Clerk registration integration
  - OAuth with Google and GitHub
  - Email/password registration form
  - Link to login page
  - Terms of service acceptance
- **Route**: `/signup`
- **Access**: Public
- **Dependencies**: `@clerk/clerk-react`, UI components
- **Key Elements**:
  - `<SignUp />` component from Clerk
  - OAuth provider buttons
  - Form validation
  - Error handling
  - Redirect logic after successful signup

### **`SSOCallback.tsx` (`src/pages/SSOCallback.tsx`)**
- **Purpose**: Handles SSO authentication callbacks
- **Features**:
  - Processes OAuth callbacks from providers
  - Handles authentication state changes
  - Redirects to appropriate page after authentication
  - Error handling for failed authentication
- **Route**: `/sso-callback`
- **Access**: Public
- **Dependencies**: `@clerk/clerk-react`
- **Key Elements**:
  - `<AuthenticateWithRedirectCallback />` from Clerk
  - Loading states
  - Error handling
  - Redirect logic

### **`AuthCallback.tsx` (`src/pages/AuthCallback.tsx`)**
- **Purpose**: Generic authentication callback handler
- **Features**:
  - Handles various authentication callbacks
  - Processes authentication tokens
  - Manages redirect after authentication
  - Error handling and recovery
- **Route**: `/auth-callback`
- **Access**: Public
- **Dependencies**: `@clerk/clerk-react`
- **Key Elements**:
  - Authentication state processing
  - Token handling
  - Redirect logic
  - Error boundaries

### **`Onboarding.tsx` (`src/pages/Onboarding.tsx`)**
- **Purpose**: Multi-step onboarding flow for new users
- **Features**:
  - Step-by-step wizard interface
  - Progress tracking
  - Form validation across steps
  - Apollo Client integration for GraphQL
  - Completion status checking
- **Route**: `/onboarding`
- **Access**: Protected (conditional based on completion status)
- **Dependencies**: `@apollo/client`, `react-router-dom`, onboarding components
- **Key Elements**:
  - `<OnboardingLayout />` wrapper
  - Step-based navigation
  - Progress indicator
  - Form persistence
  - GraphQL mutations for data saving

#### Onboarding Steps:
1. **Welcome Step**: Introduction and overview
2. **Profile Step**: User profile information
3. **Organization Step**: Organization setup
4. **Preferences Step**: User preferences configuration
5. **Completion Step**: Finalization and next steps

### **`Dashboard.tsx` (`src/pages/Dashboard.tsx`)**
- **Purpose**: Main dashboard with metrics and monitoring
- **Features**:
  - Real-time metrics display
  - Activity charts and graphs
  - API status monitoring
  - Recent events feed
  - Quick actions and shortcuts
- **Route**: `/dashboard`
- **Access**: Protected
- **Dependencies**: `lucide-react`, dashboard components
- **Key Elements**:
  - Status cards with KPIs
  - Activity chart component
  - API status indicators
  - Recent events list
  - Quick action buttons

#### Dashboard Sections:
- **Status Cards**: Key metrics (API calls, success rate, response time)
- **Activity Chart**: Visual representation of API activity over time
- **API Status**: Real-time status of API endpoints
- **Recent Events**: Latest webhook events and activities

### **`Organizations.tsx` (`src/pages/Organizations.tsx`)**
- **Purpose**: Organization management interface
- **Features**:
  - Organization list and grid view
  - Search and filtering
  - Organization creation
  - Member management
  - Team management
  - Settings and configuration
- **Route**: `/organizations`
- **Access**: Protected
- **Dependencies**: `lucide-react`, `sonner`, organization components
- **Key Elements**:
  - Organization grid layout
  - Search and filter controls
  - Detailed organization view
  - Tabbed interface for different sections

#### Organization Sections:
- **Overview**: Organization details and statistics
- **Members**: User management and role assignment
- **Teams**: Team creation and management
- **Settings**: Organization configuration and preferences

### **`Settings.tsx` (`src/pages/settings.tsx`)**
- **Purpose**: User and application settings
- **Features**:
  - Profile settings
  - Notification preferences
  - Privacy settings
  - Theme customization
  - Account management
- **Route**: `/settings`
- **Access**: Protected
- **Dependencies**: UI components, form handling
- **Key Elements**:
  - Tabbed settings interface
  - Form validation
  - Preference toggles
  - Account actions

#### Settings Sections:
- **Profile**: User profile information and avatar
- **Notifications**: Email and push notification preferences
- **Privacy**: Profile visibility and data sharing settings
- **Theme**: Appearance and theme customization
- **Account**: Account management and security settings

### **`NotFound.tsx` (`src/pages/NotFound.tsx`)**
- **Purpose**: 404 error page for unknown routes
- **Features**:
  - User-friendly error message
  - Navigation back to main application
  - Search functionality
  - Link to support
- **Route**: `/*` (catch-all)
- **Access**: Public
- **Dependencies**: `react-router-dom`, UI components
- **Key Elements**:
  - 404 error message
  - Navigation links
  - Search suggestion
  - Help resources

## Routing Implementation

### Router Configuration (`src/App.tsx`)
```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: "organizations",
        element: <ProtectedRoute><Organizations /></ProtectedRoute>
      },
      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>
      },
      {
        path: "onboarding",
        element: <ConditionalRoute><Onboarding /></ConditionalRoute>
      }
    ]
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "signup",
    element: <Signup />
  },
  {
    path: "sso-callback",
    element: <SSOCallback />
  },
  {
    path: "auth-callback",
    element: <AuthCallback />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
```

### Route Protection Logic
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <LoadingScreen />;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

### Conditional Route Logic
```typescript
const ConditionalRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  const { isOnboardingComplete, isLoading } = useOnboardingStatus();
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (isOnboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
```

## Navigation Patterns

### Programmatic Navigation
```typescript
const navigate = useNavigate();

// Navigate to dashboard
navigate('/dashboard');

// Navigate with state
navigate('/organizations', { state: { organizationId: '123' } });

// Replace current entry
navigate('/dashboard', { replace: true });
```

### Link Components
```typescript
import { Link, NavLink } from 'react-router-dom';

// Basic link
<Link to="/dashboard">Dashboard</Link>

// Navigation link with active state
<NavLink 
  to="/dashboard" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Dashboard
</NavLink>
```

### Route Parameters
```typescript
// Route definition
{
  path: "organizations/:id",
  element: <OrganizationDetail />
}

// Component usage
const OrganizationDetail = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Organization ID: {id}</div>;
};
```

## Authentication Flow

### Login Flow
1. User visits protected route
2. Redirect to `/login` if not authenticated
3. User completes authentication
4. Check onboarding status
5. Redirect to `/onboarding` if not completed
6. Redirect to original route or `/dashboard`

### Onboarding Flow
1. User completes authentication
2. Check if onboarding is complete
3. If not complete, redirect to `/onboarding`
4. User completes onboarding steps
5. Save onboarding completion status
6. Redirect to `/dashboard`

### Logout Flow
1. User initiates logout
2. Clear authentication state
3. Redirect to `/` (landing page)
4. Clear any cached data

## Error Handling

### Route-Level Error Boundaries
```typescript
const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      {children}
    </ErrorBoundary>
  );
};
```

### Loading States
```typescript
const PageWithLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return <PageContent />;
};
```

## SEO and Meta Tags

### Dynamic Page Titles
```typescript
const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard | RocketHooks';
  }, []);
  
  return <DashboardContent />;
};
```

### Meta Tag Management
```typescript
const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} | RocketHooks`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
};
```

## Best Practices

### Route Organization
1. **Nested Routes**: Use nested routes for related functionality
2. **Route Grouping**: Group related routes together
3. **Dynamic Routes**: Use parameters for dynamic content
4. **Error Boundaries**: Wrap routes with error boundaries

### Performance Optimization
1. **Code Splitting**: Use React.lazy for route-level code splitting
2. **Prefetching**: Prefetch data for anticipated routes
3. **Caching**: Cache route data appropriately
4. **Lazy Loading**: Load components only when needed

### User Experience
1. **Loading States**: Show loading indicators during navigation
2. **Error Handling**: Provide clear error messages
3. **Breadcrumbs**: Show navigation context
4. **Back Navigation**: Handle browser back button properly

### Security
1. **Route Protection**: Properly protect sensitive routes
2. **Authentication**: Validate authentication on every request
3. **Authorization**: Check user permissions for specific routes
4. **CSRF Protection**: Implement CSRF protection for forms