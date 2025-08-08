import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export function useSessionMonitor() {
  const { isSignedIn, sessionId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleSessionChange = () => {
      if (!isSignedIn) {
        // Session ended, redirect to sign-in
        navigate('/sign-in')
      }
    }

    // Check session validity periodically
    const sessionCheckInterval = setInterval(() => {
      if (isSignedIn && !sessionId) {
        handleSessionChange()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(sessionCheckInterval)
  }, [isSignedIn, sessionId, navigate])
}