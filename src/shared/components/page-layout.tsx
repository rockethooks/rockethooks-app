import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ComponentErrorBoundary } from './error-boundary'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  breadcrumb?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  fullWidth?: boolean
}

interface PageHeaderProps {
  title?: string | undefined
  description?: string | undefined
  actions?: React.ReactNode
  breadcrumb?: React.ReactNode
  className?: string | undefined
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
}

interface PageActionsProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({
  children,
  title,
  description,
  actions,
  breadcrumb,
  className,
  headerClassName,
  contentClassName,
  fullWidth = false,
}: PageLayoutProps) {
  const hasHeader = Boolean(title || description || actions || breadcrumb)

  return (
    <ComponentErrorBoundary>
      <div className={cn('flex flex-1 flex-col', className)}>
        {hasHeader && (
          <>
            <PageHeader
              title={title}
              description={description}
              actions={actions}
              breadcrumb={breadcrumb}
              className={headerClassName}
            />
            <Separator />
          </>
        )}
        <PageContent
          className={cn(
            !fullWidth && 'container max-w-screen-2xl',
            contentClassName
          )}
        >
          {children}
        </PageContent>
      </div>
    </ComponentErrorBoundary>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex max-w-screen-2xl flex-col gap-4 p-6">
        {breadcrumb && (
          <div className="text-sm text-muted-foreground">{breadcrumb}</div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            {title && (
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-muted-foreground md:text-xl">
                {description}
              </p>
            )}
          </div>

          {actions && <PageActions>{actions}</PageActions>}
        </div>
      </div>
    </div>
  )
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn('flex-1 p-6', className)}>{children}</div>
}

export function PageActions({ children, className }: PageActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
    </div>
  )
}

// Convenience components for common page types
interface DashboardPageProps extends Omit<PageLayoutProps, 'title'> {
  title: string
}

export function DashboardPage({ title, ...props }: DashboardPageProps) {
  return <PageLayout title={title} {...props} />
}

interface SettingsPageProps
  extends Omit<PageLayoutProps, 'title' | 'description'> {
  title: string
  description?: string
}

export function SettingsPage({
  title,
  description = 'Manage your account settings and preferences.',
  ...props
}: SettingsPageProps) {
  return <PageLayout title={title} description={description} {...props} />
}

interface DetailPageProps extends Omit<PageLayoutProps, 'actions'> {
  backAction?: () => void
  editAction?: () => void
  deleteAction?: () => void
  customActions?: React.ReactNode
}

export function DetailPage({
  backAction,
  editAction,
  deleteAction,
  customActions,
  ...props
}: DetailPageProps) {
  const actions = (
    <>
      {backAction && (
        <Button variant="outline" onClick={backAction}>
          ← Back
        </Button>
      )}
      {editAction && (
        <Button variant="outline" onClick={editAction}>
          Edit
        </Button>
      )}
      {deleteAction && (
        <Button variant="destructive" onClick={deleteAction}>
          Delete
        </Button>
      )}
      {customActions}
    </>
  )

  return <PageLayout actions={actions} {...props} />
}
