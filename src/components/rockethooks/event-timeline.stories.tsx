import type { Meta, StoryObj } from '@storybook/react'
import type { WebhookEvent } from './event-timeline'
import { EventTimeline } from './event-timeline'

/**
 * EventTimeline displays a chronological list of webhook events with visual status indicators.
 * Supports both compact and detailed views with grouping by date and interactive event selection.
 */
const meta = {
  title: 'RocketHooks/EventTimeline',
  component: EventTimeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Visual timeline component for displaying webhook events chronologically. Features date grouping, status indicators, and optional detailed information.',
      },
    },
  },
  argTypes: {
    events: {
      control: { type: 'object' },
      description: 'Array of webhook events to display',
    },
    view: {
      control: { type: 'select' },
      options: ['compact', 'detailed'],
      description: 'Display mode for events',
    },
    onEventClick: { action: 'event clicked' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventTimeline>

export default meta
type Story = StoryObj<typeof meta>

// Generate sample events for different scenarios
const generateEvent = (
  id: string,
  hoursAgo: number,
  status: WebhookEvent['status'],
  endpoint: string,
  method: WebhookEvent['method'],
  options: Partial<WebhookEvent> = {}
): WebhookEvent => ({
  id,
  timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  status,
  endpoint,
  method,
  responseTime: Math.floor(Math.random() * 1000) + 100,
  statusCode: status === 'success' ? 200 : status === 'failed' ? 500 : 202,
  ...options,
})

const sampleEvents: WebhookEvent[] = [
  generateEvent('1', 0.5, 'success', '/api/users/profile', 'GET', {
    responseTime: 145,
    statusCode: 200,
  }),
  generateEvent('2', 1, 'pending', '/api/orders/webhook', 'POST'),
  generateEvent('3', 2, 'retrying', '/api/payments/callback', 'POST', {
    retryCount: 2,
    errorMessage: 'Connection timeout',
    responseTime: 5000,
    statusCode: 408,
  }),
  generateEvent('4', 3, 'success', '/api/inventory/update', 'PUT', {
    responseTime: 89,
    statusCode: 200,
  }),
  generateEvent('5', 4, 'failed', '/api/external/notify', 'POST', {
    errorMessage: 'Service unavailable',
    responseTime: 30000,
    statusCode: 503,
  }),
  generateEvent('6', 6, 'circuit-open', '/api/legacy/sync', 'GET', {
    errorMessage: 'Circuit breaker open - too many failures',
  }),
  generateEvent('7', 8, 'success', '/api/users/login', 'POST', {
    responseTime: 234,
    statusCode: 201,
  }),
]

const recentEvents: WebhookEvent[] = [
  generateEvent('r1', 0.1, 'success', '/api/health', 'GET'),
  generateEvent('r2', 0.3, 'success', '/api/users/status', 'GET'),
  generateEvent('r3', 0.5, 'pending', '/api/orders/process', 'POST'),
]

const mixedEvents: WebhookEvent[] = [
  // Today's events
  generateEvent('m1', 1, 'success', '/api/dashboard/metrics', 'GET'),
  generateEvent('m2', 3, 'retrying', '/api/notifications/send', 'POST', {
    retryCount: 1,
  }),
  generateEvent('m3', 5, 'failed', '/api/payments/charge', 'POST', {
    errorMessage: 'Invalid payment method',
    statusCode: 400,
  }),

  // Yesterday's events
  generateEvent('m4', 26, 'success', '/api/reports/daily', 'GET'),
  generateEvent('m5', 28, 'success', '/api/backup/create', 'POST'),
  generateEvent('m6', 30, 'circuit-open', '/api/third-party/webhook', 'POST'),

  // Two days ago
  generateEvent('m7', 50, 'success', '/api/users/cleanup', 'DELETE'),
  generateEvent('m8', 52, 'success', '/api/orders/archive', 'PUT'),
]

const errorEvents: WebhookEvent[] = [
  generateEvent('e1', 1, 'failed', '/api/critical/process', 'POST', {
    errorMessage: 'Database connection failed',
    statusCode: 500,
    responseTime: 15000,
  }),
  generateEvent('e2', 2, 'retrying', '/api/payments/refund', 'POST', {
    retryCount: 3,
    errorMessage: 'Payment processor timeout',
    statusCode: 408,
    responseTime: 30000,
  }),
  generateEvent('e3', 3, 'circuit-open', '/api/external/webhook', 'POST', {
    errorMessage: 'Circuit breaker opened after 5 consecutive failures',
  }),
]

/**
 * Default timeline with mixed event types
 */
export const Default: Story = {
  args: {
    events: sampleEvents,
  },
}

/**
 * Compact view for space-efficient display
 */
export const CompactView: Story = {
  args: {
    events: sampleEvents,
    view: 'compact',
  },
}

/**
 * Detailed view with full event information
 */
export const DetailedView: Story = {
  args: {
    events: sampleEvents,
    view: 'detailed',
  },
}

/**
 * Interactive timeline with click handlers
 */
export const Interactive: Story = {
  args: {
    events: sampleEvents,
    view: 'detailed',
  },
}

/**
 * Recent events (all within last hour)
 */
export const RecentEvents: Story = {
  args: {
    events: recentEvents,
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline showing only recent events from the last hour',
      },
    },
  },
}

