import { useAuth, useUser } from '@clerk/clerk-react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  organizationId?: string;
}

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  sessionId?: string;
}

export interface AuthService {
  getAuthState(): AuthState;
  getToken(template?: string): Promise<string | null>;
  signOut(): Promise<void>;
  refreshToken(): Promise<string | null>;
}

// Hook-based implementation that returns an AuthService object
export function useClerkAuthService(): AuthService {
  const auth = useAuth();
  const user = useUser();

  const getAuthState = (): AuthState => {
    const result: AuthState = {
      isLoaded: auth.isLoaded && user.isLoaded,
      isSignedIn: !!auth.isSignedIn,
      user: user.user
        ? {
            id: user.user.id,
            email: user.user.primaryEmailAddress?.emailAddress ?? '',
            ...(user.user.firstName && {
              firstName: user.user.firstName,
            }),
            ...(user.user.lastName && {
              lastName: user.user.lastName,
            }),
            ...(user.user.imageUrl && {
              imageUrl: user.user.imageUrl,
            }),
            ...(auth.orgId && { organizationId: auth.orgId }),
          }
        : null,
    };

    if (auth.sessionId) {
      result.sessionId = auth.sessionId;
    }

    return result;
  };

  const getToken = async (template?: string): Promise<string | null> => {
    return await auth.getToken(template ? { template } : undefined);
  };

  const signOut = async (): Promise<void> => {
    await auth.signOut();
  };

  const refreshToken = async (): Promise<string | null> => {
    return await auth.getToken();
  };

  return {
    getAuthState,
    getToken,
    signOut,
    refreshToken,
  };
}
