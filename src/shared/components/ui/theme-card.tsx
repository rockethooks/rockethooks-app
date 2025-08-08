import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useThemeColor } from '@/hooks/use-theme-color'

const themeCardVariants = cva(
  'rounded-lg border theme-transition relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'theme-card',
        elevated: 'theme-card-elevated',
        glass: 'theme-glass',
        gradient: 'gradient-primary text-primary-foreground',
        'gradient-secondary': 'gradient-secondary'
      },
      padding: {
        none: '',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8'
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      size: 'default'
    }
  }
)

export interface ThemeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof themeCardVariants> {
  /**
   * Whether to show theme-aware border accent
   */
  accent?: boolean
  /**
   * Custom gradient colors (overrides variant)
   */
  gradientFrom?: string
  gradientTo?: string
}

const ThemeCard = React.forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    size, 
    accent = false,
    gradientFrom,
    gradientTo,
    children,
    style,
    ...props 
  }, ref) => {
    const primaryColor = useThemeColor('primary')

    const customStyle: React.CSSProperties = {
      ...style
    }

    // Apply custom gradient if provided
    if (gradientFrom && gradientTo) {
      customStyle.background = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
    }

    // Apply accent border if enabled
    if (accent && !gradientFrom) {
      customStyle.borderColor = primaryColor.getHSLString()
      customStyle.boxShadow = `0 0 0 1px ${primaryColor.getHSLAString(0.1)}, var(--shadow-elevation-medium)`
    }

    return (
      <div
        ref={ref}
        className={cn(themeCardVariants({ variant, padding, size }), className)}
        style={customStyle}
        {...props}
      >
        {accent && !gradientFrom && (
          <div 
            className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r"
            style={{
              background: `linear-gradient(90deg, ${primaryColor.getHSLString()}, ${primaryColor.getHSLAString(0.3)})`
            }}
          />
        )}
        {children}
      </div>
    )
  }
)

ThemeCard.displayName = 'ThemeCard'

/**
 * Theme-aware card header component
 */
const ThemeCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
ThemeCardHeader.displayName = 'ThemeCardHeader'

/**
 * Theme-aware card title component
 */
const ThemeCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const foregroundColor = useThemeColor('card-foreground')
  
  return (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      style={{
        color: foregroundColor.getHSLString()
      }}
      {...props}
    />
  )
})
ThemeCardTitle.displayName = 'ThemeCardTitle'

/**
 * Theme-aware card description component
 */
const ThemeCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const mutedColor = useThemeColor('muted-foreground')
  
  return (
    <p
      ref={ref}
      className={cn('text-sm', className)}
      style={{
        color: mutedColor.getHSLString()
      }}
      {...props}
    />
  )
})
ThemeCardDescription.displayName = 'ThemeCardDescription'

/**
 * Theme-aware card content component
 */
const ThemeCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pt-0', className)}
    {...props}
  />
))
ThemeCardContent.displayName = 'ThemeCardContent'

/**
 * Theme-aware card footer component
 */
const ThemeCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-0', className)}
    {...props}
  />
))
ThemeCardFooter.displayName = 'ThemeCardFooter'

export {
  ThemeCard,
  ThemeCardHeader,
  ThemeCardTitle,
  ThemeCardDescription,
  ThemeCardContent,
  ThemeCardFooter,
  themeCardVariants
}