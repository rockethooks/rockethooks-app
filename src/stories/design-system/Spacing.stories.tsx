import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'

/**
 * Spacing system documentation showing the design tokens and their usage
 * in layouts, components, and content organization.
 */

const SpacingExample: React.FC<{
  size: string
  value: string
  description: string
}> = ({ size, value, description }) => (
  <div className="flex items-center gap-4 p-4 border rounded">
    <div className="flex items-center gap-2">
      <div
        className="bg-blue-500 rounded"
        style={{
          width: `var(--space-${size})`,
          height: `var(--space-${size})`,
          minWidth: '4px',
          minHeight: '4px',
        }}
      />
      <code className="text-sm font-mono">--space-{size}</code>
    </div>
    <div className="text-sm text-muted-foreground">{value}</div>
    <div className="text-sm">{description}</div>
  </div>
)

function SpacingComponent() {
  return (
    <div
      className="max-w-4xl mx-auto p-8 min-h-screen"
      style={{ backgroundColor: 'var(--surface-secondary)' }}
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            background:
              'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Spacing System
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Consistent spacing creates visual hierarchy and improves readability.
          Our spacing system uses a base unit of 4px with a mathematical scale.
        </p>
      </div>

      {/* Spacing Scale */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Spacing Scale
        </h2>

        <div className="space-y-3">
          <SpacingExample
            size="0"
            value="0"
            description="No spacing - for touching elements"
          />
          <SpacingExample
            size="1"
            value="4px"
            description="Minimal spacing - between related items"
          />
          <SpacingExample
            size="2"
            value="8px"
            description="Small spacing - form elements, badges"
          />
          <SpacingExample
            size="3"
            value="12px"
            description="Default spacing - most common use"
          />
          <SpacingExample
            size="4"
            value="16px"
            description="Medium spacing - component padding"
          />
          <SpacingExample
            size="5"
            value="20px"
            description="Large spacing - section separation"
          />
          <SpacingExample
            size="6"
            value="24px"
            description="XL spacing - card padding"
          />
          <SpacingExample
            size="8"
            value="32px"
            description="2XL spacing - component margins"
          />
          <SpacingExample
            size="10"
            value="40px"
            description="3XL spacing - section headers"
          />
          <SpacingExample
            size="12"
            value="48px"
            description="4XL spacing - page sections"
          />
          <SpacingExample
            size="16"
            value="64px"
            description="5XL spacing - major sections"
          />
          <SpacingExample
            size="20"
            value="80px"
            description="6XL spacing - page layouts"
          />
          <SpacingExample
            size="24"
            value="96px"
            description="7XL spacing - hero sections"
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Common Usage Patterns
        </h2>

        {/* Card Example */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Card Component Spacing
          </h3>
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-2">Card Header</h4>
              <p className="text-sm text-muted-foreground">
                Header uses space-6 (24px) padding and space-4 (16px) bottom
                margin
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Card content with space-4 (16px) bottom margin between
                paragraphs. This creates comfortable reading flow without being
                too loose.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-inverse)',
                }}
              >
                Primary Action
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-secondary)',
                }}
              >
                Secondary
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Card uses: padding space-6, margins space-4, button gap space-3
          </p>
        </div>

        {/* Form Example */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Form Spacing
          </h3>
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="mb-5">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--border-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--border-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" className="rounded" />
              <label
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                Remember me
              </label>
            </div>

            <button
              className="w-full py-3 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-inverse)',
              }}
            >
              Sign In
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Form uses: field margin space-5, label margin space-2, checkbox gap
            space-2
          </p>
        </div>

        {/* List Example */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            List Item Spacing
          </h3>
          <div
            className="rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            {[
              { title: 'User Profile API', status: 'Active', time: '2m ago' },
              { title: 'Payment Gateway', status: 'Error', time: '5m ago' },
              { title: 'Analytics API', status: 'Active', time: '1m ago' },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-4 flex items-center justify-between ${
                  index < 2 ? 'border-b' : ''
                }`}
                style={{
                  borderColor: 'var(--border-primary)',
                }}
              >
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Last checked {item.time}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Active'
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            List uses: item padding space-4, title margin space-1, badge padding
            space-3/1
          </p>
        </div>
      </div>

      {/* Layout Examples */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Layout Spacing
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Vertical Rhythm
            </h3>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <h4 className="text-base font-semibold mb-3">Section Title</h4>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                First paragraph with space-4 bottom margin.
              </p>
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                Second paragraph with space-6 bottom margin before the list.
              </p>
              <ul
                className="space-y-2 text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <li>List item with space-2 gap</li>
                <li>Another list item</li>
                <li>Final list item</li>
              </ul>
            </div>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Component Grid
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border text-center"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <div
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Card {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Spacing Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Do's
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• Use consistent spacing throughout your design</li>
              <li>• Follow the 4px base unit for all measurements</li>
              <li>• Use larger spacing for major sections</li>
              <li>• Group related elements with smaller spacing</li>
              <li>• Test spacing on different screen sizes</li>
            </ul>
          </div>
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Don'ts
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• Don't use arbitrary pixel values</li>
              <li>• Don't cram too much content together</li>
              <li>• Don't use the same spacing for all contexts</li>
              <li>• Don't forget mobile spacing considerations</li>
              <li>• Don't mix different spacing systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Design System/Spacing',
  component: SpacingComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The RocketHooks spacing system provides consistent measurements for all layout and component spacing.
Based on a 4px unit with a mathematical scale for predictable and harmonious layouts.

## Spacing Scale

Our spacing system uses CSS custom properties with a base unit of 4px:

- **space-0**: 0 - No spacing
- **space-1**: 4px - Minimal spacing  
- **space-2**: 8px - Small spacing
- **space-3**: 12px - Default spacing
- **space-4**: 16px - Medium spacing
- **space-5**: 20px - Large spacing
- **space-6**: 24px - XL spacing
- **space-8**: 32px - 2XL spacing
- **space-10**: 40px - 3XL spacing
- **space-12**: 48px - 4XL spacing
- **space-16**: 64px - 5XL spacing
- **space-20**: 80px - 6XL spacing  
- **space-24**: 96px - 7XL spacing

## Usage Principles

1. **Consistency**: Use the same spacing values throughout the interface
2. **Hierarchy**: Larger spacing for major sections, smaller for related content
3. **Rhythm**: Establish vertical and horizontal rhythm with consistent gaps
4. **Context**: Consider the relationship between elements when choosing spacing
5. **Responsiveness**: Adjust spacing for different screen sizes appropriately
        `,
      },
    },
  },
} satisfies Meta<typeof SpacingComponent>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Complete spacing system documentation with examples and usage guidelines
 */
export const SpacingSystem: Story = {}
