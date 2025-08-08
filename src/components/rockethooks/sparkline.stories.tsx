import type { Meta, StoryObj } from '@storybook/react'

import { Sparkline } from './sparkline'

/**
 * Sparkline component provides lightweight chart visualization for activity data.
 * Perfect for showing trends in small spaces with optional tooltips and gradient fills.
 */
const meta = {
  title: 'RocketHooks/Sparkline',
  component: Sparkline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Lightweight SVG chart component for visualizing data trends in small spaces. Supports tooltips, gradients, and custom colors.',
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Array of numbers to visualize',
    },
    width: {
      control: { type: 'number', min: 50, max: 400, step: 10 },
      description: 'Width of the sparkline in pixels',
    },
    height: {
      control: { type: 'number', min: 20, max: 200, step: 5 },
      description: 'Height of the sparkline in pixels',
    },
    color: {
      control: { type: 'select' },
      options: [
        'text-primary',
        'text-success',
        'text-warning',
        'text-destructive',
        'text-info',
        'text-muted-foreground',
      ],
      description: 'CSS color class for the sparkline',
    },
    showTooltip: {
      control: { type: 'boolean' },
      description: 'Enable interactive tooltips on hover',
    },
    gradient: {
      control: { type: 'boolean' },
      description: 'Enable gradient fill under the line',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

const responseTimeData = [
  200, 180, 220, 195, 210, 185, 205, 190, 215, 200, 225, 180,
]
const uptrendData = [10, 15, 12, 20, 18, 25, 22, 30, 28, 35, 32, 40]
const downtrendData = [100, 95, 98, 90, 85, 88, 80, 75, 78, 70, 65, 60]
const volatileData = [50, 75, 30, 90, 20, 80, 40, 95, 25, 85, 35, 70]
const steadyData = [50, 52, 48, 51, 49, 53, 47, 52, 50, 51, 49, 50]

/**
 * Basic sparkline with response time data
 */
export const Default: Story = {
  args: {
    data: responseTimeData,
  },
}

/**
 * Sparkline with gradient fill enabled
 */
export const WithGradient: Story = {
  args: {
    data: responseTimeData,
    gradient: true,
  },
}

/**
 * Interactive sparkline with tooltip on hover
 */
export const WithTooltip: Story = {
  args: {
    data: responseTimeData,
    showTooltip: true,
  },
}

/**
 * Success-colored sparkline for positive metrics
 */
export const SuccessColor: Story = {
  args: {
    data: uptrendData,
    color: 'text-success',
    gradient: true,
  },
}

/**
 * Warning-colored sparkline for concerning trends
 */
export const WarningColor: Story = {
  args: {
    data: volatileData,
    color: 'text-warning',
    gradient: true,
  },
}

/**
 * Error-colored sparkline for negative metrics
 */
export const ErrorColor: Story = {
  args: {
    data: downtrendData,
    color: 'text-destructive',
    gradient: true,
  },
}

/**
 * Larger sparkline for more detailed visualization
 */
export const Large: Story = {
  args: {
    data: responseTimeData,
    width: 200,
    height: 60,
    gradient: true,
    showTooltip: true,
  },
}

/**
 * Small sparkline for compact displays
 */
export const Small: Story = {
  args: {
    data: responseTimeData,
    width: 60,
    height: 20,
  },
}

/**
 * Sparkline with no data to show empty state
 */
export const NoData: Story = {
  args: {
    data: [],
    width: 120,
    height: 40,
  },
}

/**
 * Sparkline with single data point
 */
export const SinglePoint: Story = {
  args: {
    data: [75],
    width: 80,
    height: 30,
    color: 'text-info',
  },
}

/**
 * Upward trending data showing growth
 */
export const Uptrend: Story = {
  args: {
    data: uptrendData,
    color: 'text-success',
    gradient: true,
    showTooltip: true,
  },
}

/**
 * Downward trending data showing decline
 */
export const Downtrend: Story = {
  args: {
    data: downtrendData,
    color: 'text-destructive',
    gradient: true,
    showTooltip: true,
  },
}

/**
 * Highly volatile data with frequent changes
 */
export const Volatile: Story = {
  args: {
    data: volatileData,
    color: 'text-warning',
    gradient: true,
    showTooltip: true,
    width: 120,
    height: 50,
  },
}

/**
 * Steady data with minimal variation
 */
export const Steady: Story = {
  args: {
    data: steadyData,
    color: 'text-muted-foreground',
    gradient: true,
    showTooltip: true,
  },
}

/**
 * Comparison of different sparkline styles
 */
export const Comparison: Story = {
  render: function ComparisonRender() {
    return (
      <div className="flex flex-col gap-6 p-4 bg-background">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Response Times (Good)</h4>
          <Sparkline data={responseTimeData} color="text-success" gradient />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Error Rates (Warning)</h4>
          <Sparkline data={volatileData} color="text-warning" gradient />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Throughput (Declining)</h4>
          <Sparkline data={downtrendData} color="text-destructive" gradient />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">CPU Usage (Stable)</h4>
          <Sparkline data={steadyData} color="text-muted-foreground" gradient />
        </div>
      </div>
    )
  },
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: {
        story:
          'Comparison of sparklines with different colors and data patterns',
      },
    },
  },
}
