import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  User,
  Users,
  Webhook,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { ComponentErrorBoundary } from '@/shared/components/ErrorBoundary'

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Webhooks',
    href: '/webhooks',
    icon: Webhook,
    badge: '5',
  },
  {
    title: 'API Endpoints',
    href: '/endpoints',
    icon: Zap,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: Activity,
  },
  {
    title: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  className,
}: SidebarProps) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  const toggleCollapsed = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <ComponentErrorBoundary>
      <div
        className={cn(
          'relative flex h-full flex-col border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-bold">RocketHooks</span>
            </Link>
          )}
          {isCollapsed && (
            <div className="flex w-full justify-center">
              <div className="h-6 w-6 rounded bg-primary" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  active && 'bg-accent text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn('h-4 w-4', isCollapsed && 'h-5 w-5')} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-2">
          <div
            className={cn(
              'flex items-center space-x-3 rounded-md px-3 py-2',
              isCollapsed && 'justify-center'
            )}
          >
            <Avatar className={cn('h-8 w-8', isCollapsed && 'h-9 w-9')}>
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 text-left text-sm leading-tight">
                <div className="truncate font-semibold">John Doe</div>
                <div className="truncate text-xs text-muted-foreground">
                  john@example.com
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse/Expand button */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn('w-full', isCollapsed && 'px-0')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </ComponentErrorBoundary>
  )
}
