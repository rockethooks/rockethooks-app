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
} from './badge'
// Badge Variants
export { badgeVariants } from './badge-variants'
// Button Component
export {
  Button,
  type ButtonProps,
} from './button'
// Button Variants
export { buttonVariants } from './button-variants'

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
} from './card'

// Input Component
export {
  Input,
  type InputProps,
} from './input'

// Input Variants
export { inputVariants } from './input-variants'

// Label Component
export {
  Label,
  type LabelProps,
} from './label'

// Skeleton Components
export {
  Skeleton,
  type SkeletonProps,
} from './skeleton'

// Skeleton Group
export { SkeletonGroup } from './skeleton-group'

// Skeleton Variants
export { skeletonVariants } from './skeleton-variants'
