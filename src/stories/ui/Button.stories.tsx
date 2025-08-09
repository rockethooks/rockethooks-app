import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from '@/components/ui/button'

/**
 * The Button component is a versatile interactive element that supports multiple variants,
 * sizes, and states. It follows accessibility best practices and includes loading states,
 * focus management, and keyboard navigation.
 *
 * Built with Radix UI primitives and class-variance-authority for consistent styling.
 */
const meta = {
  title: 'Core UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component provides consistent interactive elements across the RocketHooks platform.
It supports multiple variants for different semantic meanings and use cases.

## Features

- **Multiple Variants**: Primary, secondary, outline, ghost, destructive, and semantic variants
- **Sizes**: Small, default, and large sizes for different contexts
- **Loading State**: Built-in loading spinner with proper accessibility
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Flexible Rendering**: Can render as different elements using the \`asChild\` prop

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/button'

// Basic usage
<Button onClick={handleClick}>Save Changes</Button>

// With variant and size
<Button variant="destructive" size="sm">Delete</Button>

// Loading state
<Button loading>Processing...</Button>

// Render as link
<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>
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
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'Button variant affecting color and style',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading spinner and disables button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button',
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Renders as child element instead of button',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
    onClick: { action: 'clicked' },
  },
  args: { onClick: fn() },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default primary button variant used for main actions
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

/**
 * All button variants demonstrating different semantic meanings
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different button variants for various use cases and semantic meanings.',
      },
    },
  },
}

/**
 * Different button sizes for various contexts
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Button sizes: small for compact layouts, default for general use, and large for prominent actions.',
      },
    },
  },
}

/**
 * Buttons with icons demonstrating proper spacing and alignment
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Item
      </Button>
      <Button variant="outline">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Edit
      </Button>
      <Button variant="destructive">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Buttons with icons are automatically spaced correctly. Icons inherit the text color.',
      },
    },
  },
}

/**
 * Icon-only buttons for actions where space is limited
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button size="icon" variant="outline" aria-label="Edit">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </Button>
      <Button size="icon" variant="outline" aria-label="Delete">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
      <Button size="icon" variant="outline" aria-label="Settings">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only buttons should always include proper aria-label for accessibility.',
      },
    },
  },
}

/**
 * Loading state with spinner animation
 */
export const Loading: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button loading>Processing...</Button>
      <Button variant="outline" loading>
        Loading...
      </Button>
      <Button variant="destructive" loading>
        Deleting...
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Loading buttons show a spinner and are automatically disabled. Use meaningful loading text.',
      },
    },
  },
}

/**
 * Disabled state demonstration
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="destructive" disabled>
        Disabled Destructive
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons have reduced opacity and are not interactive.',
      },
    },
  },
}

/**
 * Semantic variants for different states and actions
 */
export const SemanticVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button variant="success">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Approve
        </Button>
        <Button variant="warning">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          Warning
        </Button>
        <Button variant="info">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Info
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic variants provide visual context for different types of actions.',
      },
    },
  },
}

/**
 * Button groups and layouts for common patterns
 */
export const ButtonGroups: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Primary with Secondary */}
      <div className="flex gap-3">
        <Button>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>

      {/* Action group */}
      <div className="flex gap-2">
        <Button size="sm">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New
        </Button>
        <Button variant="outline" size="sm">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </Button>
        <Button variant="destructive" size="sm">
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </Button>
      </div>

      {/* Full width */}
      <Button className="w-full">Full Width Button</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Common button groupings and layout patterns used in forms and interfaces.',
      },
    },
  },
}

/**
 * Playground for testing all button properties
 */
export const Playground: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'default',
    loading: false,
    disabled: false,
  },
}
