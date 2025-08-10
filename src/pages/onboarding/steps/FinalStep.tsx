import { ArrowRight, CheckCircle, Sparkles, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { useAuthStore } from '@/store/auth.store'
import { clearDrafts } from '@/utils/onboardingDrafts'

export interface FinalStepProps {
  onComplete?: () => void
  onNext?: () => void
}

export function FinalStep({ onComplete, onNext }: FinalStepProps) {
  const navigate = useNavigate()
  const { completeOnboarding, onboarding, user } = useAuthStore()

  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user name for personalization
  const userName = user?.firstName ?? 'there'

  // Handle onboarding completion
  const handleComplete = async () => {
    try {
      setIsCompleting(true)
      setError(null)

      // Mark onboarding as complete in auth store
      completeOnboarding()

      // Clear all onboarding drafts from localStorage
      const draftsClearSuccess = clearDrafts()
      if (!draftsClearSuccess) {
        console.warn('Failed to clear onboarding drafts from localStorage')
      }

      // Call completion callback if provided
      onComplete?.()

      // Small delay for UX (let user see the completion state)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Navigate to dashboard or call next callback
      if (onNext) {
        onNext()
      } else {
        void navigate('/dashboard')
      }
    } catch (completionError) {
      console.error('Failed to complete onboarding:', completionError)
      setError(
        completionError instanceof Error
          ? completionError.message
          : 'Failed to complete setup'
      )
    } finally {
      setIsCompleting(false)
    }
  }

  // Completed setup features list
  const completedFeatures = [
    'Account setup and authentication',
    'Organization profile configuration',
    'Preferences and notification settings',
    'API monitoring workspace ready',
    'Webhook management tools available',
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Main Success Card */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            {/* Trophy Icon with sparkle effect */}
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              <Sparkles
                className="h-4 w-4 text-blue-400 absolute -bottom-1 -left-1 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Congratulations, {userName}!
          </CardTitle>

          <CardDescription className="text-lg text-gray-700">
            You&apos;ve successfully completed the setup process. Your
            RocketHooks workspace is ready to help you monitor APIs and manage
            webhooks with confidence.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Completed Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Setup Complete
            </h3>

            <ul className="space-y-2">
              {completedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Next Section */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              What&apos;s next?
            </h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Set up your first API monitoring target</li>
              <li>• Configure webhook endpoints for real-time notifications</li>
              <li>
                • Explore the dashboard to familiarize yourself with the tools
              </li>
              <li>• Invite team members to collaborate (if applicable)</li>
            </ul>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <div className="flex items-center justify-between">
                <span>Failed to complete setup: {error}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setError(null)
                  }}
                  aria-label="Dismiss error"
                >
                  ×
                </Button>
              </div>
            </Alert>
          )}

          {/* Completion Button */}
          <div className="pt-4">
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
              size="lg"
            >
              {isCompleting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border border-current border-t-transparent rounded-full" />
                  Completing Setup...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Setup & Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      {onboarding && (
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Final Step - Setup Complete!
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-xs text-green-600 font-medium mt-2">
            🎉 100% Complete
          </div>
        </div>
      )}

      {/* Welcome Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Welcome to RocketHooks! We&apos;re excited to help you build better
          APIs.
        </p>
      </div>
    </div>
  )
}
