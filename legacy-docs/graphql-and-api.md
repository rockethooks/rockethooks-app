# GraphQL and API Reference

## Apollo Client Configuration

### Client Setup (`src/lib/apolloClient.ts`)

The Apollo Client is configured with AWS AppSync endpoint and Clerk authentication:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/clerk-react';

const httpLink = createHttpLink({
  uri: 'https://your-appsync-endpoint.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### Hook for Authenticated Client
```typescript
export const useApolloClient = () => {
  const { getToken } = useAuth();
  
  return useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);
};
```

## GraphQL Queries (`src/graphql/queries.ts`)

### User Preferences Query
```typescript
export const GET_USER_PREFERENCES = gql`
  query GetUserPreferences($userId: ID!) {
    getUserPreferences(userId: $userId) {
      userId
      theme
      notifications {
        email
        push
        digest
      }
      privacy {
        profileVisibility
        showActivity
      }
      onboardingCompleted
      createdAt
      updatedAt
    }
  }
`;
```

### Organization Queries
```typescript
export const GET_USER_ORGANIZATIONS = gql`
  query GetUserOrganizations($userId: ID!) {
    getUserOrganizations(userId: $userId) {
      id
      name
      description
      role
      createdAt
      members {
        id
        email
        role
        joinedAt
      }
    }
  }
`;

export const GET_ORGANIZATION_DETAILS = gql`
  query GetOrganizationDetails($organizationId: ID!) {
    getOrganization(id: $organizationId) {
      id
      name
      description
      settings {
        webhookUrl
        apiKey
        retryPolicy
      }
      members {
        id
        email
        role
        permissions
        joinedAt
      }
      teams {
        id
        name
        members {
          id
          email
          role
        }
      }
      apiUsage {
        totalCalls
        successRate
        averageResponseTime
      }
    }
  }
`;
```

### Dashboard Data Queries
```typescript
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($organizationId: ID!, $timeRange: String!) {
    getDashboardData(organizationId: $organizationId, timeRange: $timeRange) {
      metrics {
        totalApiCalls
        successRate
        averageResponseTime
        errorRate
      }
      activityChart {
        timestamp
        apiCalls
        successCount
        errorCount
      }
      recentEvents {
        id
        type
        timestamp
        status
        endpoint
        responseTime
      }
      apiStatus {
        endpoint
        status
        lastChecked
        responseTime
      }
    }
  }
`;
```

### Webhook Event Queries
```typescript
export const GET_WEBHOOK_EVENTS = gql`
  query GetWebhookEvents($organizationId: ID!, $limit: Int, $offset: Int) {
    getWebhookEvents(
      organizationId: $organizationId
      limit: $limit
      offset: $offset
    ) {
      events {
        id
        type
        payload
        timestamp
        status
        endpoint
        responseTime
        retryCount
        headers
      }
      pagination {
        total
        limit
        offset
        hasMore
      }
    }
  }
`;
```

## GraphQL Mutations (`src/graphql/mutations.ts`)

### User Preferences Mutations
```typescript
export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($input: UpdateUserPreferencesInput!) {
    updateUserPreferences(input: $input) {
      userId
      theme
      notifications {
        email
        push
        digest
      }
      privacy {
        profileVisibility
        showActivity
      }
      onboardingCompleted
      updatedAt
    }
  }
`;

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($userId: ID!) {
    completeOnboarding(userId: $userId) {
      userId
      onboardingCompleted
      completedAt
    }
  }
`;
```

### Organization Mutations
```typescript
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      description
      ownerId
      settings {
        webhookUrl
        apiKey
      }
      createdAt
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      id
      name
      description
      settings {
        webhookUrl
        apiKey
        retryPolicy
      }
      updatedAt
    }
  }
`;

export const INVITE_MEMBER = gql`
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      id
      email
      role
      organizationId
      invitedAt
      invitedBy
    }
  }
`;

export const UPDATE_MEMBER_ROLE = gql`
  mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
    updateMemberRole(input: $input) {
      id
      email
      role
      permissions
      updatedAt
    }
  }
`;
```

