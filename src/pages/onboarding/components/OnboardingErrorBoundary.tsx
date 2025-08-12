import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class OnboardingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to monitoring service in production
    if (process.env['NODE_ENV'] === 'production') {
      console.error(
        'Onboarding Error Boundary caught an error:',
        error,
        errorInfo
      )
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <div className="font-medium">Onboarding Error</div>
                  <div className="text-sm">
                    {this.state.error?.message ??
                      'An unexpected error occurred during onboarding'}
                  </div>
                </div>
              </Alert>

              {process.env['NODE_ENV'] === 'development' &&
                this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                      Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </details>
                )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false })
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/onboarding/organization'
                  }}
                >
                  Restart Onboarding
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = '/dashboard'
                  }}
                >
                  Go to Dashboard
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4">
                If this problem persists, please contact support.
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
