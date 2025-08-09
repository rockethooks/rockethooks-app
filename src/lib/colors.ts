/**
 * Color Palette Documentation
 *
 * This file contains the complete color palette used throughout the application.
 * All colors are defined as HSL values that correspond to CSS custom properties.
 *
 * Usage:
 * - Use these constants in JavaScript/TypeScript when you need specific color values
 * - For CSS, prefer using the CSS custom properties (--primary, --background, etc.)
 * - Colors automatically adapt between light and dark themes
 */

// Core Theme Colors - Light Mode
export const LIGHT_COLORS = {
  // Primary Colors
  background: '0 0% 100%',
  foreground: '222.2 84% 4.9%',
  card: '0 0% 100%',
  cardForeground: '222.2 84% 4.9%',
  popover: '0 0% 100%',
  popoverForeground: '222.2 84% 4.9%',

  // Brand Colors
  primary: '221.2 83.2% 53.3%',
  primaryForeground: '210 40% 98%',
  secondary: '210 40% 96%',
  secondaryForeground: '222.2 84% 4.9%',

  // Utility Colors
  muted: '210 40% 96%',
  mutedForeground: '215.4 16.3% 46.9%',
  accent: '210 40% 96%',
  accentForeground: '222.2 84% 4.9%',

  // Interactive Colors
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '210 40% 98%',
  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  ring: '221.2 83.2% 53.3%',

  // Chart Colors
  chart1: '12 76% 61%',
  chart2: '173 58% 39%',
  chart3: '197 37% 24%',
  chart4: '43 74% 66%',
  chart5: '27 87% 67%',
} as const

// Core Theme Colors - Dark Mode
export const DARK_COLORS = {
  // Primary Colors
  background: '222.2 84% 4.9%',
  foreground: '210 40% 98%',
  card: '222.2 84% 4.9%',
  cardForeground: '210 40% 98%',
  popover: '222.2 84% 4.9%',
  popoverForeground: '210 40% 98%',

  // Brand Colors
  primary: '217.2 91.2% 59.8%',
  primaryForeground: '222.2 84% 4.9%',
  secondary: '217.2 32.6% 17.5%',
  secondaryForeground: '210 40% 98%',

  // Utility Colors
  muted: '217.2 32.6% 17.5%',
  mutedForeground: '215 20.2% 65.1%',
  accent: '217.2 32.6% 17.5%',
  accentForeground: '210 40% 98%',

  // Interactive Colors
  destructive: '0 62.8% 30.6%',
  destructiveForeground: '210 40% 98%',
  border: '217.2 32.6% 17.5%',
  input: '217.2 32.6% 17.5%',
  ring: '224.3 76.3% 48%',

  // Chart Colors
  chart1: '220 70% 50%',
  chart2: '160 60% 45%',
  chart3: '30 80% 55%',
  chart4: '280 65% 60%',
  chart5: '340 75% 55%',
} as const

// Semantic Colors - Light Mode
export const LIGHT_SEMANTIC_COLORS = {
  success: '142.1 76.2% 36.3%',
  successForeground: '355.7 100% 97.3%',
  warning: '32.5 94.6% 43.7%',
  warningForeground: '210 40% 98%',
  info: '221.2 83.2% 53.3%',
  infoForeground: '210 40% 98%',
  error: '0 84.2% 60.2%',
  errorForeground: '210 40% 98%',
} as const

// Semantic Colors - Dark Mode
export const DARK_SEMANTIC_COLORS = {
  success: '142.1 70.6% 45.3%',
  successForeground: '144.9 80.4% 10%',
  warning: '32.5 94.6% 43.7%',
  warningForeground: '20.5 90.2% 4.3%',
  info: '217.2 91.2% 59.8%',
  infoForeground: '222.2 84% 4.9%',
  error: '0 62.8% 30.6%',
  errorForeground: '210 40% 98%',
} as const

// Primary Color Variants
export const PRIMARY_VARIANTS = {
  50: '240 100% 98%',
  100: '239 100% 95%',
  200: '237 87% 91%',
  300: '235 79% 85%',
  400: '232 74% 76%',
  500: '221.2 83.2% 53.3%', // Base primary color
  600: '226 71% 40%',
  700: '224 64% 33%',
  800: '223 47% 23%',
  900: '224 39% 17%',
  950: '226 22% 9%',
} as const

// Gray Color Variants - Light Mode
export const LIGHT_GRAY_VARIANTS = {
  50: '210 40% 98%',
  100: '210 40% 96%',
  200: '214.3 31.8% 91.4%',
  300: '213 27% 84%',
  400: '215.4 16.3% 57%',
  500: '215.4 16.3% 46.9%',
  600: '215 19% 35%',
  700: '215 25% 27%',
  800: '217 33% 17%',
  900: '222.2 84% 4.9%',
  950: '229 84% 5%',
} as const

