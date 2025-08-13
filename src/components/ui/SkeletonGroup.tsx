import type * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

/**
 * Skeleton group for common loading patterns
 */
export const SkeletonGroup = {
  /**
   * Avatar with text skeleton
   */
  Avatar: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex items-center space-x-4', className)} {...props}>
      <Skeleton shape="circle" width={40} height={40} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),

  /**
   * Card skeleton with header and content
   */
  Card: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('space-y-4 p-4', className)} {...props}>
      <Skeleton className="h-4 w-[250px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ),

  /**
   * Text lines skeleton
   */
  Text: ({
    lines = 3,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) => (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton components are static and order won't change
          key={i}
          shape="text"
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  ),
};
