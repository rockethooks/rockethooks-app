import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '@/components/ui/Badge';

/**
 * Badge component for displaying status, labels, and categorical information.
 * Supports multiple variants for different semantic meanings and visual hierarchy.
 */
const meta = {
  title: 'Core UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Badge component displays small pieces of information such as status, labels,
or categorical data. It's designed to be compact and visually distinct.

## Features

- **Multiple Variants**: Default, secondary, destructive, outline, and semantic variants
- **Flexible Content**: Supports text, icons, and combinations
- **Consistent Styling**: Matches the overall design system
- **Accessibility**: Proper color contrast and semantic meaning

## Usage

\`\`\`tsx
import { Badge } from '@/components/ui/Badge'

// Basic usage
<Badge>New</Badge>

// With variant
<Badge variant="destructive">Error</Badge>

// With icon
<Badge variant="success">
  <CheckIcon className="w-3 h-3 mr-1" />
  Active
</Badge>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ],
      description: 'Badge variant affecting color and style',
    },
    children: {
      control: { type: 'text' },
      description: 'Badge content',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge variant
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * All badge variants demonstrating different semantic meanings
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different badge variants for various semantic meanings and visual hierarchy.',
      },
    },
  },
};

/**
 * Badges with status indicators showing API connection states
 */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success">
        <div className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />
        Active
      </Badge>
      <Badge variant="warning">
        <div className="w-2 h-2 bg-current rounded-full mr-1.5" />
        Polling
      </Badge>
      <Badge variant="destructive">
        <div className="w-2 h-2 bg-current rounded-full mr-1.5" />
        Error
      </Badge>
      <Badge variant="secondary">
        <div className="w-2 h-2 bg-current rounded-full mr-1.5" />
        Paused
      </Badge>
      <Badge variant="info">
        <div className="w-2 h-2 bg-current rounded-full mr-1.5" />
        Pending
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status badges with indicator dots commonly used in RocketHooks for API connection states.',
      },
    },
  },
};

/**
 * Badges with icons for enhanced meaning
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-labelledby="check-icon-title"
          role="img"
        >
          <title id="check-icon-title">Check mark icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Verified
      </Badge>
      <Badge variant="warning">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-labelledby="warning-icon-title"
          role="img"
        >
          <title id="warning-icon-title">Warning icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        Warning
      </Badge>
      <Badge variant="destructive">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-labelledby="close-icon-title"
          role="img"
        >
          <title id="close-icon-title">Close icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Failed
      </Badge>
      <Badge variant="info">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-labelledby="info-icon-title"
          role="img"
        >
          <title id="info-icon-title">Information icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Info
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges with icons provide additional visual context and meaning.',
      },
    },
  },
};

/**
 * Badges showing counts and numbers
 */
export const CountBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">3</Badge>
      <Badge variant="destructive">12</Badge>
      <Badge variant="success">New</Badge>
      <Badge variant="secondary">99+</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges can display counts, numbers, or short text labels.',
      },
    },
  },
};

/**
 * Different badge sizes and styles
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Small:</span>
        <Badge className="text-xs px-1.5 py-0.5">Compact</Badge>
        <Badge variant="success" className="text-xs px-1.5 py-0.5">
          Active
        </Badge>
        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
          Error
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Default:</span>
        <Badge>Standard</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="destructive">Error</Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Large:</span>
        <Badge className="text-sm px-3 py-1">Large Badge</Badge>
        <Badge variant="success" className="text-sm px-3 py-1">
          Active
        </Badge>
        <Badge variant="destructive" className="text-sm px-3 py-1">
          Error
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges can be customized to different sizes using className overrides.',
      },
    },
  },
};

/**
 * RocketHooks-specific badge usage patterns
 */
export const RocketHooksPatterns: Story = {
  render: () => (
    <div className="space-y-6">
      {/* HTTP Methods */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">HTTP Methods</h4>
        <div className="flex gap-2">
          <Badge variant="success" className="font-mono text-xs">
            GET
          </Badge>
          <Badge variant="info" className="font-mono text-xs">
            POST
          </Badge>
          <Badge variant="warning" className="font-mono text-xs">
            PUT
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            PATCH
          </Badge>
          <Badge variant="destructive" className="font-mono text-xs">
            DELETE
          </Badge>
        </div>
      </div>

      {/* Plan Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Subscription Plans
        </h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Free</Badge>
          <Badge variant="info">Pro</Badge>
          <Badge
            variant="default"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Enterprise
          </Badge>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Event Types</h4>
        <div className="flex gap-2">
          <Badge variant="success">webhook.sent</Badge>
          <Badge variant="info">api.polled</Badge>
          <Badge variant="warning">retry.attempted</Badge>
          <Badge variant="destructive">delivery.failed</Badge>
        </div>
      </div>

      {/* Environment */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Environments</h4>
        <div className="flex gap-2">
          <Badge variant="success">Production</Badge>
          <Badge variant="warning">Staging</Badge>
          <Badge variant="secondary">Development</Badge>
          <Badge variant="outline">Local</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Common badge patterns used throughout the RocketHooks application.',
      },
    },
  },
};

/**
 * Interactive badges with hover states
 */
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge
        variant="outline"
        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Clickable
      </Badge>
      <Badge
        variant="secondary"
        className="cursor-pointer hover:bg-secondary/80 transition-colors"
      >
        Filter: Active
        <svg
          className="w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-labelledby="remove-filter-icon-title"
          role="img"
        >
          <title id="remove-filter-icon-title">Remove filter icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Badge>
      <Badge
        variant="info"
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        Status: Online
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges can be made interactive with hover states and click handlers.',
      },
    },
  },
};

/**
 * Playground for testing all badge properties
 */
export const Playground: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};
