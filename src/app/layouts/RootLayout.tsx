import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { Toaster } from '@/components/ui/Sonner'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { AppErrorBoundary } from '@/shared/components/ErrorBoundary'

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
