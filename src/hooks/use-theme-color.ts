import { useEffect, useState } from 'react'
import { useTheme } from '@/app/providers/theme-provider'

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

    // Also listen for CSS changes (for system theme changes)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateValue()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      window.removeEventListener('theme-change', handleThemeChange)
      observer.disconnect()
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
    return hslValue ? `hsla(${hslValue} / ${String(alpha)})` : ''
  }

  const getCSSVariable = () => {
    return `hsl(var(--${colorName}))`
  }

  const getCSSVariableWithAlpha = (alpha: number) => {
    return `hsl(var(--${colorName}) / ${String(alpha)})`
  }

  const parseHSL = () => {
    if (!hslValue) return null
    
    const values = hslValue.split(' ')
    if (values.length !== 3) return null
    
    return {
      hue: parseInt(values[0] ?? '0'),
      saturation: parseInt((values[1] ?? '0').replace('%', '')),
      lightness: parseInt((values[2] ?? '0').replace('%', ''))
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
    isLight: resolvedTheme === 'light'
  }
}

/**
 * Hook to create dynamic color variants
 * @param baseColor - Base color name
 * @param variants - Array of variant numbers (e.g., [100, 200, 500])
 * @returns Object with color variants
 */
export function useColorVariants(baseColor: string, variants: number[] = []) {
  const colors = variants.reduce<Record<number, ReturnType<typeof useThemeColor>>>((acc, variant) => {
    const colorName = `${baseColor}-${String(variant)}`
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const color = useThemeColor(colorName)
    acc[variant] = color
    return acc
  }, {})

  return colors
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
    info
  }
}

/**
 * Hook to monitor theme changes
 * @param callback - Function to call when theme changes
 */
export function useThemeChangeListener(callback: (theme: 'light' | 'dark') => void) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: 'dark' | 'light' }>
    callback(customEvent.detail.theme)
  }

    window.addEventListener('theme-change', handleThemeChange as EventListener)

    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener)
    }
  }, [callback])

  // Also call immediately with current theme
  useEffect(() => {
    callback(resolvedTheme)
  }, [resolvedTheme, callback])
}