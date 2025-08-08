import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { PageErrorBoundary } from '@/shared/components/error-boundary'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true)
        setMobileSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // Close mobile sidebar when clicking outside or on overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSidebarOpen && isMobile) {
        const sidebar = document.querySelector('[data-sidebar]')
        const target = event.target as Node

        if (sidebar && !sidebar.contains(target)) {
          setMobileSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileSidebarOpen, isMobile])

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => {
            setMobileSidebarOpen(false)
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          // Mobile: slide in/out from left
          isMobile && !mobileSidebarOpen && '-translate-x-full',
          isMobile && mobileSidebarOpen && 'translate-x-0',
          // Desktop: always visible but collapsible
          !isMobile && 'translate-x-0'
        )}
      >
        <Sidebar
          collapsed={!isMobile && sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          className="h-full"
        />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={handleMenuToggle}
          showMenuButton={isMobile || !sidebarCollapsed}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <PageErrorBoundary>
            <div
              className={cn(
                'transition-all duration-300',
                !isMobile && sidebarCollapsed && 'ml-0',
                !isMobile && !sidebarCollapsed && 'ml-0'
              )}
            >
              {children || <Outlet />}
            </div>
          </PageErrorBoundary>
        </main>
      </div>
    </div>
  )
}
