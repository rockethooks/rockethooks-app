# RocketHooks Component Tokens

A comprehensive system of design tokens for consistent component styling including border radius, shadows, animations, and z-index layering.

## Border Radius System

### Base Radius Scale
Consistent border radius values for component styling and visual hierarchy.

```css
/* Border Radius Scale */
--radius-none: 0px;              /* 0 - No radius, sharp corners */
--radius-sm: 2px;                /* 0.125rem - Very subtle rounding */
--radius-DEFAULT: 6px;           /* 0.375rem - Default component radius */
--radius-md: 6px;                /* 0.375rem - Medium radius (same as default) */
--radius-lg: 8px;                /* 0.5rem - Large radius for cards, dialogs */
--radius-xl: 12px;               /* 0.75rem - Extra large radius */
--radius-2xl: 16px;              /* 1rem - Very large radius */
--radius-3xl: 24px;              /* 1.5rem - Maximum practical radius */
--radius-full: 9999px;           /* Full radius for pills, avatars */

/* Semantic Radius Tokens */
--radius-button: var(--radius-md);      /* 6px - Standard button radius */
--radius-input: var(--radius-md);       /* 6px - Form input radius */
--radius-card: var(--radius-lg);        /* 8px - Card component radius */
--radius-modal: var(--radius-xl);       /* 12px - Modal/dialog radius */
--radius-tooltip: var(--radius-sm);     /* 2px - Tooltip radius */
--radius-badge: var(--radius-full);     /* Full - Badge/pill radius */
--radius-avatar: var(--radius-full);    /* Full - Avatar radius */
```

### Adaptive Radius System
Based on existing Tailwind configuration, using CSS custom properties.

```css
/* Adaptive Radius (from tailwind.config.ts) */
:root {
  --radius: 0.5rem;              /* 8px - Base radius value */
}

/* Calculated Radius Values */
--radius-lg: var(--radius);             /* 8px - Large (base) */
--radius-md: calc(var(--radius) - 2px); /* 6px - Medium */
--radius-sm: calc(var(--radius) - 4px); /* 4px - Small */

/* Component Applications */
.btn { border-radius: var(--radius-md); }
.card { border-radius: var(--radius-lg); }
.input { border-radius: var(--radius-md); }
.dialog { border-radius: var(--radius-lg); }
```

## Shadow System

### Elevation Shadows
Consistent shadow system for depth and hierarchy indication.

```css
/* Shadow Scale - Material Design Inspired */
--shadow-xs: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
--shadow-DEFAULT: 0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1);
--shadow-md: 0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1);
--shadow-lg: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1);
--shadow-xl: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 8px 10px -6px hsl(0 0% 0% / 0.1);
--shadow-2xl: 0 25px 50px -12px hsl(0 0% 0% / 0.25);
--shadow-inner: inset 0 2px 4px 0 hsl(0 0% 0% / 0.05);
--shadow-none: 0 0 #0000;

/* Colored Shadows */
--shadow-primary: 0 4px 14px 0 hsl(var(--primary) / 0.15);
--shadow-success: 0 4px 14px 0 hsl(var(--success) / 0.15);
--shadow-warning: 0 4px 14px 0 hsl(var(--warning) / 0.15);
--shadow-destructive: 0 4px 14px 0 hsl(var(--destructive) / 0.15);

/* Focus Shadows */
--shadow-focus: 0 0 0 2px hsl(var(--ring));
--shadow-focus-primary: 0 0 0 2px hsl(var(--primary) / 0.2);
--shadow-focus-destructive: 0 0 0 2px hsl(var(--destructive) / 0.2);
```

### Semantic Shadow Tokens
Pre-defined shadow applications for specific component types.

```css
/* Component-Specific Shadows */
--shadow-card: var(--shadow-sm);            /* Subtle card elevation */
--shadow-card-hover: var(--shadow-md);      /* Card hover state */
--shadow-button: var(--shadow-xs);          /* Button depth */
--shadow-button-hover: var(--shadow-sm);    /* Button hover state */
--shadow-modal: var(--shadow-2xl);          /* Modal/dialog shadow */
--shadow-dropdown: var(--shadow-lg);        /* Dropdown/popover shadow */
--shadow-tooltip: var(--shadow-md);         /* Tooltip shadow */
--shadow-navbar: var(--shadow-sm);          /* Navigation bar shadow */
--shadow-sidebar: var(--shadow-lg);         /* Sidebar shadow */

/* Interactive Shadows */
--shadow-interactive: var(--shadow-sm);
--shadow-interactive-hover: var(--shadow-md);
--shadow-interactive-active: var(--shadow-xs);
```

