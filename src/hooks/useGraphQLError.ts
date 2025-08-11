import type { ApolloError } from '@apollo/client'
import { useAuth } from '@clerk/clerk-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraphQLErrorClassifier } from '@/lib/errors/classifier'
import { executeRecovery } from '@/lib/errors/recovery'
import { type AppError, ValidationError } from '@/lib/errors/types'

interface UseGraphQLErrorReturn {
  error: AppError | null
  validationErrors: Record<string, string> | null
  isRecovering: boolean
  handleError: (error: ApolloError) => AppError
  recover: (retryFn?: () => void) => Promise<void>
  dismiss: () => void
}

export function useGraphQLError(): UseGraphQLErrorReturn {
  const [error, setError] = useState<AppError | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null)
  const [isRecovering, setIsRecovering] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleError = useCallback((apolloError: ApolloError): AppError => {
    const classifiedError = GraphQLErrorClassifier.classify(apolloError)
    setError(classifiedError)

    // If it's a validation error, extract field errors
    if (classifiedError instanceof ValidationError) {
      setValidationErrors(classifiedError.fields ?? null)
    } else {
      setValidationErrors(null)
    }

    return classifiedError
  }, [])

  const recover = useCallback(
    async (retryFn?: () => void) => {
      if (!error) return

      setIsRecovering(true)
      try {
        await executeRecovery(error, {
          retry: retryFn ?? undefined,
          router: { push: navigate },
          authStore: { logout: signOut },
        })

        // Clear error after successful recovery
        if (retryFn) {
          setError(null)
          setValidationErrors(null)
        }
      } finally {
        setIsRecovering(false)
      }
    },
    [error, navigate, signOut]
  )

  const dismiss = useCallback(() => {
    setError(null)
    setValidationErrors(null)
  }, [])

  return {
    error,
    validationErrors,
    isRecovering,
    handleError,
    recover,
    dismiss,
  }
}
