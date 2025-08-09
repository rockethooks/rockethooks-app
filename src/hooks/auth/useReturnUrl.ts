import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RETURN_URL_KEY = 'auth_return_url'

export function useReturnUrl() {
  const { isSignedIn } = useAuth()
  const location = useLocation()

  // Store intended destination before redirect
  useEffect(() => {
    if (!isSignedIn && location.pathname !== '/login') {
      sessionStorage.setItem(RETURN_URL_KEY, location.pathname)
    }
  }, [isSignedIn, location.pathname])

  const getReturnUrl = (): string | null => {
    return sessionStorage.getItem(RETURN_URL_KEY)
  }

  const clearReturnUrl = () => {
    sessionStorage.removeItem(RETURN_URL_KEY)
  }

  return { getReturnUrl, clearReturnUrl }
}
