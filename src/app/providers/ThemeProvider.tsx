import { useEffect, useState } from 'react'
import { type Theme, ThemeProviderContext } from './themeContext'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    return stored ?? defaultTheme
  })
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      root.classList.remove('light', 'dark')

      let effectiveTheme: 'dark' | 'light'
      if (theme === 'system') {
        effectiveTheme = mediaQuery.matches ? 'dark' : 'light'
      } else {
        effectiveTheme = theme
      }

      root.classList.add(effectiveTheme)
      setResolvedTheme(effectiveTheme)

      // Dispatch theme change event for other components to listen to
      const event = new CustomEvent('theme-change', {
        detail: { theme: effectiveTheme },
      })
      window.dispatchEvent(event)
    }

    // Apply theme immediately
    applyTheme()

    // Listen for system theme changes
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
