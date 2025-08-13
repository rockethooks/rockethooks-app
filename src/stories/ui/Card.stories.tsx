import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

/**
 * Card component providing a flexible container for content with header, body, and footer sections.
 * Perfect for organizing related information and creating consistent layouts.
 */
const meta = {
  title: 'Core UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Card component is a versatile container that groups related content together.
It provides a consistent structure with optional header, content, and footer sections.

## Features

- **Flexible Structure**: Header, content, and footer sections
- **Consistent Styling**: Matches design system colors and spacing
- **Responsive Design**: Adapts to different screen sizes
- **Accessible**: Proper semantic structure and focus management

## Usage

\`\`\`tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

## Card Subcomponents

- **CardHeader**: Contains title and description
- **CardTitle**: Primary heading for the card
- **CardDescription**: Secondary text describing the card content
- **CardContent**: Main content area
- **CardFooter**: Action area, typically containing buttons
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with all sections
 */
export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description of what this card contains and what the user can
          do with it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card. You can put any content
          here including text, forms, charts, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
        <Button variant="outline" className="ml-2">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with only header and content
 */
export const SimpleCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          A minimal card with just a title and content. Perfect for displaying
          information without requiring user actions.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A minimal card structure with just header and content sections.',
      },
    },
  },
};

/**
 * Card with status and metrics - common in RocketHooks
 */
export const StatusCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">API Endpoint Status</CardTitle>
          <Badge variant="success">
            <div className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />
            Active
          </Badge>
        </div>
        <CardDescription>https://api.example.com/users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold">245ms</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm">Test Connection</Button>
        <Button variant="outline" size="sm" className="ml-2">
          Edit
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A status card showing API endpoint information with metrics and actions.',
      },
    },
  },
};

/**
 * Metric card for dashboard display
 */
export const MetricCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Requests
            </p>
            <p className="text-2xl font-bold">1,234,567</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Trending up</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              12.5% vs last month
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Analytics chart</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A metric card for displaying key performance indicators on dashboards.',
      },
    },
  },
};

/**
 * Event card showing webhook activity
 */
export const EventCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium">
              Webhook Delivered
            </CardTitle>
            <CardDescription className="text-xs">2 minutes ago</CardDescription>
          </div>
          <Badge variant="success" className="text-xs">
            200
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Endpoint:</span>
            <span className="font-mono">POST /webhooks/user-created</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Response Time:</span>
            <span>142ms</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Payload Size:</span>
            <span>1.2KB</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button variant="outline" size="sm" className="text-xs">
          View Details
        </Button>
        <Button variant="ghost" size="sm" className="text-xs ml-2">
          Retry
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An event card showing webhook delivery information with detailed metadata.',
      },
    },
  },
};

/**
 * Form card with input elements
 */
export const FormCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Create API Connection</CardTitle>
        <CardDescription>
          Add a new API endpoint to monitor for changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="endpoint-url" className="text-sm font-medium">
            Endpoint URL
          </label>
          <input
            id="endpoint-url"
            type="url"
            placeholder="https://api.example.com/endpoint"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            aria-describedby="endpoint-url-help"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="http-method" className="text-sm font-medium">
            HTTP Method
          </label>
          <select
            id="http-method"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            aria-describedby="http-method-help"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="polling-interval" className="text-sm font-medium">
            Polling Interval
          </label>
          <select
            id="polling-interval"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            aria-describedby="polling-interval-help"
          >
            <option>Every 30 seconds</option>
            <option>Every minute</option>
            <option>Every 5 minutes</option>
            <option>Every hour</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Create Connection</Button>
        <Button variant="outline" className="ml-2">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A form card containing input elements for creating new resources.',
      },
    },
  },
};

/**
 * Multiple cards in a grid layout
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {/* Metric Cards */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Active APIs
              </p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Lightning bolt</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Webhooks Sent
              </p>
              <p className="text-2xl font-bold">1,456</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Send arrow</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Success Rate
              </p>
              <p className="text-2xl font-bold">98.5%</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Check circle</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple metric cards arranged in a responsive grid layout.',
      },
    },
  },
};

/**
 * Card with hover effects and interactions
 */
export const InteractiveCard: Story = {
  render: () => (
    <Card className="w-96 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Registration API</CardTitle>
            <CardDescription>Monitors new user sign-ups</CardDescription>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last checked:</span>
            <span>2 minutes ago</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Changes detected:</span>
            <span className="font-medium text-green-600">3 new users</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An interactive card with hover effects and visual feedback.',
      },
    },
  },
};

/**
 * Empty state card
 */
export const EmptyState: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent className="p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Add icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <CardTitle className="mb-2">No API Connections</CardTitle>
        <CardDescription className="mb-4">
          Get started by creating your first API connection to monitor for
          changes.
        </CardDescription>
        <Button>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Add icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add API Connection
        </Button>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An empty state card used when there is no content to display.',
      },
    },
  },
};

/**
 * Playground for testing card properties
 */
export const Playground: Story = {
  render: ({ ...args }) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>Playground Card</CardTitle>
        <CardDescription>
          Use the controls to customize this card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is a playground card where you can test different properties and
          configurations using the Storybook controls.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Primary Action</Button>
        <Button variant="outline" className="ml-2">
          Secondary
        </Button>
      </CardFooter>
    </Card>
  ),
};
