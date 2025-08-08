import type { Meta, StoryObj } from '@storybook/react'

import { WebhookStatus } from './webhook-status'

/**
 * WebhookStatus provides visual indicators for webhook states with animated status dots
 * and optional labels. Supports different sizes and can disable animations when needed.
 */
const meta = {
  title: 'RocketHooks/WebhookStatus',
  component: WebhookStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated status indicators for webhook states. Features colored dots with optional pulse animations and text labels.',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['success', 'pending', 'retrying', 'failed', 'circuit-open'],
      description: 'Current webhook status',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the status indicator',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Whether to show the status label text',
    },
    pulseAnimation: {
      control: { type: 'boolean' },
      description: 'Enable pulse animation for pending and retrying states',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookStatus>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Successful webhook delivery - green solid dot
 */
export const Success: Story = {
  args: {
    status: 'success',
  },
}

/**
 * Webhook delivery pending - yellow pulsing dot
 */
export const Pending: Story = {
  args: {
    status: 'pending',
  },
}

/**
 * Webhook retrying after failure - blue pulsing dot
 */
export const Retrying: Story = {
  args: {
    status: 'retrying',
  },
}

/**
 * Failed webhook delivery - red solid dot
 */
export const Failed: Story = {
  args: {
    status: 'failed',
  },
}

/**
 * Circuit breaker open - gray solid dot
 */
export const CircuitOpen: Story = {
  args: {
    status: 'circuit-open',
  },
}

/**
 * Status indicator with label text shown
 */
export const WithLabel: Story = {
  args: {
    status: 'success',
    showLabel: true,
  },
}

/**
 * Small size status indicator
 */
export const SmallSize: Story = {
  args: {
    status: 'pending',
    size: 'sm',
    showLabel: true,
  },
}

/**
 * Large size status indicator
 */
export const LargeSize: Story = {
  args: {
    status: 'retrying',
    size: 'lg',
    showLabel: true,
  },
}

/**
 * Pending status without pulse animation
 */
export const NoPulse: Story = {
  args: {
    status: 'pending',
    showLabel: true,
    pulseAnimation: false,
  },
}

/**
 * All status types displayed together for comparison
 */
export const AllStatuses: Story = {
  render: function RenderFunction() {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <WebhookStatus status="success" showLabel />
          <WebhookStatus status="pending" showLabel />
          <WebhookStatus status="retrying" showLabel />
          <WebhookStatus status="failed" showLabel />
          <WebhookStatus status="circuit-open" showLabel />
        </div>
      </div>
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Comparison of all available webhook status types with labels',
      },
    },
  },
}

/**
 * Different sizes displayed together for comparison
 */
export const AllSizes: Story = {
  render: function RenderFunction() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <WebhookStatus status="success" size="sm" showLabel />
          <WebhookStatus status="success" size="md" showLabel />
          <WebhookStatus status="success" size="lg" showLabel />
        </div>
        <div className="flex items-center gap-6">
          <WebhookStatus status="pending" size="sm" showLabel />
          <WebhookStatus status="pending" size="md" showLabel />
          <WebhookStatus status="pending" size="lg" showLabel />
        </div>
      </div>
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Comparison of all available sizes for webhook status indicators',
      },
    },
  },
}
