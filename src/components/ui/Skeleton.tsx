import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';
import { skeletonVariants } from './skeletonVariants';

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Width of the skeleton (CSS value)
   */
  width?: string | number;
  /**
   * Height of the skeleton (CSS value)
   */
  height?: string | number;
}

/**
 * Skeleton component for loading states
 *
 * @example
 * ```tsx
 * <Skeleton className="w-full h-4" />
 * <Skeleton variant="light" shape="circle" width={40} height={40} />
 * <Skeleton shape="text" className="w-3/4 h-3" />
 * ```
 */
function Skeleton({
  className,
  variant,
  shape,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined && {
      width: typeof width === 'number' ? `${String(width)}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === 'number' ? `${String(height)}px` : height,
    }),
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant, shape }), className)}
      style={inlineStyles}
      {...props}
    />
  );
}

export { Skeleton };
