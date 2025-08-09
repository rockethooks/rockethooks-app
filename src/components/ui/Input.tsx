import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'
import { inputVariants } from './inputVariants'

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: React.ComponentProps<'input'>['size']
}

/**
 * Input component with variants and accessibility features
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input variant="destructive" inputSize="sm" />
 * <Input variant="ghost" inputSize="lg" />
 * ```
 */
function Input({
  className,
  type = 'text',
  size,
  variant,
  inputSize,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, variant }), className)}
      size={size}
      {...props}
    />
  )
}

export { Input }
