import { formatDistanceToNow } from 'date-fns'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

import { Sparkline } from './Sparkline'
import { WebhookStatus } from './WebhookStatus'

const methodVariants = {
  GET: 'success',
  POST: 'info',
  PUT: 'warning',
  DELETE: 'destructive',
  PATCH: 'secondary',
} as const

export interface APIConnectionCardProps {
  name: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  status: 'active' | 'polling' | 'error' | 'paused' | 'circuit-open'
  pollingInterval: number // seconds
  lastChecked: Date
  changesDetected: number
  successRate?: number
  avgResponseTime?: number
  sparklineData?: number[]
  onTest?: () => void
  onEdit?: () => void
  onToggle?: () => void
  className?: string
}

/**
 * APIConnectionCard - specialized card component for displaying API endpoint status and metrics
 *
 * @example
 * ```tsx
 * <APIConnectionCard
 *   name="User Profile API"
 *   endpoint="https://api.example.com/users/profile"
 *   method="GET"
 *   status="active"
 *   pollingInterval={30}
 *   lastChecked={new Date()}
 *   changesDetected={12}
 *   successRate={98.5}
 *   avgResponseTime={245}
 *   sparklineData={[200, 180, 220, 195, 210, 185, 205]}
 *   onTest={() => console.log('Test clicked')}
 *   onEdit={() => console.log('Edit clicked')}
 *   onToggle={() => console.log('Toggle clicked')}
 * />
 * ```
 */
function APIConnectionCard({
  name,
  endpoint,
  method,
  status,
  pollingInterval,
  lastChecked,
  changesDetected,
  successRate,
  avgResponseTime,
  sparklineData,
  onTest,
  onEdit,
  onToggle,
  className,
}: APIConnectionCardProps) {
  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${String(seconds)}s`
    if (seconds < 3600) return `${String(Math.floor(seconds / 60))}m`
    return `${String(Math.floor(seconds / 3600))}h`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'polling':
        return 'text-info'
      case 'error':
        return 'text-destructive'
      case 'paused':
        return 'text-muted-foreground'
      case 'circuit-open':
        return 'text-warning'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card
      className={cn('transition-all duration-200 hover:shadow-md', className)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <WebhookStatus
              status={
                status as React.ComponentProps<typeof WebhookStatus>['status']
              }
            />
            <span className="truncate">{name}</span>
          </CardTitle>
          <Badge
            variant={
              methodVariants[method] as React.ComponentProps<
                typeof Badge
              >['variant']
            }
            size="sm"
          >
            {method}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <code className="px-1.5 py-0.5 text-xs bg-muted rounded font-mono truncate max-w-[200px]">
            {endpoint}
          </code>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Polling</div>
            <div className="font-medium">{formatInterval(pollingInterval)}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Last Check</div>
            <div className="font-medium">
              {formatDistanceToNow(lastChecked, { addSuffix: true })}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Changes</div>
            <div className="font-medium">{changesDetected}</div>
          </div>

          {successRate !== undefined && (
            <div>
              <div className="text-muted-foreground text-xs">Success Rate</div>
              <div
                className={cn(
                  'font-medium',
                  successRate >= 95
                    ? 'text-success'
                    : successRate >= 85
                      ? 'text-warning'
                      : 'text-destructive'
                )}
              >
                {successRate.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* Response Time & Sparkline */}
        {(avgResponseTime !== undefined || sparklineData) && (
          <div className="flex items-center justify-between pt-2 border-t">
            {avgResponseTime !== undefined && (
              <div className="text-sm">
                <span className="text-muted-foreground">Avg Response:</span>
                <span className="ml-1 font-medium">{avgResponseTime}ms</span>
              </div>
            )}

            {sparklineData && sparklineData.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Response Time
                </span>
                <Sparkline
                  data={sparklineData}
                  width={60}
                  height={20}
                  color={getStatusColor(status)}
                  gradient
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onTest && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTest}
              className="flex-1"
            >
              Test
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              Edit
            </Button>
          )}

          {onToggle && (
            <Button
              variant={status === 'paused' ? 'default' : 'secondary'}
              size="sm"
              onClick={onToggle}
              className="flex-1"
            >
              {status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { APIConnectionCard }