/**
 * Multi-day timeline with date grouping
 */
export const MultiDay: Story = {
  args: {
    events: mixedEvents,
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline spanning multiple days with automatic date grouping',
      },
    },
  },
}

/**
 * Error-focused timeline showing failures and retries
 */
export const ErrorEvents: Story = {
  args: {
    events: errorEvents,
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Timeline focused on error events, retries, and circuit breaker states',
      },
    },
  },
}

/**
 * Empty timeline state
 */
export const Empty: Story = {
  args: {
    events: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no events are available',
      },
    },
  },
}

/**
 * Single event timeline
 */
export const SingleEvent: Story = {
  args: {
    events: [generateEvent('single', 1, 'success', '/api/single/test', 'GET')],
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline with a single event to show minimal layout',
      },
    },
  },
}

/**
 * High-frequency events (many events in short time)
 */
export const HighFrequency: Story = {
  args: {
    events: Array.from({ length: 20 }, (_, i) =>
      generateEvent(
        `hf${i.toString()}`,
        i * 0.1, // Events every 6 minutes
        i % 4 === 0 ? 'failed' : i % 3 === 0 ? 'pending' : 'success',
        `/api/endpoint${(i % 3).toString()}`,
        i % 2 === 0 ? 'GET' : 'POST'
      )
    ),
    view: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story: 'High-frequency timeline with many events in a short timespan',
      },
    },
  },
}

/**
 * Retry sequence showing webhook retry attempts
 */
export const RetrySequence: Story = {
  args: {
    events: [
      generateEvent('retry1', 2, 'failed', '/api/webhook/notify', 'POST', {
        errorMessage: 'Connection refused',
        statusCode: 503,
        retryCount: 0,
      }),
      generateEvent('retry2', 1.8, 'retrying', '/api/webhook/notify', 'POST', {
        errorMessage: 'Connection timeout',
        statusCode: 408,
        retryCount: 1,
      }),
      generateEvent('retry3', 1.6, 'retrying', '/api/webhook/notify', 'POST', {
        errorMessage: 'Connection timeout',
        statusCode: 408,
        retryCount: 2,
      }),
      generateEvent('retry4', 1.4, 'success', '/api/webhook/notify', 'POST', {
        statusCode: 200,
        responseTime: 245,
        retryCount: 3,
      }),
    ],
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sequence showing webhook retry attempts from failure to success',
      },
    },
  },
}

/**
 * Mixed HTTP methods showcase
 */
export const MixedMethods: Story = {
  args: {
    events: [
      generateEvent('get', 1, 'success', '/api/users', 'GET'),
      generateEvent('post', 2, 'success', '/api/users', 'POST'),
      generateEvent('put', 3, 'success', '/api/users/123', 'PUT'),
      generateEvent('patch', 4, 'success', '/api/users/123', 'PATCH'),
      generateEvent('delete', 5, 'success', '/api/users/123', 'DELETE'),
    ],
    view: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Timeline showcasing different HTTP methods with color-coded badges',
      },
    },
  },
}
