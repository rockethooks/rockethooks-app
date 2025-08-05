# Styling and Theming Reference

## Design System Overview

### Technology Stack
- **Tailwind CSS v3** - Utility-first CSS framework
- **ShadCN/UI** - Pre-built component library
- **Radix UI** - Accessible component primitives
- **CSS Variables** - Theme-aware color system
- **next-themes** - Dark/light mode management

### Color System

#### Primary Colors
```css
:root {
  --primary: 224 71% 60%;        /* Indigo Blue #6366f1 */
  --primary-foreground: 210 40% 98%;
  --secondary: 220 14% 96%;
  --secondary-foreground: 220 9% 46%;
  --accent: 220 14% 96%;
  --accent-foreground: 220 9% 46%;
}
```

#### Semantic Colors
```css
:root {
  --background: 0 0% 100%;       /* White */
  --foreground: 222 84% 5%;      /* Dark text */
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 84% 5%;
  --muted: 220 14% 96%;
  --muted-foreground: 220 9% 46%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71% 60%;
}
```

#### Status Colors
```css
:root {
  --destructive: 0 84% 60%;      /* Red for errors */
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;        /* Green for success */
  --success-foreground: 210 40% 98%;
  --warning: 38 92% 50%;         /* Yellow for warnings */
  --warning-foreground: 222 84% 5%;
}
```

#### Dark Mode Colors
```css
.dark {
  --background: 222 84% 5%;      /* Dark background */
  --foreground: 210 40% 98%;     /* Light text */
  --card: 222 84% 5%;
  --card-foreground: 210 40% 98%;
  --popover: 222 84% 5%;
  --popover-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: 224 71% 60%;
}
```

## Tailwind Configuration

### Custom Configuration (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Responsive Design
```typescript
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

## Theme Management

### Theme Provider (`src/components/theme-provider.tsx`)
```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
```

### Theme Toggle Component (`src/components/theme-toggle.tsx`)
```typescript
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

## Component Styling Patterns

### Base Component Pattern
```typescript
import { cn } from '@/lib/utils';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          'base-classes',
          {
            'variant-classes': variant === 'default',
            'destructive-classes': variant === 'destructive',
            'outline-classes': variant === 'outline',
            'secondary-classes': variant === 'secondary',
          },
          {
            'size-default': size === 'default',
            'size-sm': size === 'sm',
            'size-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Utility Class Combinations
```typescript
// Common utility combinations
const cardClasses = 'bg-card border border-border rounded-lg shadow-sm';
const buttonClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
const inputClasses = 'border border-input bg-background px-3 py-2 rounded-md';
```

## Animation System

### Custom Animations
```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Framer Motion Integration
```typescript
import { motion } from 'framer-motion';

const AnimatedComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
```

## Responsive Design Patterns

### Mobile-First Approach
```typescript
const ResponsiveComponent = () => {
  return (
    <div className="
      p-4 
      md:p-6 
      lg:p-8 
      grid 
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      md:gap-6
    ">
      {/* Content */}
    </div>
  );
};
```

### Breakpoint-Specific Styles
```typescript
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
};
```

## Typography System

### Font Configuration
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
}
```

### Typography Classes
```typescript
const typographyClasses = {
  h1: 'text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
};
```

## Component Library Integration

### ShadCN/UI Component Customization
```typescript
// Button component with custom variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Radix UI Customization
```typescript
import * as RadixDialog from '@radix-ui/react-dialog';

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
));
```

## Layout Patterns

### Grid System
```typescript
const GridLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
};
```

### Flexbox Patterns
```typescript
const FlexLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {children}
    </div>
  );
};
```

### Container Patterns
```typescript
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};
```

## Icon System

### Lucide React Icons
```typescript
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search,
  Plus,
  ChevronDown,
  X
} from 'lucide-react';

const IconButton = ({ icon: Icon, ...props }) => (
  <button className="p-2 rounded-md hover:bg-accent" {...props}>
    <Icon className="h-4 w-4" />
  </button>
);
```

### Custom Icon Components
```typescript
const Logo = ({ className }: { className?: string }) => (
  <svg className={cn('h-8 w-8', className)} viewBox="0 0 24 24">
    {/* SVG content */}
  </svg>
);
```

## Performance Optimization

### CSS-in-JS Performance
```typescript
// Avoid inline styles
const BadExample = () => (
  <div style={{ color: 'red', fontSize: '16px' }}>Bad</div>
);

// Use Tailwind classes instead
const GoodExample = () => (
  <div className="text-red-500 text-base">Good</div>
);
```

### Critical CSS
```typescript
// Load critical CSS first
import '@/index.css'; // Contains critical styles
import '@/components/ui/styles.css'; // Component styles
```

## Best Practices

### Styling Guidelines
1. **Consistency**: Use design tokens for consistent spacing and colors
2. **Accessibility**: Include proper contrast ratios and focus states
3. **Performance**: Minimize CSS bundle size with Tailwind's purge
4. **Maintainability**: Use component variants instead of custom CSS

### Component Styling
1. **Single Responsibility**: Each component should have a clear visual purpose
2. **Composition**: Build complex layouts from simple components
3. **Flexibility**: Use props for customization rather than multiple components
4. **Theming**: Support both light and dark themes consistently

### Development Workflow
1. **Design System**: Follow established design patterns
2. **Mobile First**: Design for mobile devices first
3. **Testing**: Test components across different screen sizes
4. **Documentation**: Document component variants and usage patterns