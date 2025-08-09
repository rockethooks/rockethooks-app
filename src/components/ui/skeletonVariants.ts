import { cva } from 'class-variance-authority'

export const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
  variants: {
    variant: {
      default: 'bg-muted',
      light: 'bg-gray-200 dark:bg-gray-700',
      dark: 'bg-gray-300 dark:bg-gray-600',
    },
    shape: {
      rectangle: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    shape: 'rectangle',
  },
})
