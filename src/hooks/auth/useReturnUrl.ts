import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RETURN_URL_KEY = 'auth_return_url'

/**
 * Validates that a URL is safe for redirection to prevent open redirect attacks
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
function isValidReturnUrl(url: string | null): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Remove any leading/trailing whitespace
  const trimmedUrl = url.trim()

  // Empty string is not valid
  if (!trimmedUrl) {
    return false
  }

  // Check for malicious patterns
  if (
    trimmedUrl.includes('javascript:') ||
    trimmedUrl.includes('data:') ||
    trimmedUrl.includes('vbscript:')
  ) {
    return false
  }

  try {
    // If it's a relative path, it's safe
    if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
      return true
    }

    // If it's an absolute URL, check if it's from the same origin
    const urlObj = new URL(trimmedUrl, window.location.origin)
    return urlObj.origin === window.location.origin
  } catch {
    // If URL parsing fails, it's not a valid URL
    return false
  }
}

export function useReturnUrl() {
  const { isSignedIn } = useAuth()
  const location = useLocation()

  // Store intended destination before redirect
  useEffect(() => {
    if (!isSignedIn && location.pathname !== '/login') {
      // Only store the URL if it's valid
      if (isValidReturnUrl(location.pathname)) {
        sessionStorage.setItem(RETURN_URL_KEY, location.pathname)
      }
    }
  }, [isSignedIn, location.pathname])

  const getReturnUrl = (): string | null => {
    const storedUrl = sessionStorage.getItem(RETURN_URL_KEY)

    // Validate the stored URL before returning it
    if (isValidReturnUrl(storedUrl)) {
      return storedUrl
    }

    // If the stored URL is invalid, remove it and return null
    sessionStorage.removeItem(RETURN_URL_KEY)
    return null
  }

  const clearReturnUrl = () => {
    sessionStorage.removeItem(RETURN_URL_KEY)
  }

  return { getReturnUrl, clearReturnUrl }
}