## Animation System

### Duration Tokens
Consistent timing for animations and transitions.

```css
/* Animation Durations */
--duration-instant: 0ms;         /* Instant - No animation */
--duration-fast: 100ms;          /* Fast - Quick feedback */
--duration-normal: 150ms;        /* Normal - Standard transitions */
--duration-medium: 200ms;        /* Medium - Comfortable transitions */
--duration-slow: 300ms;          /* Slow - Noticeable transitions */
--duration-slower: 500ms;        /* Slower - Emphasized transitions */
--duration-slowest: 700ms;       /* Slowest - Major state changes */

/* Semantic Duration Tokens */
--duration-hover: var(--duration-fast);     /* 100ms - Hover effects */
--duration-focus: var(--duration-normal);   /* 150ms - Focus states */
--duration-button: var(--duration-normal);  /* 150ms - Button interactions */
--duration-modal: var(--duration-medium);   /* 200ms - Modal open/close */
--duration-page: var(--duration-slow);      /* 300ms - Page transitions */
--duration-toast: var(--duration-medium);   /* 200ms - Toast animations */
```

### Easing Functions
Carefully tuned easing curves for natural motion.

```css
/* Easing Functions */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom Easing Curves */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-back-in: cubic-bezier(0.36, 0, 0.66, -0.56);
--ease-back-out: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);

/* Semantic Easing Tokens */
--ease-ui: var(--ease-out);              /* UI element animations */
--ease-hover: var(--ease-out);           /* Hover state transitions */
--ease-modal: var(--ease-in-out);        /* Modal animations */
--ease-page: var(--ease-in-out);         /* Page transitions */
--ease-spring: var(--ease-bounce);       /* Spring-like animations */
```

### Predefined Animations
Common animation patterns used throughout the application.

```css
/* Keyframe Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Accordion Animations (from existing config) */
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn var(--duration-medium) var(--ease-out);
}

.animate-slide-up {
  animation: slideInUp var(--duration-medium) var(--ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--duration-medium) var(--ease-out);
}

.animate-shake {
  animation: shake var(--duration-slow) var(--ease-bounce);
}

.animate-pulse-slow {
  animation: pulse-slow 3s var(--ease-in-out) infinite;
}

.animate-accordion-down {
  animation: accordion-down var(--duration-medium) var(--ease-out);
}

.animate-accordion-up {
  animation: accordion-up var(--duration-medium) var(--ease-out);
}
```

## Z-Index System

### Layering Scale
Consistent z-index values for proper element stacking.

```css
/* Z-Index Scale */
--z-base: 1;                     /* Base layer - Normal content */
--z-dropdown: 10;                /* Dropdowns, select menus */
--z-sticky: 20;                  /* Sticky elements */
--z-fixed: 30;                   /* Fixed positioned elements */
--z-modal-backdrop: 40;          /* Modal backdrop */
--z-modal: 50;                   /* Modal content */
--z-popover: 60;                 /* Popovers, tooltips */
--z-tooltip: 70;                 /* Tooltips */
--z-toast: 80;                   /* Toast notifications */
--z-drawer: 90;                  /* Slide-out drawers */
--z-overlay: 100;                /* Full-screen overlays */
--z-max: 999;                    /* Maximum z-index for critical elements */

/* Semantic Z-Index Tokens */
--z-header: var(--z-sticky);           /* Site header */
--z-sidebar: var(--z-fixed);           /* Navigation sidebar */
--z-dropdown-menu: var(--z-dropdown);  /* Dropdown menus */
--z-dialog: var(--z-modal);            /* Dialog components */
--z-sheet: var(--z-drawer);            /* Sheet components */
--z-notification: var(--z-toast);      /* Notification system */
--z-loading: var(--z-overlay);         /* Loading overlays */
```

### Component Z-Index Applications
```css
/* Component-Specific Z-Index */
.navbar {
  z-index: var(--z-header);
}

.sidebar {
  z-index: var(--z-sidebar);
}

.dropdown-menu {
  z-index: var(--z-dropdown-menu);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

.modal-content {
  z-index: var(--z-modal);
}

.tooltip {
  z-index: var(--z-tooltip);
}

.toast {
  z-index: var(--z-toast);
}
```

