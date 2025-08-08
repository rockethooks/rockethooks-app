import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppErrorBoundary } from '@/shared/components/error-boundary'

interface RootLayoutProps {
  children?: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="rockethooks-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children ?? <Outlet />}
            <Toaster position="bottom-right" richColors />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  )
}