### Profile Mutations
```typescript
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      firstName
      lastName
      avatar
      bio
      updatedAt
    }
  }
`;
```

## TypeScript Interfaces

### User Preferences Types
```typescript
interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    digest: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showActivity: boolean;
  };
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserPreferencesInput {
  userId: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    digest?: boolean;
  };
  privacy?: {
    profileVisibility?: 'public' | 'private';
    showActivity?: boolean;
  };
}
```

### Organization Types
```typescript
interface Organization {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  settings: {
    webhookUrl: string;
    apiKey: string;
    retryPolicy: {
      maxRetries: number;
      retryDelay: number;
    };
  };
  members: OrganizationMember[];
  teams: Team[];
  apiUsage: {
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrganizationMember {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: string[];
  joinedAt: string;
}

interface CreateOrganizationInput {
  name: string;
  description?: string;
  webhookUrl?: string;
}
```

### Dashboard Types
```typescript
interface DashboardData {
  metrics: {
    totalApiCalls: number;
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
  };
  activityChart: {
    timestamp: string;
    apiCalls: number;
    successCount: number;
    errorCount: number;
  }[];
  recentEvents: WebhookEvent[];
  apiStatus: {
    endpoint: string;
    status: 'active' | 'inactive' | 'error';
    lastChecked: string;
    responseTime: number;
  }[];
}

interface WebhookEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  endpoint: string;
  responseTime: number;
  retryCount: number;
  headers: Record<string, string>;
}
```

## Query Hooks Usage

### Using Query Hooks
```typescript
import { useQuery } from '@apollo/client';
import { GET_USER_PREFERENCES } from '@/graphql/queries';

const UserPreferencesComponent = () => {
  const { data, loading, error } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: user.id },
    errorPolicy: 'all'
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>User Preferences</h2>
      <p>Theme: {data?.getUserPreferences?.theme}</p>
    </div>
  );
};
```

### Using Mutation Hooks
```typescript
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PREFERENCES } from '@/graphql/mutations';

const PreferencesForm = () => {
  const [updatePreferences, { loading, error }] = useMutation(
    UPDATE_USER_PREFERENCES,
    {
      onCompleted: (data) => {
        toast.success('Preferences updated successfully');
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      }
    }
  );

  const handleSubmit = async (formData: UpdateUserPreferencesInput) => {
    await updatePreferences({
      variables: { input: formData }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Preferences'}
      </button>
    </form>
  );
};
```

## Error Handling

### GraphQL Error Handling
```typescript
import { ApolloError } from '@apollo/client';

const handleGraphQLError = (error: ApolloError) => {
  if (error.networkError) {
    // Network error
    console.error('Network error:', error.networkError);
    toast.error('Network error. Please check your connection.');
  }

  if (error.graphQLErrors) {
    // GraphQL errors
    error.graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      toast.error(`GraphQL error: ${message}`);
    });
  }
};
```

### Error Boundary for Apollo
```typescript
import { ErrorBoundary } from 'react-error-boundary';

const ApolloErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div>
          <h2>Something went wrong with the API:</h2>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Apollo error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## Caching Strategies

### Apollo Client Cache Configuration
```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getUserPreferences: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        getWebhookEvents: {
          keyArgs: ['organizationId'],
          merge(existing, incoming) {
            return {
              ...incoming,
              events: [...(existing?.events || []), ...incoming.events]
            };
          }
        }
      }
    }
  }
});
```

### Cache Updates
```typescript
const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES, {
  update: (cache, { data }) => {
    cache.writeQuery({
      query: GET_USER_PREFERENCES,
      variables: { userId: user.id },
      data: {
        getUserPreferences: data.updateUserPreferences
      }
    });
  }
});
```

## Subscriptions

### Real-time Updates
```typescript
export const WEBHOOK_EVENT_SUBSCRIPTION = gql`
  subscription WebhookEventSubscription($organizationId: ID!) {
    webhookEventCreated(organizationId: $organizationId) {
      id
      type
      status
      timestamp
      endpoint
      responseTime
    }
  }
`;

const useWebhookEventSubscription = (organizationId: string) => {
  const { data, loading, error } = useSubscription(
    WEBHOOK_EVENT_SUBSCRIPTION,
    {
      variables: { organizationId }
    }
  );

  return { data, loading, error };
};
```

## Best Practices

### Query Organization
1. **File Structure**: Separate queries and mutations into different files
2. **Naming Convention**: Use descriptive names for queries and mutations
3. **Type Safety**: Use TypeScript interfaces for all GraphQL operations
4. **Error Handling**: Implement comprehensive error handling

### Performance Optimization
1. **Query Optimization**: Use fragments for reusable query parts
2. **Caching**: Implement proper caching strategies
3. **Pagination**: Use cursor-based pagination for large datasets
4. **Loading States**: Show appropriate loading indicators

### Security
1. **Authentication**: Always include authentication tokens
2. **Authorization**: Verify user permissions on the backend
3. **Input Validation**: Validate all inputs on both client and server
4. **Rate Limiting**: Implement rate limiting to prevent abuse

### Development Workflow
1. **GraphQL Playground**: Use for testing queries and mutations
2. **Code Generation**: Use tools like GraphQL Code Generator
3. **Testing**: Write tests for all GraphQL operations
4. **Documentation**: Document all queries and mutations thoroughly