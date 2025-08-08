import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WebhookStatus } from '@/components/rockethooks/webhook-status'

/**
 * Table component providing consistent data presentation with proper semantic structure.
 * Built with accessibility in mind and includes responsive design patterns.
 */
const meta = {
  title: 'Core UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Table component provides a semantic and accessible way to display tabular data.
It includes proper table structure with header, body, and cell components.

## Features

- **Semantic HTML**: Uses proper table elements for accessibility
- **Responsive Design**: Handles overflow and mobile layouts
- **Consistent Styling**: Matches design system colors and spacing
- **Flexible Content**: Supports various content types in cells
- **Interactive Elements**: Can contain buttons, badges, and other components

## Usage

\`\`\`tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell><Badge variant="success">Active</Badge></TableCell>
      <TableCell><Button size="sm">Edit</Button></TableCell>
    </TableRow>
  </TableBody>
</Table>
\`\`\`

## Table Subcomponents

- **TableHeader**: Contains header rows
- **TableHead**: Individual header cell
- **TableBody**: Contains data rows
- **TableRow**: Individual data row
- **TableCell**: Individual data cell
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
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic table with simple data
 */
export const Default: Story = {
  render: () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>
              <Badge variant="success">Active</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
            <TableCell>
              <Badge variant="success">Active</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Bob Johnson</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>User</TableCell>
            <TableCell>
              <Badge variant="secondary">Inactive</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  ),
}

/**
 * API endpoints table with status and actions
 */
export const APIEndpoints: Story = {
  render: () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Success Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">User Profile API</div>
                <div className="text-sm text-muted-foreground">
                  https://api.example.com/users/profile
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="success" className="font-mono text-xs">GET</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="success">
                <div className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />
                Active
              </Badge>
            </TableCell>
            <TableCell>245ms</TableCell>
            <TableCell>99.8%</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Test</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">Payment Gateway</div>
                <div className="text-sm text-muted-foreground">
                  https://payment.api.com/transactions
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="info" className="font-mono text-xs">POST</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="destructive">
                <div className="w-2 h-2 bg-current rounded-full mr-1.5" />
                Error
              </Badge>
            </TableCell>
            <TableCell>2,850ms</TableCell>
            <TableCell>12.5%</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Test</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">Inventory Updates</div>
                <div className="text-sm text-muted-foreground">
                  https://inventory.api.com/stock-levels
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="success" className="font-mono text-xs">GET</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="warning">
                <div className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />
                Polling
              </Badge>
            </TableCell>
            <TableCell>180ms</TableCell>
            <TableCell>97.2%</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Test</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table showing API endpoints with status indicators and action buttons.',
      },
    },
  },
}

/**
 * Webhook events table with rich content
 */
export const WebhookEvents: Story = {
  render: () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">user.created</div>
                <div className="text-xs text-muted-foreground">
                  User registration webhook
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-mono text-sm">
                POST /webhooks/users
              </div>
            </TableCell>
            <TableCell>
              <WebhookStatus status="success" size="sm" />
            </TableCell>
            <TableCell>
              <Badge variant="success" className="text-xs">200</Badge>
            </TableCell>
            <TableCell>142ms</TableCell>
            <TableCell className="text-muted-foreground text-sm">2m ago</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">order.updated</div>
                <div className="text-xs text-muted-foreground">
                  Order status change
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-mono text-sm">
                POST /webhooks/orders
              </div>
            </TableCell>
            <TableCell>
              <WebhookStatus status="retrying" size="sm" />
            </TableCell>
            <TableCell>
              <Badge variant="warning" className="text-xs">429</Badge>
            </TableCell>
            <TableCell>850ms</TableCell>
            <TableCell className="text-muted-foreground text-sm">5m ago</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">payment.failed</div>
                <div className="text-xs text-muted-foreground">
                  Payment processing error
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-mono text-sm">
                POST /webhooks/payments
              </div>
            </TableCell>
            <TableCell>
              <WebhookStatus status="failed" size="sm" />
            </TableCell>
            <TableCell>
              <Badge variant="destructive" className="text-xs">500</Badge>
            </TableCell>
            <TableCell>3,200ms</TableCell>
            <TableCell className="text-muted-foreground text-sm">12m ago</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div>
                <div className="font-medium">inventory.updated</div>
                <div className="text-xs text-muted-foreground">
                  Stock level change
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-mono text-sm">
                POST /webhooks/inventory
              </div>
            </TableCell>
            <TableCell>
              <WebhookStatus status="pending" size="sm" />
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">-</Badge>
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell className="text-muted-foreground text-sm">15m ago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Webhook events table with detailed status information and rich content.',
      },
    },
  },
}

/**
 * Minimal table with simple structure
 */
export const Minimal: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>RocketHooks API</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Version</TableCell>
          <TableCell>v1.0.0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Environment</TableCell>
          <TableCell>Production</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Region</TableCell>
          <TableCell>us-east-1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal table without card wrapper for inline usage.',
      },
    },
  },
}

/**
 * Table with sortable headers
 */
export const SortableHeaders: Story = {
  render: () => {
    const [sortField, setSortField] = React.useState<string | null>('name')
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortDirection('asc')
      }
    }

    const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
      <TableHead
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortField === field && (
            <svg
              className={`w-4 h-4 transition-transform ${
                sortDirection === 'desc' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </div>
      </TableHead>
    )

    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="requests">Requests</SortableHeader>
              <SortableHeader field="success">Success Rate</SortableHeader>
              <SortableHeader field="response">Response Time</SortableHeader>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">User API</TableCell>
              <TableCell>12,543</TableCell>
              <TableCell>99.8%</TableCell>
              <TableCell>245ms</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment API</TableCell>
              <TableCell>8,234</TableCell>
              <TableCell>97.2%</TableCell>
              <TableCell>680ms</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Analytics API</TableCell>
              <TableCell>15,678</TableCell>
              <TableCell>99.1%</TableCell>
              <TableCell>156ms</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with sortable column headers and interactive sorting indicators.',
      },
    },
  },
}

