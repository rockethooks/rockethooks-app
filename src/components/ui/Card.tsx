import type * as React from 'react'

import { cn } from '@/lib/utils'

export type CardProps = React.ComponentProps<'div'>
export type CardHeaderProps = React.ComponentProps<'div'>
export type CardTitleProps = React.ComponentProps<'div'>
export type CardDescriptionProps = React.ComponentProps<'div'>
export type CardActionProps = React.ComponentProps<'div'>
export type CardContentProps = React.ComponentProps<'div'>
export type CardFooterProps = React.ComponentProps<'div'>

/**
 * Card component with compound pattern for flexible layouts
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *     <CardAction>
 *       <Button size="sm">Action</Button>
 *     </CardAction>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Footer Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className
      )}
      {...props}
    />
  )
}

/**
 * CardHeader component for card titles and actions
 */
function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

/**
 * CardTitle component for card titles
 */
function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

/**
 * CardDescription component for card descriptions
 */
function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/**
 * CardAction component for card actions (positioned in header)
 */
function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

/**
 * CardContent component for main card content
 */
function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

/**
 * CardFooter component for card footer actions
 */
function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
