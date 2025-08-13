import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

interface Props {
  children: ReactNode;
  level: 'app' | 'page' | 'component';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Error reporting logic would go here
    console.warn('Error reported to tracking service:', { error, errorInfo });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderAppLevelError() {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Application Error</CardTitle>
            <CardDescription>
              Something went wrong with the application. This error has been
              logged and we&apos;re working to fix it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {import.meta.env.DEV && this.state.error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm font-mono">
                  {this.state.error.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={this.handleGoHome}>
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderPageLevelError() {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle>Page Error</CardTitle>
            <CardDescription>
              This page encountered an error and couldn&apos;t load properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {import.meta.env.DEV && this.state.error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm font-mono">
                  {this.state.error.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={this.handleGoHome} size="sm">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderComponentLevelError() {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">
            Component Error
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          This component failed to render properly.
        </p>
        {import.meta.env.DEV && this.state.error && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription className="text-xs font-mono">
              {this.state.error.message}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={this.handleRetry} variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-2" />
          Retry Component
        </Button>
      </div>
    );
  }

  public override render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render appropriate error UI based on level
      switch (this.props.level) {
        case 'app':
          return this.renderAppLevelError();
        case 'page':
          return this.renderPageLevelError();
        case 'component':
          return this.renderComponentLevelError();
        default:
          return this.renderComponentLevelError();
      }
    }

    return this.props.children;
  }
}

// Convenience components for each level
export function AppErrorBoundary(props: Omit<Props, 'level'>) {
  return <ErrorBoundary {...props} level="app" />;
}

export function PageErrorBoundary(props: Omit<Props, 'level'>) {
  return <ErrorBoundary {...props} level="page" />;
}

export function ComponentErrorBoundary(props: Omit<Props, 'level'>) {
  return <ErrorBoundary {...props} level="component" />;
}
