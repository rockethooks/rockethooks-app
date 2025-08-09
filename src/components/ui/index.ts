/**
 * UI Components Library
 *
 * This module exports all base UI components built with CVA (class-variance-authority)
 * for consistent styling and variants across the application.
 *
 * @module components/ui
 */

// Badge Component
export {
  Badge,
  type BadgeProps,
} from './Badge'
// Button Component
export {
  Button,
  type ButtonProps,
} from './Button'
// Badge Variants
export { badgeVariants } from './badgeVariants'
// Button Variants
export { buttonVariants } from './buttonVariants'

// Card Components (Compound Pattern)
export {
  Card,
  CardAction,
  type CardActionProps,
  CardContent,
  type CardContentProps,
  CardDescription,
  type CardDescriptionProps,
  CardFooter,
  type CardFooterProps,
  CardHeader,
  type CardHeaderProps,
  type CardProps,
  CardTitle,
  type CardTitleProps,
} from './Card'

// Input Component
export {
  Input,
  type InputProps,
} from './Input'

// Input Variants
export { inputVariants } from './inputVariants'

// Label Component
export {
  Label,
  type LabelProps,
} from './Label'
// Skeleton Components
export {
  Skeleton,
  type SkeletonProps,
} from './Skeleton'
// Skeleton Group
export { SkeletonGroup } from './SkeletonGroup'

// Skeleton Variants
export { skeletonVariants } from './skeletonVariants'
