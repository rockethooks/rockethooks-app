import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DetailPage,
  PageLayout,
  SettingsPage,
} from '@/shared/components/PageLayout'

/**
 * PageLayout component provides a consistent structure for application pages
 * with header, content, and optional breadcrumb navigation.
 */
const meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The PageLayout component provides a consistent page structure across the RocketHooks application.
It includes automatic header generation, breadcrumb support, and flexible content areas.

## Features

- **Consistent Structure**: Standardized header and content layout
- **Responsive Design**: Adapts to different screen sizes
- **Breadcrumb Support**: Optional navigation breadcrumbs
- **Action Areas**: Flexible areas for page-level actions
- **Full Width Option**: Can expand to full container width
- **Error Boundaries**: Built-in error handling

## Usage

\`\`\`tsx
import { PageLayout, PageHeader, PageContent, PageActions } from '@/shared/components/PageLayout'

<PageLayout
  title="Page Title"
  description="Page description"
  actions={
    <Button>Primary Action</Button>
  }
  breadcrumb="Home / Section / Current"
>
  <div>Page content goes here</div>
</PageLayout>
\`\`\`

## Specialized Layouts

- **DashboardPage**: Pre-configured for dashboard pages
- **SettingsPage**: Pre-configured for settings pages  
- **DetailPage**: Pre-configured for detail/entity pages with actions
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Page title displayed in header',
    },
    description: {
      control: { type: 'text' },
      description: 'Page description/subtitle',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether content should expand to full width',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

function SampleContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => i).map((num) => (
          <Card key={`sample-card-${num}`}>
            <CardHeader>
              <CardTitle>Card {num + 1}</CardTitle>
              <CardDescription>
                Sample card content for layout demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is sample content to show how the page layout works with
                various content types.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/**
 * Basic page layout with title and content
 */
export const Default: Story = {
  args: {
    title: 'Dashboard',
    children: <SampleContent />,
  },
}

/**
 * Page with title, description, and actions
 */
export const WithDescription: Story = {
  args: {
    title: 'API Connections',
    description:
      'Monitor and manage your API endpoints for real-time change detection.',
    actions: (
      <>
        <Button>Add API Connection</Button>
        <Button variant="outline">Import</Button>
      </>
    ),
    children: <SampleContent />,
  },
}

/**
 * Page with breadcrumb navigation
 */
export const WithBreadcrumb: Story = {
  args: {
    title: 'Connection Details',
    description: 'View and edit API connection settings',
    breadcrumb: (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span>API Connections</span>
        <span>/</span>
        <span className="text-foreground">User Profile API</span>
      </nav>
    ),
    actions: (
      <>
        <Button variant="outline">Test Connection</Button>
        <Button>Save Changes</Button>
      </>
    ),
    children: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>API Connection Status</span>
              <Badge variant="success">Active</Badge>
            </CardTitle>
            <CardDescription>
              https://api.example.com/users/profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold">245ms</div>
                <div className="text-xs text-muted-foreground">
                  Avg Response
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-xs text-muted-foreground">
                  Total Requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <SampleContent />
      </div>
    ),
  },
}

/**
 * Full width page layout
 */
export const FullWidth: Story = {
  args: {
    title: 'Events Stream',
    description: 'Real-time webhook events and API polling results',
    fullWidth: true,
    actions: (
      <>
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Export icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4 4V3"
            />
          </svg>
          Export
        </Button>
        <Button variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Filter icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
            />
          </svg>
          Filter
        </Button>
        <Button size="sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Refresh icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </>
    ),
    children: (
      <div className="space-y-4">
        {/* Event Stream Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Array.from({ length: 8 }, (_, i) => i).map((rowNum) => (
                    <tr
                      key={`event-row-${rowNum}`}
                      className="hover:bg-muted/25"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">webhook.delivered</div>
                        <div className="text-sm text-muted-foreground">
                          User registration event
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono">
                          POST /webhooks/user-created
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            rowNum % 3 === 0
                              ? 'success'
                              : rowNum % 3 === 1
                                ? 'warning'
                                : 'destructive'
                          }
                        >
                          {rowNum % 3 === 0
                            ? '200'
                            : rowNum % 3 === 1
                              ? '202'
                              : '500'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {rowNum + 1} min ago
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
}

/**
 * Settings page layout with specialized styling
 */
export const SettingsLayout: Story = {
  args: { children: null },
  render: () => (
    <SettingsPage
      title="Account Settings"
      description="Manage your account preferences and billing information."
      actions={<Button>Save Changes</Button>}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile and email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  defaultValue="John"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="emailAddress" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                defaultValue="john@example.com"
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you'd like to be notified about activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive email updates about webhook deliveries and errors
                </div>
              </div>
              <Button variant="outline" size="sm">
                Toggle
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Alerts</div>
                <div className="text-sm text-muted-foreground">
                  Critical alerts via SMS for system failures
                </div>
              </div>
              <Button variant="outline" size="sm">
                Toggle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsPage>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Specialized settings page layout with pre-configured styling and description.',
      },
    },
  },
}

/**
 * Detail page layout with entity actions
 */
export const DetailLayout: Story = {
  args: { children: null },
  render: () => (
    <DetailPage
      title="User Profile API"
      description="GET https://api.example.com/users/profile"
      breadcrumb="Dashboard / API Connections / User Profile API"
      backAction={() => {
        console.log('Back clicked')
      }}
      editAction={() => {
        console.log('Edit clicked')
      }}
      deleteAction={() => {
        console.log('Delete clicked')
      }}
      customActions={
        <Button variant="outline">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Connection test icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Test Connection
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Connection Status</span>
                <Badge variant="success">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Checked:
                  </span>
                  <span className="text-sm">2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Polling Interval:
                  </span>
                  <span className="text-sm">30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Changes Detected:
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    142 total
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-xs text-muted-foreground">
                    Success Rate
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">245ms</div>
                  <div className="text-xs text-muted-foreground">
                    Avg Response
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => i).map((activityNum) => (
                <div
                  key={`activity-${activityNum}`}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium">
                      Change detected in user data
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activityNum + 1} minute{activityNum !== 0 ? 's' : ''} ago
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">
                    200
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DetailPage>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Detail page layout with pre-configured actions and navigation.',
      },
    },
  },
}

/**
 * Empty state page layout
 */
export const EmptyState: Story = {
  args: {
    title: 'API Connections',
    description:
      'Monitor and manage your API endpoints for real-time change detection.',
    actions: (
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
    ),
    children: (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Connection icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No API connections yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get started by creating your first API connection to monitor for
          changes and automatically trigger webhooks when data updates.
        </p>
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
          Create Your First Connection
        </Button>
      </Card>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page layout with empty state content encouraging user action.',
      },
    },
  },
}

/**
 * Playground for testing page layout properties
 */
export const Playground: Story = {
  args: {
    title: 'Custom Page',
    description: 'Use the controls to customize this page layout',
    fullWidth: false,
    children: <SampleContent />,
    actions: (
      <>
        <Button>Primary Action</Button>
        <Button variant="outline">Secondary Action</Button>
      </>
    ),
  },
}
