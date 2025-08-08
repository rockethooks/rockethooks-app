import type { Meta, StoryObj } from '@storybook/react'

import { APIConnectionCard } from './api-connection-card'

/**
 * APIConnectionCard displays API endpoint status and metrics with real-time monitoring capabilities.
 * It shows polling intervals, success rates, response times, and includes interactive controls
 * for testing and managing API connections.
 */
const meta = {
  title: 'RocketHooks/APIConnectionCard',
  component: APIConnectionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Specialized card component for displaying API endpoint status and metrics with real-time monitoring capabilities.',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['active', 'polling', 'error', 'paused', 'circuit-open'],
      description: 'Current status of the API connection',
    },
    method: {
      control: { type: 'select' },
      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      description: 'HTTP method used for the API endpoint',
    },
    pollingInterval: {
      control: { type: 'number', min: 5, max: 3600, step: 5 },
      description: 'Polling interval in seconds',
    },
    successRate: {
      control: { type: 'number', min: 0, max: 100, step: 0.1 },
      description: 'Success rate as a percentage',
    },
    avgResponseTime: {
      control: { type: 'number', min: 10, max: 5000, step: 10 },
      description: 'Average response time in milliseconds',
    },
    changesDetected: {
      control: { type: 'number', min: 0, max: 10000, step: 1 },
      description: 'Number of changes detected',
    },
    onTest: { action: 'test clicked' },
    onEdit: { action: 'edit clicked' },
    onToggle: { action: 'toggle clicked' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof APIConnectionCard>

export default meta
type Story = StoryObj<typeof meta>

const sampleSparklineData = [200, 180, 220, 195, 210, 185, 205, 190, 215, 200]

/**
 * Default active API connection with good performance metrics
 */
export const Active: Story = {
  args: {
    name: 'User Profile API',
    endpoint: 'https://api.example.com/users/profile',
    method: 'GET',
    status: 'active',
    pollingInterval: 30,
    lastChecked: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    changesDetected: 142,
    successRate: 99.8,
    avgResponseTime: 245,
    sparklineData: sampleSparklineData,
  },
}

/**
 * API connection with error status and poor performance
 */
export const ErrorState: Story = {
  args: {
    ...Active.args,
    name: 'Payment Gateway',
    endpoint: 'https://payment.api.com/transactions',
    method: 'POST',
    status: 'error',
    successRate: 12.5,
    avgResponseTime: 2850,
    sparklineData: [2800, 3100, 2950, 3200, 2750, 3400, 2900, 3150, 2800, 3000],
  },
}

/**
 * API connection currently polling for updates
 */
export const Polling: Story = {
  args: {
    ...Active.args,
    name: 'Inventory Updates',
    endpoint: 'https://inventory.api.com/stock-levels',
    method: 'GET',
    status: 'polling',
    pollingInterval: 15,
    lastChecked: new Date(Date.now() - 5 * 1000), // 5 seconds ago
    changesDetected: 23,
    successRate: 97.2,
    avgResponseTime: 180,
  },
}

/**
 * Paused API connection that is not actively monitoring
 */
export const Paused: Story = {
  args: {
    ...Active.args,
    name: 'Legacy Reports API',
    endpoint: 'https://legacy.api.com/reports/daily',
    method: 'GET',
    status: 'paused',
    pollingInterval: 3600, // 1 hour
    lastChecked: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    changesDetected: 0,
    successRate: 85.5,
    avgResponseTime: 1200,
  },
}

/**
 * API connection with circuit breaker open due to failures
 */
export const CircuitOpen: Story = {
  args: {
    ...Active.args,
    name: 'Third-party Analytics',
    endpoint: 'https://analytics.external.com/events',
    method: 'POST',
    status: 'circuit-open',
    pollingInterval: 60,
    lastChecked: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    changesDetected: 0,
    successRate: 45.8,
    avgResponseTime: 4500,
    sparklineData: [4200, 4800, 4500, 5000, 4300, 4900, 4600, 4750, 4400, 4650],
  },
}

/**
 * High-frequency API with excellent performance
 */
export const HighFrequency: Story = {
  args: {
    ...Active.args,
    name: 'Real-time Stock Prices',
    endpoint: 'wss://market.api.com/stocks/realtime',
    method: 'GET',
    status: 'active',
    pollingInterval: 5,
    lastChecked: new Date(Date.now() - 3 * 1000), // 3 seconds ago
    changesDetected: 1847,
    successRate: 99.95,
    avgResponseTime: 85,
    sparklineData: [80, 78, 82, 75, 88, 79, 83, 77, 81, 85],
  },
}

/**
 * API connection with all interactive controls
 */
export const WithAllControls: Story = {
  args: {
    ...Active.args,
    name: 'Customer Orders API',
    endpoint: 'https://orders.api.com/v2/orders',
    method: 'GET',
    status: 'active',
  },
}

/**
 * Minimal API connection without optional metrics
 */
export const Minimal: Story = {
  args: {
    name: 'Simple Health Check',
    endpoint: 'https://api.example.com/health',
    method: 'GET',
    status: 'active',
    pollingInterval: 300, // 5 minutes
    lastChecked: new Date(Date.now() - 60 * 1000), // 1 minute ago
    changesDetected: 5,
    // No success rate, response time, or sparkline data
  },
}

/**
 * Long endpoint URL that will be truncated
 */
export const LongEndpoint: Story = {
  args: {
    ...Active.args,
    name: 'Very Long API Name That Should Be Truncated Properly',
    endpoint:
      'https://very-long-domain-name.example.com/api/v3/deeply/nested/endpoints/with/many/path/segments/and/query/parameters?filter=active&sort=desc&limit=100',
    method: 'PATCH',
    status: 'active',
  },
}
