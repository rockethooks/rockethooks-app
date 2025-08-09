import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { WebhookStatus } from '@/components/rockethooks/WebhookStatus'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

/**
 * WebhookStatus component provides visual status indicators for webhook delivery states.
 * Features animated dots and semantic colors to clearly communicate the current status.
 */
const meta = {
  title: 'RocketHooks/WebhookStatus',
  component: WebhookStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The WebhookStatus component displays the current state of webhook deliveries using
color-coded indicators with optional animations. It's designed to provide immediate
visual feedback about webhook processing status.

## Features

- **Semantic Colors**: Each status has a distinct color for quick recognition
- **Animation Support**: Pulse animations for active states like pending/retrying
- **Multiple Sizes**: Small, medium, and large variants for different contexts
- **Accessibility**: Proper ARIA labels and semantic markup
- **Consistent Design**: Follows the RocketHooks design system

## Status Types

- **Success**: Green - webhook delivered successfully
- **Pending**: Yellow/Orange - waiting for delivery or processing
- **Retrying**: Blue - actively retrying failed delivery
- **Failed**: Red - delivery failed after retries
- **Circuit Open**: Gray - circuit breaker activated, temporarily disabled

## Usage

\`\`\`tsx
import { WebhookStatus } from '@/components/rockethooks/WebhookStatus'

// Basic usage
<WebhookStatus status="success" />

// With label and custom size
<WebhookStatus status="pending" showLabel size="lg" />

// Disable animations
<WebhookStatus status="retrying" pulseAnimation={false} />
\`\`\`

## Use Cases

- **Event Lists**: Show status in webhook event tables
- **Dashboard Cards**: Display current webhook health
- **Real-time Updates**: Live status indicators that update automatically
- **Status Summaries**: Aggregate status displays
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['success', 'pending', 'retrying', 'failed', 'circuit-open'],
      description: 'Webhook delivery status',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Status indicator size',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Show text label next to indicator',
    },
    pulseAnimation: {
      control: { type: 'boolean' },
      description: 'Enable pulse animation for active states',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookStatus>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default success status
 */
export const Default: Story = {
  args: {
    status: 'success',
  },
}

/**
 * All webhook status types
 */
export const AllStatuses: Story = {
  args: { status: 'success' },
  render: () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-3 border rounded">
          <span className="text-sm font-medium">Success</span>
          <WebhookStatus status="success" />
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="text-sm font-medium">Pending</span>
          <WebhookStatus status="pending" />
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="text-sm font-medium">Retrying</span>
          <WebhookStatus status="retrying" />
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="text-sm font-medium">Failed</span>
          <WebhookStatus status="failed" />
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="text-sm font-medium">Circuit Open</span>
          <WebhookStatus status="circuit-open" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available webhook status types with their semantic colors.',
      },
    },
  },
}

/**
 * Status indicators with labels
 */
export const WithLabels: Story = {
  args: { status: 'success' },
  render: () => (
    <div className="space-y-3">
      <WebhookStatus status="success" showLabel />
      <WebhookStatus status="pending" showLabel />
      <WebhookStatus status="retrying" showLabel />
      <WebhookStatus status="failed" showLabel />
      <WebhookStatus status="circuit-open" showLabel />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status indicators with text labels for clear communication.',
      },
    },
  },
}

/**
 * Different sizes for various UI contexts
 */
export const Sizes: Story = {
  args: { status: 'success' },
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Small (inline, tables)</h4>
        <div className="flex items-center gap-4">
          <WebhookStatus status="success" size="sm" />
          <WebhookStatus status="pending" size="sm" />
          <WebhookStatus status="retrying" size="sm" />
          <WebhookStatus status="failed" size="sm" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm">Medium (cards, lists)</h4>
        <div className="flex items-center gap-4">
          <WebhookStatus status="success" size="md" showLabel />
          <WebhookStatus status="pending" size="md" showLabel />
          <WebhookStatus status="retrying" size="md" showLabel />
          <WebhookStatus status="failed" size="md" showLabel />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm">Large (headers, emphasis)</h4>
        <div className="flex items-center gap-6">
          <WebhookStatus status="success" size="lg" showLabel />
          <WebhookStatus status="pending" size="lg" showLabel />
          <WebhookStatus status="retrying" size="lg" showLabel />
          <WebhookStatus status="failed" size="lg" showLabel />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various UI contexts and emphasis levels.',
      },
    },
  },
}

/**
 * Animation control demonstration
 */
export const Animations: Story = {
  args: { status: 'success' },
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-sm">With Animations (Default)</h4>
        <div className="flex items-center gap-4">
          <WebhookStatus status="pending" showLabel pulseAnimation={true} />
          <WebhookStatus status="retrying" showLabel pulseAnimation={true} />
          <WebhookStatus status="success" showLabel pulseAnimation={true} />
          <WebhookStatus status="failed" showLabel pulseAnimation={true} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm">Without Animations</h4>
        <div className="flex items-center gap-4">
          <WebhookStatus status="pending" showLabel pulseAnimation={false} />
          <WebhookStatus status="retrying" showLabel pulseAnimation={false} />
          <WebhookStatus status="success" showLabel pulseAnimation={false} />
          <WebhookStatus status="failed" showLabel pulseAnimation={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of animated vs static status indicators.',
      },
    },
  },
}

/**
 * Event table integration
 */
export const EventTable: Story = {
  args: { status: 'success' },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Webhook Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Response
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/25">
                <td className="px-4 py-3">
                  <div className="font-medium">user.created</div>
                  <div className="text-sm text-muted-foreground">
                    POST /webhooks/users
                  </div>
                </td>
                <td className="px-4 py-3">
                  <WebhookStatus status="success" size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Badge variant="success" className="text-xs">
                    200
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  2m ago
                </td>
              </tr>

              <tr className="hover:bg-muted/25">
                <td className="px-4 py-3">
                  <div className="font-medium">order.updated</div>
                  <div className="text-sm text-muted-foreground">
                    POST /webhooks/orders
                  </div>
                </td>
                <td className="px-4 py-3">
                  <WebhookStatus status="retrying" size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Badge variant="warning" className="text-xs">
                    429
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  5m ago
                </td>
              </tr>

              <tr className="hover:bg-muted/25">
                <td className="px-4 py-3">
                  <div className="font-medium">payment.failed</div>
                  <div className="text-sm text-muted-foreground">
                    POST /webhooks/payments
                  </div>
                </td>
                <td className="px-4 py-3">
                  <WebhookStatus status="failed" size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Badge variant="destructive" className="text-xs">
                    500
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  12m ago
                </td>
              </tr>

              <tr className="hover:bg-muted/25">
                <td className="px-4 py-3">
                  <div className="font-medium">inventory.updated</div>
                  <div className="text-sm text-muted-foreground">
                    POST /webhooks/inventory
                  </div>
                </td>
                <td className="px-4 py-3">
                  <WebhookStatus status="pending" size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">
                    -
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  15m ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Integration with event tables showing webhook delivery status.',
      },
    },
  },
}

/**
 * Dashboard status cards
 */
export const DashboardCards: Story = {
  args: { status: 'success' },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">endpoints</p>
            </div>
            <WebhookStatus status="success" size="lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">in queue</p>
            </div>
            <WebhookStatus status="pending" size="lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Retrying
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">attempt 2/3</p>
            </div>
            <WebhookStatus status="retrying" size="lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Failed Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-green-600">Great!</p>
            </div>
            <WebhookStatus status="success" size="lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard cards featuring webhook status indicators with metrics.',
      },
    },
  },
}

/**
 * Status summary with counts
 */
export const StatusSummary: Story = {
  args: { status: 'success' },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WebhookStatus status="success" size="md" />
              <span className="font-medium">Successful Deliveries</span>
            </div>
            <div className="text-right">
              <div className="font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">last 24h</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WebhookStatus status="pending" size="md" />
              <span className="font-medium">Pending Deliveries</span>
            </div>
            <div className="text-right">
              <div className="font-bold">8</div>
              <div className="text-xs text-muted-foreground">in queue</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WebhookStatus status="retrying" size="md" />
              <span className="font-medium">Currently Retrying</span>
            </div>
            <div className="text-right">
              <div className="font-bold">2</div>
              <div className="text-xs text-muted-foreground">auto-retry</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WebhookStatus status="failed" size="md" />
              <span className="font-medium">Failed Deliveries</span>
            </div>
            <div className="text-right">
              <div className="font-bold">12</div>
              <div className="text-xs text-muted-foreground">
                need attention
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WebhookStatus status="circuit-open" size="md" />
              <span className="font-medium">Circuit Breakers</span>
            </div>
            <div className="text-right">
              <div className="font-bold">0</div>
              <div className="text-xs text-green-600">all healthy</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status summary showing counts and descriptions for each webhook state.',
      },
    },
  },
}

/**
 * Real-time status updates simulation
 */
export const RealTimeUpdates: Story = {
  args: { status: 'success' },
  render: () => {
    const [statuses, setStatuses] = React.useState<
      Array<{
        id: number
        status: 'success' | 'pending' | 'retrying' | 'failed'
        timestamp: string
      }>
    >([
      { id: 1, status: 'success', timestamp: '2m ago' },
      { id: 2, status: 'pending', timestamp: '3m ago' },
      { id: 3, status: 'retrying', timestamp: '5m ago' },
      { id: 4, status: 'success', timestamp: '7m ago' },
    ])

    React.useEffect(() => {
      const interval = setInterval(() => {
        setStatuses((prev) =>
          prev.map((item) => {
            if (item.status === 'pending' && Math.random() > 0.7) {
              return { ...item, status: 'success' }
            }
            if (item.status === 'retrying' && Math.random() > 0.8) {
              return {
                ...item,
                status: Math.random() > 0.5 ? 'success' : 'failed',
              }
            }
            return item
          })
        )
      }, 2000)

      return () => {
        clearInterval(interval)
      }
    }, [])

    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Webhook Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status indicators update automatically as events are processed
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statuses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-3">
                  <WebhookStatus status={item.status} size="sm" />
                  <span className="text-sm">Event #{item.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulation of real-time status updates as webhook events are processed.',
      },
    },
  },
}

/**
 * Playground for testing all webhook status properties
 */
export const Playground: Story = {
  args: {
    status: 'success',
    size: 'md',
    showLabel: false,
    pulseAnimation: true,
  },
}
