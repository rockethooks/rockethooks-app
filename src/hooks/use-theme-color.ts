import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@/app/providers/theme-provider'

// Global MutationObserver instance to prevent multiple observers
class GlobalThemeObserver {
  private observer: MutationObserver | null = null
  private callbacks = new Set<() => void>()
  private isInitialized = false

  init() {
    if (this.isInitialized) return

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Debounce the callbacks to prevent excessive updates
          setTimeout(() => {
            this.callbacks.forEach((callback) => {
              callback()
            })
          }, 0)
        }
      })
    })

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    this.isInitialized = true
  }

  subscribe(callback: () => void) {
    this.init()
    this.callbacks.add(callback)

    return () => {
      this.callbacks.delete(callback)
      if (this.callbacks.size === 0 && this.observer) {
        this.observer.disconnect()
        this.observer = null
        this.isInitialized = false
      }
    }
  }
}

const globalThemeObserver = new GlobalThemeObserver()

/**
 * Hook to get CSS variable values and react to theme changes
 * @param cssVariable - The CSS variable name (without --)
 * @returns The current value of the CSS variable
 */
export function useCSSVariable(cssVariable: string): string {
  const { resolvedTheme } = useTheme()
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    const updateValue = () => {
      const root = document.documentElement
      const computedValue = getComputedStyle(root)
        .getPropertyValue(`--${cssVariable}`)
        .trim()
      setValue(computedValue)
    }

    // Update immediately
    updateValue()

    // Listen for theme changes
    const handleThemeChange = () => {
      updateValue()
    }

    window.addEventListener('theme-change', handleThemeChange)

    // Subscribe to global theme observer
    const unsubscribe = globalThemeObserver.subscribe(updateValue)

    return () => {
      window.removeEventListener('theme-change', handleThemeChange)
      unsubscribe()
    }
  }, [cssVariable, resolvedTheme])

  return value
}

/**
 * Hook to get theme-aware colors
 * @param colorName - The color name from the theme (e.g., 'primary', 'background')
 * @returns Object with HSL values and utility functions
 */
export function useThemeColor(colorName: string) {
  const hslValue = useCSSVariable(colorName)
  const { resolvedTheme } = useTheme()

  const getHSLString = () => {
    return hslValue ? `hsl(${hslValue})` : ''
  }

  const getHSLAString = (alpha: number) => {
    return hslValue ? `hsla(${hslValue} / ${alpha.toString()})` : ''
  }

  const getCSSVariable = () => {
    return `hsl(var(--${colorName}))`
  }

  const getCSSVariableWithAlpha = (alpha: number) => {
    return `hsl(var(--${colorName}) / ${alpha.toString()})`
  }

  const parseHSL = () => {
    if (!hslValue) return null

    const values = hslValue.split(' ')
    if (values.length !== 3) return null

    return {
      hue: parseInt(values[0] ?? '0'),
      saturation: parseInt((values[1] ?? '0').replace('%', '')),
      lightness: parseInt((values[2] ?? '0').replace('%', '')),
    }
  }

  return {
    hslValue,
    resolvedTheme,
    getHSLString,
    getHSLAString,
    getCSSVariable,
    getCSSVariableWithAlpha,
    parseHSL,
    // Utility properties
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }
}

/**
 * Hook to create dynamic color variants
 * Note: This hook uses a different approach to avoid violating React's rules of hooks.
 * Instead of calling useThemeColor dynamically, it manages CSS variables directly.
 * @param baseColor - Base color name
 * @param variants - Array of variant numbers (e.g., [100, 200, 500])
 * @returns Object with color variants
 */
export function useColorVariants(baseColor: string, variants: number[] = []) {
  const { resolvedTheme } = useTheme()
  const [colorValues, setColorValues] = useState<Record<number, string>>({})

  useEffect(() => {
    const updateColorValues = () => {
      const root = document.documentElement
      const newColorValues: Record<number, string> = {}

      variants.forEach((variant) => {
        const colorName = `${baseColor}-${variant.toString()}`
        const computedValue = getComputedStyle(root)
          .getPropertyValue(`--${colorName}`)
          .trim()
        newColorValues[variant] = computedValue
      })

      setColorValues(newColorValues)
    }

    // Update immediately
    updateColorValues()

    // Listen for theme changes
    const handleThemeChange = () => {
      updateColorValues()
    }

    window.addEventListener('theme-change', handleThemeChange)

    // Subscribe to global theme observer
    const unsubscribe = globalThemeObserver.subscribe(updateColorValues)

    return () => {
      window.removeEventListener('theme-change', handleThemeChange)
      unsubscribe()
    }
  }, [baseColor, variants, resolvedTheme])

  // Memoize the final color objects to prevent unnecessary re-renders
  return useMemo(() => {
    const colors: Record<number, ReturnType<typeof useThemeColor>> = {}

    variants.forEach((variant) => {
      const colorName = `${baseColor}-${variant.toString()}`
      const hslValue = colorValues[variant] ?? ''

      colors[variant] = {
        hslValue,
        resolvedTheme,
        getHSLString: () => (hslValue ? `hsl(${hslValue})` : ''),
        getHSLAString: (alpha: number) =>
          hslValue ? `hsla(${hslValue} / ${alpha.toString()})` : '',
        getCSSVariable: () => `hsl(var(--${colorName}))`,
        getCSSVariableWithAlpha: (alpha: number) =>
          `hsl(var(--${colorName}) / ${alpha.toString()})`,
        parseHSL: () => {
          if (!hslValue) return null
          const values = hslValue.split(' ')
          if (values.length !== 3) return null
          return {
            hue: parseInt(values[0] ?? '0'),
            saturation: parseInt((values[1] ?? '0').replace('%', '')),
            lightness: parseInt((values[2] ?? '0').replace('%', '')),
          }
        },
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
      }
    })

    return colors
  }, [baseColor, variants, colorValues, resolvedTheme])
}

/**
 * Hook for semantic colors (success, warning, error, info)
 */
export function useSemanticColors() {
  const success = useThemeColor('success')
  const warning = useThemeColor('warning')
  const error = useThemeColor('error')
  const info = useThemeColor('info')

  return {
    success,
    warning,
    error,
    info,
  }
}

/**
 * Hook to monitor theme changes
 * @param callback - Function to call when theme changes
 */
export function useThemeChangeListener(
  callback: (theme: 'light' | 'dark') => void
) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: 'dark' | 'light' }>
      callback(customEvent.detail.theme)
    }

    window.addEventListener('theme-change', handleThemeChange as EventListener)

    return () => {
      window.removeEventListener(
        'theme-change',
        handleThemeChange as EventListener
      )
    }
  }, [callback])

  // Also call immediately with current theme
  useEffect(() => {
    callback(resolvedTheme)
  }, [resolvedTheme, callback])
}
