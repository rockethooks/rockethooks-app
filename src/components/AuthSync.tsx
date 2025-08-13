import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { initializeNewUser, useAuthStore } from '@/store/auth.store';

export function AuthSync() {
  const { isLoaded: authLoaded, isSignedIn, sessionId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const { setAuthenticated, setUnauthenticated } = useAuthStore();

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

      setAuthenticated(userData, sessionId);

      // Initialize profile, preferences, and onboarding for new or returning users
      try {
        initializeNewUser();
      } catch (error) {
        console.error('Failed to initialize user profile:', error);
      }
    } else {
      setUnauthenticated();
    }
  }, [
    authLoaded,
    userLoaded,
    isSignedIn,
    user,
    sessionId,
    setAuthenticated,
    setUnauthenticated,
  ]);

  return null;
}
