import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const statusVariants = cva(
  'inline-flex items-center gap-2 text-sm font-medium',
  {
    variants: {
      status: {
        success: 'text-success',
        pending: 'text-warning',
        retrying: 'text-info',
        failed: 'text-destructive',
        'circuit-open': 'text-muted-foreground',
      },
    },
  }
)

const dotVariants = cva('h-2 w-2 rounded-full transition-colors', {
  variants: {
    status: {
      success: 'bg-success',
      pending: 'bg-warning animate-pulse',
      retrying: 'bg-info animate-pulse',
      failed: 'bg-destructive',
      'circuit-open': 'bg-muted-foreground',
    },
    size: {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-3 w-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface WebhookStatusProps
  extends Omit<React.HTMLAttributes<HTMLOutputElement>, 'status'>,
    VariantProps<typeof statusVariants> {
  status: 'success' | 'pending' | 'retrying' | 'failed' | 'circuit-open'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  pulseAnimation?: boolean
}

const statusLabels = {
  success: 'Success',
  pending: 'Pending',
  retrying: 'Retrying',
  failed: 'Failed',
  'circuit-open': 'Circuit Open',
}

/**
 * WebhookStatus component - animated status indicators for webhook states
 *
 * @example
 * ```tsx
 * <WebhookStatus status="success" />
 * <WebhookStatus status="pending" showLabel />
 * <WebhookStatus status="retrying" size="lg" pulseAnimation />
 * ```
 */
function WebhookStatus({
  status,
  size = 'md',
  showLabel = false,
  pulseAnimation = true,
  className,
  ...props
}: WebhookStatusProps) {
  const isPulsing =
    pulseAnimation && (status === 'pending' || status === 'retrying')

  return (
    <output
      data-slot="webhook-status"
      className={cn(statusVariants({ status }), className)}
      aria-label={`Status: ${statusLabels[status]}`}
      {...props}
    >
      <div
        className={cn(
          dotVariants({ status, size }),
          !isPulsing && status === 'pending' && 'animate-none',
          !isPulsing && status === 'retrying' && 'animate-none'
        )}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-sm font-medium">{statusLabels[status]}</span>
      )}
    </output>
  )
}

export { WebhookStatus }
