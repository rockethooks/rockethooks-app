import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useAuthStore } from '@/stores/auth.store'

export function AuthSync() {
  const { isLoaded: authLoaded, isSignedIn, sessionId, getToken } = useAuth()
  const { isLoaded: userLoaded, user } = useUser()
  const { 
    setAuthenticated, 
    setUnauthenticated, 
    updateToken 
  } = useAuthStore()

  // Sync authentication state
  useEffect(() => {
    if (!authLoaded || !userLoaded) return

    if (isSignedIn && user && sessionId) {
      const userData = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        ...(user.firstName && { firstName: user.firstName }),
        ...(user.lastName && { lastName: user.lastName }),
        ...(user.imageUrl && { imageUrl: user.imageUrl }),
      }

      getToken().then((token) => {
        if (token) {
          setAuthenticated(userData, sessionId, token)
        }
      })
    } else {
      setUnauthenticated()
    }
  }, [authLoaded, userLoaded, isSignedIn, user, sessionId, getToken, setAuthenticated, setUnauthenticated])

  // Token refresh
  useEffect(() => {
    if (!isSignedIn) return

    const refreshInterval = setInterval(async () => {
      try {
        const newToken = await getToken()
        if (newToken) {
          updateToken(newToken)
        }
      } catch (error) {
        console.error('Failed to refresh token:', error)
      }
    }, 50000) // Refresh every 50 seconds

    return () => clearInterval(refreshInterval)
  }, [isSignedIn, getToken, updateToken])

  return null
}