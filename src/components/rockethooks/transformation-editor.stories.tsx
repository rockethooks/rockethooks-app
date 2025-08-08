import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { TransformationEditor } from './transformation-editor'

/**
 * TransformationEditor provides a dual-mode interface for creating webhook payload transformations.
 * Supports both visual (drag-and-drop) and code (JSON) editing modes with validation and previews.
 */
const meta = {
  title: 'RocketHooks/TransformationEditor',
  component: TransformationEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dual-mode editor for creating webhook payload transformations. Features visual and code editing modes with real-time validation and preview capabilities.',
      },
    },
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['visual', 'code'],
      description: 'Initial editing mode (visual or code)',
    },
    value: {
      control: { type: 'text' },
      description: 'Current transformation JSON string',
    },
    onChange: { action: 'transformation changed' },
    inputSchema: {
      control: { type: 'object' },
      description: 'Schema of the input payload for reference',
    },
    outputPreview: {
      control: { type: 'object' },
      description: 'Preview of transformed output',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TransformationEditor>

export default meta
type Story = StoryObj<typeof meta>

const sampleInputSchema = {
  data: {
    user: {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    },
    order: {
      id: 'ORD-001',
      items: [
        { name: 'Laptop', price: 999.99, quantity: 1 },
        { name: 'Mouse', price: 29.99, quantity: 2 },
      ],
      total: 1059.97,
      status: 'confirmed',
    },
    metadata: {
      source: 'web',
      timestamp: 1634567890,
      version: '2.1',
    },
  },
}

const sampleOutputPreview = {
  user_name: 'John Doe',
  user_type: 'administrator',
  order_id: 'ORD-001',
  order_total: 1059.97,
  item_count: 2,
  created_at: 1634567890,
  status: 'active',
}

const basicTransformation = `{
  "user_name": "$.data.user.name",
  "user_type": "$.data.user.role == 'admin' ? 'administrator' : 'user'",
  "order_id": "$.data.order.id",
  "order_total": "$.data.order.total",
  "item_count": "$.data.order.items.length",
  "created_at": "$.data.metadata.timestamp",
  "status": "active"
}`

const complexTransformation = `{
  "customer": {
    "name": "$.data.user.name",
    "email": "$.data.user.email",
    "is_premium": "$.data.user.role == 'premium'"
  },
  "order_summary": {
    "id": "$.data.order.id",
    "total_amount": "$.data.order.total",
    "items": "$.data.order.items[*].{product: name, cost: price * quantity}",
    "is_high_value": "$.data.order.total > 500"
  },
  "processing": {
    "timestamp": "$.data.metadata.timestamp",
    "source_system": "$.data.metadata.source",
    "api_version": "$.data.metadata.version",
    "webhook_id": "generated_id_123"
  }
}`

/**
 * Default transformation editor in code mode
 */
export const Default: Story = {
  args: {
    mode: 'code',
    value: basicTransformation,
    onChange: () => {},
  },
}

/**
 * Interactive transformation editor with state management
 */
export const Interactive: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState(basicTransformation)

    return (
      <TransformationEditor
        {...args}
        value={value}
        onChange={setValue}
        inputSchema={sampleInputSchema}
        outputPreview={sampleOutputPreview}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Fully interactive transformation editor with real-time updates',
      },
    },
  },
}

/**
 * Visual mode (placeholder for future drag-and-drop interface)
 */
export const VisualMode: Story = {
  args: {
    mode: 'visual',
    value: basicTransformation,
    inputSchema: sampleInputSchema,
    onChange: () => {},
  },
}

/**
 * Code mode with syntax validation
 */
export const CodeMode: Story = {
  args: {
    mode: 'code',
    value: basicTransformation,
    inputSchema: sampleInputSchema,
    outputPreview: sampleOutputPreview,
    onChange: () => {},
  },
}

/**
 * Complex transformation with nested objects and arrays
 */
export const ComplexTransformation: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState(complexTransformation)

    return (
      <TransformationEditor
        {...args}
        mode="code"
        value={value}
        onChange={setValue}
        inputSchema={sampleInputSchema}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Complex transformation with nested objects, arrays, and conditional logic',
      },
    },
  },
}

/**
 * Editor with invalid JSON to show error handling
 */
export const InvalidSyntax: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState(`{
  "user_name": "$.data.user.name",
  "invalid_json": "missing quote
  "another_field": "value"`)

    return (
      <TransformationEditor
        {...args}
        mode="code"
        value={value}
        onChange={setValue}
        inputSchema={sampleInputSchema}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Demonstration of syntax error handling and validation',
      },
    },
  },
}

/**
 * Editor with only input schema (no output preview)
 */
export const InputSchemaOnly: Story = {
  args: {
    mode: 'code',
    value: basicTransformation,
    inputSchema: sampleInputSchema,
  },
}

/**
 * Minimal editor without schema or preview
 */
export const Minimal: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState(`{
  "output_field": "$.input.field",
  "computed_value": "$.data.value * 2"
}`)

    return (
      <TransformationEditor
        {...args}
        mode="code"
        value={value}
        onChange={setValue}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Minimal transformation editor without input schema or output preview',
      },
    },
  },
}

/**
 * Empty editor for starting from scratch
 */
export const Empty: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState('')

    return (
      <TransformationEditor
        {...args}
        mode="code"
        value={value}
        onChange={setValue}
        inputSchema={sampleInputSchema}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Empty transformation editor for creating new transformations from scratch',
      },
    },
  },
}

/**
 * Array transformation example
 */
export const ArrayTransformation: Story = {
  render: function RenderFunction(args) {
    const [value, setValue] = useState(`{
  "items": "$.data.order.items[*].{name: name, total_price: price * quantity}",
  "item_names": "$.data.order.items[*].name",
  "total_quantity": "$.data.order.items[*].quantity.sum()",
  "average_price": "$.data.order.items[*].price.avg()"
}`)

    return (
      <TransformationEditor
        {...args}
        mode="code"
        value={value}
        onChange={setValue}
        inputSchema={sampleInputSchema}
      />
    )
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of array transformations and aggregations',
      },
    },
  },
}