/**
 * Table with row selection
 */
export const RowSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

    const handleRowSelect = (id: string) => {
      const newSelected = new Set(selectedRows)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      setSelectedRows(newSelected)
    }

    const handleSelectAll = () => {
      if (selectedRows.size === 3) {
        setSelectedRows(new Set())
      } else {
        setSelectedRows(new Set(['1', '2', '3']))
      }
    }

    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === 3}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </TableHead>
              <TableHead>API Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: '1', name: 'User Profile API', status: 'success', lastCheck: '2m ago' },
              { id: '2', name: 'Payment Gateway', status: 'error', lastCheck: '5m ago' },
              { id: '3', name: 'Analytics API', status: 'success', lastCheck: '1m ago' },
            ].map((item) => (
              <TableRow key={item.id} className={selectedRows.has(item.id) ? 'bg-muted/25' : ''}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'success' ? 'success' : 'destructive'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.lastCheck}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedRows.size > 0 && (
          <div className="p-4 bg-muted/25 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Enable</Button>
              <Button variant="outline" size="sm">Disable</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        )}
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with row selection checkboxes and bulk actions.',
      },
    },
  },
}

/**
 * Empty state table
 */
export const EmptyState: Story = {
  render: () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No data available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no items to display in this table.
                  </p>
                  <Button>Add First Item</Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table with empty state when no data is available.',
      },
    },
  },
}

/**
 * Responsive table with horizontal scroll
 */
export const ResponsiveTable: Story = {
  render: () => (
    <Card>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">API Endpoint</TableHead>
              <TableHead className="min-w-[100px]">Method</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[150px]">Response Time</TableHead>
              <TableHead className="min-w-[120px]">Success Rate</TableHead>
              <TableHead className="min-w-[120px]">Last Check</TableHead>
              <TableHead className="min-w-[100px]">Changes</TableHead>
              <TableHead className="min-w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div>
                  <div className="font-medium">User Management API</div>
                  <div className="text-sm text-muted-foreground">
                    https://api.example.com/v1/users
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="success" className="font-mono text-xs">GET</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="success">Active</Badge>
              </TableCell>
              <TableCell>245ms</TableCell>
              <TableCell>99.8%</TableCell>
              <TableCell className="text-muted-foreground">2m ago</TableCell>
              <TableCell>142</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Test</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div>
                  <div className="font-medium">Payment Processing API</div>
                  <div className="text-sm text-muted-foreground">
                    https://payments.example.com/v2/transactions
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info" className="font-mono text-xs">POST</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="destructive">Error</Badge>
              </TableCell>
              <TableCell>2,850ms</TableCell>
              <TableCell>12.5%</TableCell>
              <TableCell className="text-muted-foreground">5m ago</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Test</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive table with horizontal scrolling for wide content.',
      },
    },
  },
}

/**
 * Playground for testing table properties
 */
export const Playground: Story = {
  render: ({ ...args }) => (
    <Card>
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
            <TableHead>Column 3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
            <TableCell>Row 1, Cell 3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 2, Cell 1</TableCell>
            <TableCell>Row 2, Cell 2</TableCell>
            <TableCell>Row 2, Cell 3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  ),
}