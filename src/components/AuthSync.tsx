import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { initializeNewUser, useAuthStore } from '@/store/auth.store';

export function AuthSync() {
  const { isLoaded: authLoaded, isSignedIn, sessionId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const { setAuthenticated, setUnauthenticated, updateToken } = useAuthStore();

  // Sync authentication state
  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    if (isSignedIn && user && sessionId) {
      const userData = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        ...(user.firstName && { firstName: user.firstName }),
        ...(user.lastName && { lastName: user.lastName }),
        ...(user.imageUrl && { imageUrl: user.imageUrl }),
      };

      getToken()
        .then((token) => {
          if (token) {
            setAuthenticated(userData, sessionId, token);

            // Initialize profile, preferences, and onboarding for new or returning users
            try {
              initializeNewUser();
            } catch (error) {
              console.error('Failed to initialize user profile:', error);
            }
          }
        })
        .catch((error: unknown) => {
          console.error('Failed to get auth token:', error);
          setUnauthenticated();
        });
    } else {
      setUnauthenticated();
    }
  }, [
    authLoaded,
    userLoaded,
    isSignedIn,
    user,
    sessionId,
    getToken,
    setAuthenticated,
    setUnauthenticated,
  ]);

  // Token refresh with proper cleanup
  useEffect(() => {
    if (!isSignedIn) return;

    let isMounted = true;

    const refreshInterval = setInterval(() => {
      void (async () => {
        try {
          const newToken = await getToken();
          if (isMounted && newToken) {
            updateToken(newToken);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Failed to refresh token:', error);
          }
        }
      })();
    }, 55000); // Refresh every 55 seconds (closer to typical token expiration)

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, [isSignedIn, getToken, updateToken]);

  return null;
}
