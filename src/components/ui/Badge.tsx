import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'
import { badgeVariants } from './badgeVariants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for displaying status, categories, or labels
 *
 * @example
 * ```tsx
 * <Badge variant="default">New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline" size="sm">Small</Badge>
 * ```
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge }
