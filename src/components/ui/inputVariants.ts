import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      inputSize: {
        default: 'h-9',
        sm: 'h-8 text-sm px-2',
        lg: 'h-10 px-4',
      },
      variant: {
        default: 'border-input',
        destructive: 'border-destructive focus-visible:ring-destructive/20',
        ghost: 'border-transparent shadow-none',
      },
    },
    defaultVariants: {
      inputSize: 'default',
      variant: 'default',
    },
  }
);
