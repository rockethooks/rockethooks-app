import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { WebhookStatus } from './WebhookStatus'

export interface WebhookEvent {
  id: string
  timestamp: Date
  status: 'success' | 'pending' | 'retrying' | 'failed' | 'circuit-open'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  responseTime?: number
  statusCode?: number
  retryCount?: number
  errorMessage?: string
  payload?: object
}

export interface EventTimelineProps {
  events: WebhookEvent[]
  view?: 'compact' | 'detailed'
  onEventClick?: (event: WebhookEvent) => void
  className?: string
}

/**
 * EventTimeline - visual timeline for webhook events
 *
 * @example
 * ```tsx
 * <EventTimeline
 *   events={webhookEvents}
 *   view="detailed"
 *   onEventClick={(event) => showEventDetails(event)}
 * />
 * ```
 */
function EventTimeline({
  events,
  view = 'compact',
  onEventClick,
  className,
}: EventTimelineProps) {
  // Group events by day
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: WebhookEvent[] } = {}

    events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .forEach((event) => {
        const dayKey = format(event.timestamp, 'yyyy-MM-dd')
        groups[dayKey] ??= []
        groups[dayKey].push(event)
      })

    return Object.entries(groups).map(([dateKey, events]) => ({
      date: new Date(dateKey),
      events,
    }))
  }, [events])

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM d, yyyy')
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'pending':
        return 'secondary'
      case 'retrying':
        return 'warning'
      case 'failed':
        return 'destructive'
      case 'circuit-open':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (events.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <div className="text-sm">No events to display</div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {groupedEvents.map(({ date, events }) => (
        <div key={date.toISOString()} className="space-y-3">
          {/* Date Header */}
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm text-foreground">
              {getDateLabel(date)}
            </h3>
            <div className="h-px bg-border flex-1" />
            <Badge variant="outline" size="sm">
              {events.length} event{events.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Events List */}
          <div className="space-y-2 relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-border" />

            {events.map((event) => (
              <Card
                key={event.id}
                className={cn(
                  'relative transition-all duration-200',
                  onEventClick && 'cursor-pointer hover:shadow-md',
                  view === 'compact' && 'shadow-none border-l-4',
                  event.status === 'success' &&
                    view === 'compact' &&
                    'border-l-success',
                  event.status === 'failed' &&
                    view === 'compact' &&
                    'border-l-destructive',
                  event.status === 'pending' &&
                    view === 'compact' &&
                    'border-l-warning',
                  event.status === 'retrying' &&
                    view === 'compact' &&
                    'border-l-info'
                )}
                onClick={() => onEventClick?.(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Timeline Dot */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <WebhookStatus
                        status={event.status}
                        size={view === 'compact' ? 'sm' : 'md'}
                      />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={getStatusBadgeVariant(event.method)}
                          size="sm"
                        >
                          {event.method}
                        </Badge>

                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono truncate max-w-[200px]">
                          {event.endpoint}
                        </code>

                        <span className="text-xs text-muted-foreground">
                          {format(event.timestamp, 'h:mm a')}
                        </span>

                        {event.retryCount && event.retryCount > 0 && (
                          <Badge variant="warning" size="sm">
                            Retry {event.retryCount}
                          </Badge>
                        )}
                      </div>

                      {/* Details (Detailed View) */}
                      {view === 'detailed' && (
                        <div className="space-y-2 text-sm">
                          {/* Response Info */}
                          <div className="flex items-center gap-4">
                            {event.statusCode && (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">
                                  Status:
                                </span>
                                <span
                                  className={cn(
                                    'font-medium',
                                    event.statusCode >= 200 &&
                                      event.statusCode < 300 &&
                                      'text-success',
                                    event.statusCode >= 400 &&
                                      'text-destructive'
                                  )}
                                >
                                  {event.statusCode}
                                </span>
                              </div>
                            )}

                            {event.responseTime && (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">
                                  Time:
                                </span>
                                <span className="font-medium">
                                  {event.responseTime}ms
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Error Message */}
                          {event.errorMessage && (
                            <div className="p-2 bg-destructive/5 border border-destructive/20 rounded text-xs">
                              <span className="text-destructive font-medium">
                                Error:{' '}
                              </span>
                              <span className="text-destructive/80">
                                {event.errorMessage}
                              </span>
                            </div>
                          )}

                          {/* Relative Time */}
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(event.timestamp, {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Click Indicator */}
                    {onEventClick && (
                      <div className="text-muted-foreground">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <title>View details</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export { EventTimeline }