## Component Token Applications

### Button Tokens
Complete button styling tokens.

```css
.button {
  /* Spacing */
  padding: var(--space-2) var(--space-4);        /* 8px 16px */
  gap: var(--space-2);                           /* 8px between icon and text */
  
  /* Border */
  border-radius: var(--radius-button);           /* 6px */
  border: 1px solid transparent;
  
  /* Typography */
  font-size: 14px;                               /* text-sm */
  font-weight: 500;                              /* medium */
  line-height: 20px;
  
  /* Animation */
  transition: all var(--duration-hover) var(--ease-hover);
  
  /* Shadow */
  box-shadow: var(--shadow-button);
  
  /* Minimum touch target */
  min-height: var(--space-11);                   /* 44px */
}

.button:hover {
  box-shadow: var(--shadow-button-hover);
}

.button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.button.button-sm {
  padding: var(--space-1-5) var(--space-3);     /* 6px 12px */
  font-size: 12px;                              /* text-xs */
}

.button.button-lg {
  padding: var(--space-3) var(--space-6);       /* 12px 24px */
  font-size: 16px;                              /* text-base */
}
```

### Card Tokens
Complete card component styling tokens.

```css
.card {
  /* Background */
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  
  /* Border */
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-card);             /* 8px */
  
  /* Shadow */
  box-shadow: var(--shadow-card);
  
  /* Animation */
  transition: box-shadow var(--duration-hover) var(--ease-hover);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}

.card-header {
  padding: var(--space-6);                       /* 24px */
  padding-bottom: var(--space-4);                /* 16px bottom */
}

.card-content {
  padding: var(--space-6);                       /* 24px */
  padding-top: 0;
}

.card-footer {
  padding: var(--space-6);                       /* 24px */
  padding-top: var(--space-4);                   /* 16px top */
}
```

### Input Tokens
Form input styling tokens.

```css
.input {
  /* Spacing */
  padding: var(--space-2) var(--space-3);       /* 8px 12px */
  
  /* Border */
  border: 1px solid hsl(var(--input));
  border-radius: var(--radius-input);            /* 6px */
  
  /* Background */
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  
  /* Typography */
  font-size: 14px;                              /* text-sm */
  line-height: 20px;
  
  /* Animation */
  transition: border-color var(--duration-focus) var(--ease-focus);
  
  /* Minimum touch target */
  min-height: var(--space-11);                  /* 44px */
}

.input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: var(--shadow-focus);
}

.input::placeholder {
  color: hsl(var(--muted-foreground));
}
```

## Implementation Examples

### CSS Custom Properties Usage
```css
/* Component with all tokens applied */
.custom-component {
  /* Spacing */
  padding: var(--spacing-component-lg);
  margin: var(--spacing-layout-md);
  gap: var(--space-4);
  
  /* Appearance */
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  
  /* Animation */
  transition:
    box-shadow var(--duration-hover) var(--ease-hover),
    transform var(--duration-hover) var(--ease-hover);
  
  /* Layering */
  z-index: var(--z-base);
}

.custom-component:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}
```

### React Component with Design Tokens
```tsx
interface ComponentProps {
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const CustomComponent = ({ variant = 'default', size = 'md' }: ComponentProps) => {
  const variants = {
    default: 'shadow-card hover:shadow-card-hover',
    elevated: 'shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-border shadow-none'
  };

  const sizes = {
    sm: 'p-4 rounded-md',
    md: 'p-6 rounded-lg', 
    lg: 'p-8 rounded-xl'
  };

  return (
    <div 
      className={`
        transition-all duration-hover ease-hover
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      Component content
    </div>
  );
};
```

### Sass/SCSS Mixins for Design Tokens
```scss
// Button mixin using design tokens
@mixin button-base() {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-button);
  font-size: 14px;
  font-weight: 500;
  min-height: var(--space-11);
  transition: all var(--duration-hover) var(--ease-hover);
  box-shadow: var(--shadow-button);
  
  &:hover {
    box-shadow: var(--shadow-button-hover);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
}

// Card mixin using design tokens
@mixin card-base() {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-hover) var(--ease-hover);
  
  &:hover {
    box-shadow: var(--shadow-card-hover);
  }
}
```

This comprehensive component token system ensures consistent styling, smooth animations, and proper layering across all RocketHooks interface components while maintaining flexibility for different use cases and states.