// Gray Color Variants - Dark Mode (inverted)
export const DARK_GRAY_VARIANTS = {
  50: '229 84% 5%',
  100: '222.2 84% 4.9%',
  200: '217 33% 17%',
  300: '215 25% 27%',
  400: '215 19% 35%',
  500: '215.4 16.3% 46.9%',
  600: '215.4 16.3% 57%',
  700: '213 27% 84%',
  800: '214.3 31.8% 91.4%',
  900: '210 40% 96%',
  950: '210 40% 98%',
} as const

// Utility Functions
export const colorUtils = {
  /**
   * Convert HSL string to CSS hsl() function
   */
  toHSL: (hslValue: string) => `hsl(${hslValue})`,

  /**
   * Convert HSL string to CSS hsla() function with alpha
   */
  toHSLA: (hslValue: string, alpha: number) =>
    `hsla(${hslValue} / ${String(alpha)})`,

  /**
   * Get CSS custom property reference
   */
  toCSSVar: (varName: string) => `hsl(var(--${varName}))`,

  /**
   * Get CSS custom property reference with alpha
   */
  toCSSVarWithAlpha: (varName: string, alpha: number) =>
    `hsl(var(--${varName}) / ${String(alpha)})`,

  /**
   * Parse HSL string into components
   */
  parseHSL: (hslValue: string) => {
    const values = hslValue.split(' ')
    if (values.length !== 3) return null

    return {
      hue: parseInt(values[0] ?? '0') || 0,
      saturation: parseInt((values[1] ?? '0').replace('%', '')) || 0,
      lightness: parseInt((values[2] ?? '0').replace('%', '')) || 0,
    }
  },
}

// Color Palette Export
export const COLOR_PALETTE = {
  light: {
    ...LIGHT_COLORS,
    semantic: LIGHT_SEMANTIC_COLORS,
    primary: PRIMARY_VARIANTS,
    gray: LIGHT_GRAY_VARIANTS,
  },
  dark: {
    ...DARK_COLORS,
    semantic: DARK_SEMANTIC_COLORS,
    primary: PRIMARY_VARIANTS,
    gray: DARK_GRAY_VARIANTS,
  },
} as const

// Type definitions for better TypeScript support
export type ColorName = keyof typeof LIGHT_COLORS
export type SemanticColorName = keyof typeof LIGHT_SEMANTIC_COLORS
export type ColorVariant = keyof typeof PRIMARY_VARIANTS
export type Theme = 'light' | 'dark'

/**
 * Type guard to check if a string is a valid ColorName
 */
function isColorName(colorName: string): colorName is ColorName {
  return colorName in LIGHT_COLORS
}

/**
 * Type guard to check if a string is a valid SemanticColorName
 */
function isSemanticColorName(
  colorName: string
): colorName is SemanticColorName {
  return colorName in LIGHT_SEMANTIC_COLORS
}

/**
 * Type guard to check if a value is a valid ColorVariant (number keys)
 */
function isColorVariant(value: string | number): value is ColorVariant {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value
  return !Number.isNaN(numValue) && numValue in PRIMARY_VARIANTS
}

/**
 * Get color value for a specific theme
 */
export function getColorValue(
  theme: Theme,
  colorType: 'core' | 'semantic' | 'primary' | 'gray',
  colorName: string
): string {
  const palette = COLOR_PALETTE[theme]

  switch (colorType) {
    case 'core': {
      if (isColorName(colorName)) {
        const value = palette[colorName]
        return typeof value === 'string' ? value : ''
      }
      return ''
    }
    case 'semantic':
      if (isSemanticColorName(colorName)) {
        return palette.semantic[colorName]
      }
      return ''
    case 'primary':
      if (isColorVariant(colorName)) {
        const numKey =
          typeof colorName === 'string' ? parseInt(colorName, 10) : colorName
        if (!Number.isNaN(numKey) && numKey in palette.primary) {
          return palette.primary[numKey as ColorVariant]
        }
      }
      return ''
    case 'gray':
      if (isColorVariant(colorName)) {
        const numKey =
          typeof colorName === 'string' ? parseInt(colorName, 10) : colorName
        if (!Number.isNaN(numKey) && numKey in palette.gray) {
          return palette.gray[numKey as ColorVariant]
        }
      }
      return ''
    default:
      return ''
  }
}

/**
 * Common color combinations for UI components
 */
export const COLOR_COMBINATIONS = {
  // Primary button
  primaryButton: {
    background: 'primary',
    foreground: 'primary-foreground',
    hover: 'primary/90',
  },
  // Secondary button
  secondaryButton: {
    background: 'secondary',
    foreground: 'secondary-foreground',
    hover: 'secondary/80',
  },
  // Success state
  success: {
    background: 'success',
    foreground: 'success-foreground',
    border: 'success/20',
  },
  // Warning state
  warning: {
    background: 'warning',
    foreground: 'warning-foreground',
    border: 'warning/20',
  },
  // Error state
  error: {
    background: 'error',
    foreground: 'error-foreground',
    border: 'error/20',
  },
  // Info state
  info: {
    background: 'info',
    foreground: 'info-foreground',
    border: 'info/20',
  },
} as const
