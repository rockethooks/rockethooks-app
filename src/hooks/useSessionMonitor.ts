import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const SIGN_IN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in'

export function useSessionMonitor() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const wasSignedInRef = useRef(false)

  useEffect(() => {
    // Only monitor after auth is loaded
    if (!isLoaded) return

    // Track sign-in state changes
    if (wasSignedInRef.current && !isSignedIn) {
      // User was signed in but now isn't - session ended
      navigate(SIGN_IN_URL)
    }

    // Update the ref for next render
    wasSignedInRef.current = isSignedIn
  }, [isSignedIn, isLoaded, navigate])
}