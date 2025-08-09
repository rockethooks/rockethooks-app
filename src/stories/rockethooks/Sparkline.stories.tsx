import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkline } from '@/components/rockethooks/sparkline'

/**
 * Sparkline component provides lightweight data visualization for showing trends
 * and patterns in time-series data. Perfect for dashboard metrics and inline charts.
 */
const meta = {
  title: 'RocketHooks/Sparkline',
  component: Sparkline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Sparkline component is a minimal chart designed to show trends in data without
taking up much space. It's commonly used in dashboards, tables, and cards to provide
quick visual context for metrics like response times, success rates, or activity levels.

## Features

- **Lightweight**: Minimal SVG-based implementation
- **Interactive**: Optional tooltips and hover states
- **Customizable**: Adjustable colors, gradients, and dimensions
- **Accessible**: Proper ARIA labels and semantic markup
- **Responsive**: Scales to different container sizes
- **Performance**: Optimized for real-time data updates

## Usage

\`\`\`tsx
import { Sparkline } from '@/components/rockethooks/sparkline'

// Basic usage
<Sparkline data={[1, 3, 2, 8, 5, 7, 4]} />

// With customization
<Sparkline 
  data={responseTimeData}
  width={120}
  height={32}
  color="text-green-600"
  gradient
  showTooltip
/>
\`\`\`

## Use Cases

- **Response Time Trends**: Show API response time patterns
- **Success Rate History**: Visualize uptime and reliability
- **Activity Levels**: Display traffic or usage patterns
- **Performance Metrics**: Show any time-series KPI data
        `,
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Array of numeric data points',
    },
    width: {
      control: { type: 'number', min: 20, max: 200, step: 10 },
      description: 'Chart width in pixels',
    },
    height: {
      control: { type: 'number', min: 12, max: 80, step: 4 },
      description: 'Chart height in pixels',
    },
    color: {
      control: { type: 'select' },
      options: [
        'text-primary',
        'text-green-600',
        'text-blue-600',
        'text-red-600',
        'text-yellow-600',
        'text-purple-600',
      ],
      description: 'Chart color class',
    },
    showTooltip: {
      control: { type: 'boolean' },
      description: 'Show tooltip on hover',
    },
    gradient: {
      control: { type: 'boolean' },
      description: 'Add gradient fill under the line',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

// Sample data sets for different scenarios
const responseTimeData = [
  145, 152, 138, 165, 142, 159, 146, 171, 155, 148, 163, 139,
]
const uptimeData = [
  99.2, 99.8, 99.5, 99.9, 99.1, 99.7, 99.6, 99.3, 99.8, 99.4, 99.9, 99.6,
]
const errorRateData = [
  2.1, 1.8, 2.5, 1.2, 1.9, 0.8, 1.5, 2.3, 1.1, 1.7, 0.9, 1.3,
]
const trafficData = [120, 135, 158, 142, 167, 189, 203, 178, 156, 171, 145, 132]
const volatileData = [50, 82, 35, 91, 23, 67, 78, 44, 89, 31, 76, 52]

/**
 * Basic sparkline with default settings
 */
export const Default: Story = {
  args: {
    data: responseTimeData,
  },
}

/**
 * Different chart sizes for various use cases
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Small (inline)</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm">Response Time:</span>
          <Sparkline
            data={responseTimeData}
            width={60}
            height={20}
            color="text-blue-600"
          />
          <span className="text-sm text-muted-foreground">145ms avg</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Medium (cards)</h4>
        <Sparkline
          data={responseTimeData}
          width={100}
          height={32}
          color="text-green-600"
          gradient
        />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Large (dashboard)</h4>
        <Sparkline
          data={responseTimeData}
          width={160}
          height={48}
          color="text-purple-600"
          gradient
          showTooltip
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sparkline sizes for various UI contexts.',
      },
    },
  },
}

/**
 * Color variations for different metric types
 */
export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Success Rate</span>
          <Sparkline
            data={uptimeData}
            color="text-green-600"
            width={80}
            height={24}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Response Time</span>
          <Sparkline
            data={responseTimeData}
            color="text-blue-600"
            width={80}
            height={24}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Error Rate</span>
          <Sparkline
            data={errorRateData}
            color="text-red-600"
            width={80}
            height={24}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Traffic</span>
          <Sparkline
            data={trafficData}
            color="text-purple-600"
            width={80}
            height={24}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">CPU Usage</span>
          <Sparkline
            data={volatileData}
            color="text-yellow-600"
            width={80}
            height={24}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Memory</span>
          <Sparkline
            data={[65, 67, 69, 71, 68, 72, 70, 74, 71, 73, 69, 71]}
            color="text-indigo-600"
            width={80}
            height={24}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Color coding for different types of metrics and KPIs.',
      },
    },
  },
}

