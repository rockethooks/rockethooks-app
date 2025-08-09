import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export interface OnboardingStatus {
  isLoading: boolean
  isNewUser: boolean
  shouldRedirectToOnboarding: boolean
  error: Error | null
}

/**
 * Hook to determine user onboarding status
 * A user is considered "new" if they were created within the last minute
 * This covers the typical OAuth redirect flow timeframe
 */
export function useOnboardingStatus(): OnboardingStatus {
  const { user, isLoaded } = useUser()
  const [status, setStatus] = useState<OnboardingStatus>({
    isLoading: true,
    isNewUser: false,
    shouldRedirectToOnboarding: false,
    error: null,
  })

  useEffect(() => {
    if (!isLoaded) {
      setStatus((prev) => ({ ...prev, isLoading: true }))
      return
    }

    if (!user) {
      setStatus({
        isLoading: false,
        isNewUser: false,
        shouldRedirectToOnboarding: false,
        error: new Error('No user found'),
      })
      return
    }

    try {
      const now = new Date()
      const userCreatedAt = user.createdAt

      if (!userCreatedAt) {
        setStatus({
          isLoading: false,
          isNewUser: false,
          shouldRedirectToOnboarding: false,
          error: new Error('User creation date not available'),
        })
        return
      }

      // Calculate time difference in milliseconds
      const timeDiff = now.getTime() - userCreatedAt.getTime()
      // Consider user as "new" if created within the last 60 seconds (60000 ms)
      const isNewUser = timeDiff <= 60000

      // TODO: In a real implementation, we would also check if the user has completed onboarding
      // by checking user metadata or making a GraphQL query to the backend
      // For now, we assume new users always need onboarding
      const shouldRedirectToOnboarding = isNewUser

      setStatus({
        isLoading: false,
        isNewUser,
        shouldRedirectToOnboarding,
        error: null,
      })
    } catch (error) {
      setStatus({
        isLoading: false,
        isNewUser: false,
        shouldRedirectToOnboarding: false,
        error:
          error instanceof Error ? error : new Error('Unknown error occurred'),
      })
    }
  }, [user, isLoaded])

  return status
}
