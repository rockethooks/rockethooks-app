import { Outlet } from 'react-router-dom';
import { AuthSync } from '@/components';
import { Toaster } from '@/components/ui/Sonner';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppErrorBoundary } from '@/shared/components/ErrorBoundary';

interface RootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <AppErrorBoundary>
      <AuthSync />
      <ThemeProvider defaultTheme="system" storageKey="rockethooks-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children ?? <Outlet />}
            <Toaster position="bottom-right" richColors />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