/**
 * Interactive sparklines with tooltips
 */
export const Interactive: Story = {
  render: () => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">API Response Times</h4>
          <span className="text-sm text-muted-foreground">Last 12 hours</span>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <div className="text-2xl font-bold">152ms</div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <Sparkline
            data={responseTimeData}
            width={120}
            height={40}
            color="text-blue-600"
            showTooltip
            gradient
          />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Success Rate</h4>
          <span className="text-sm text-muted-foreground">Last 24 hours</span>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">99.5%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <Sparkline
            data={uptimeData}
            width={120}
            height={40}
            color="text-green-600"
            showTooltip
            gradient
          />
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive sparklines with hover tooltips showing exact values.',
      },
    },
  },
}

/**
 * Dashboard integration showing multiple metrics
 */
export const DashboardMetrics: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-green-600">+12.3% vs last week</p>
            </div>
            <Sparkline
              data={[8420, 9234, 8876, 9543, 10234, 11432, 12543]}
              width={80}
              height={32}
              color="text-blue-600"
              gradient
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-red-600">-0.3% vs last week</p>
            </div>
            <Sparkline
              data={[99.8, 99.5, 99.7, 99.2, 99.6, 99.1, 99.2]}
              width={80}
              height={32}
              color="text-green-600"
              gradient
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">248ms</div>
              <p className="text-xs text-green-600">-15ms vs last week</p>
            </div>
            <Sparkline
              data={[285, 276, 268, 252, 245, 251, 248]}
              width={80}
              height={32}
              color="text-blue-600"
              gradient
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active APIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-green-600">+2 vs last week</p>
            </div>
            <Sparkline
              data={[18, 19, 20, 22, 23, 24, 24]}
              width={80}
              height={32}
              color="text-purple-600"
              gradient
            />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard cards featuring sparklines alongside key metrics.',
      },
    },
  },
}

/**
 * Edge cases and data scenarios
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Edge Cases</h4>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">Empty data:</span>
            <Sparkline data={[]} width={80} height={24} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">Single point:</span>
            <Sparkline
              data={[50]}
              width={80}
              height={24}
              color="text-blue-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">All same values:</span>
            <Sparkline
              data={[100, 100, 100, 100, 100]}
              width={80}
              height={24}
              color="text-green-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">High volatility:</span>
            <Sparkline
              data={[10, 90, 5, 95, 15, 85, 20, 80]}
              width={80}
              height={24}
              color="text-red-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">Trending up:</span>
            <Sparkline
              data={[20, 25, 30, 35, 40, 45, 50, 55]}
              width={80}
              height={24}
              color="text-green-600"
              gradient
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm">Trending down:</span>
            <Sparkline
              data={[80, 75, 70, 65, 60, 55, 50, 45]}
              width={80}
              height={24}
              color="text-red-600"
              gradient
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Various edge cases and data patterns that the sparkline handles gracefully.',
      },
    },
  },
}

/**
 * Real-time data simulation
 */
export const RealTimeData: Story = {
  render: () => {
    const [data, setData] = React.useState([
      120, 135, 158, 142, 167, 189, 203, 178,
    ])

    React.useEffect(() => {
      const interval = setInterval(() => {
        setData((prev) => {
          const newData = [
            ...prev.slice(1),
            Math.floor(Math.random() * 100) + 100,
          ]
          return newData
        })
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }, [])

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Live API Traffic</h3>
            <p className="text-sm text-muted-foreground">
              Updates every second
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{data[data.length - 1]}</div>
            <div className="text-xs text-muted-foreground">requests/min</div>
          </div>
        </div>
        <Sparkline
          data={data}
          width={200}
          height={60}
          color="text-blue-600"
          gradient
          showTooltip
        />
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulated real-time data updates showing how sparklines handle dynamic data.',
      },
    },
  },
}

/**
 * Playground for testing all sparkline properties
 */
export const Playground: Story = {
  args: {
    data: responseTimeData,
    width: 100,
    height: 32,
    color: 'text-blue-600',
    showTooltip: true,
    gradient: false,
  },
}
