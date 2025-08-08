# RocketHooks Spacing & Layout System

A comprehensive spacing and layout system built on consistent 4px base unit with responsive breakpoints and grid specifications.

## Spacing Scale

### Base Unit System
All spacing values follow a 4px base unit system for consistent visual rhythm and alignment.

```css
/* Spacing Scale (4px base unit) */
--space-0: 0px;          /* 0 */
--space-px: 1px;         /* 1px - For borders */
--space-0-5: 2px;        /* 0.125rem - Micro spacing */
--space-1: 4px;          /* 0.25rem - Base unit */
--space-1-5: 6px;        /* 0.375rem */
--space-2: 8px;          /* 0.5rem */
--space-2-5: 10px;       /* 0.625rem */
--space-3: 12px;         /* 0.75rem */
--space-3-5: 14px;       /* 0.875rem */
--space-4: 16px;         /* 1rem */
--space-5: 20px;         /* 1.25rem */
--space-6: 24px;         /* 1.5rem */
--space-7: 28px;         /* 1.75rem */
--space-8: 32px;         /* 2rem */
--space-9: 36px;         /* 2.25rem */
--space-10: 40px;        /* 2.5rem */
--space-11: 44px;        /* 2.75rem - Minimum touch target */
--space-12: 48px;        /* 3rem */
--space-14: 56px;        /* 3.5rem */
--space-16: 64px;        /* 4rem */
--space-20: 80px;        /* 5rem */
--space-24: 96px;        /* 6rem */
--space-28: 112px;       /* 7rem */
--space-32: 128px;       /* 8rem */
--space-36: 144px;       /* 9rem */
--space-40: 160px;       /* 10rem */
--space-44: 176px;       /* 11rem */
--space-48: 192px;       /* 12rem */
--space-52: 208px;       /* 13rem */
--space-56: 224px;       /* 14rem */
--space-60: 240px;       /* 15rem */
--space-64: 256px;       /* 16rem */
```

### Semantic Spacing Tokens
Predefined spacing values for common use cases.

```css
/* Component Spacing */
--spacing-component-xs: var(--space-1);    /* 4px - Tight internal spacing */
--spacing-component-sm: var(--space-2);    /* 8px - Small internal spacing */
--spacing-component-md: var(--space-3);    /* 12px - Medium internal spacing */
--spacing-component-lg: var(--space-4);    /* 16px - Large internal spacing */
--spacing-component-xl: var(--space-6);    /* 24px - Extra large internal spacing */

/* Layout Spacing */
--spacing-layout-xs: var(--space-4);       /* 16px - Tight layout spacing */
--spacing-layout-sm: var(--space-6);       /* 24px - Small layout spacing */
--spacing-layout-md: var(--space-8);       /* 32px - Medium layout spacing */
--spacing-layout-lg: var(--space-12);      /* 48px - Large layout spacing */
--spacing-layout-xl: var(--space-16);      /* 64px - Extra large layout spacing */
--spacing-layout-2xl: var(--space-20);     /* 80px - Section spacing */
--spacing-layout-3xl: var(--space-24);     /* 96px - Major section spacing */

/* Touch Targets */
--spacing-touch-min: var(--space-11);      /* 44px - Minimum touch target */
--spacing-touch-comfortable: var(--space-12); /* 48px - Comfortable touch target */
```

## Container System

### Container Widths
Responsive container widths optimized for content readability and layout efficiency.

```css
/* Container Sizes */
.container-sm {
  max-width: 640px;        /* Small container - Forms, narrow content */
  margin: 0 auto;
  padding: 0 var(--space-4); /* 16px horizontal padding */
}

.container-md {
  max-width: 768px;        /* Medium container - Articles, main content */
  margin: 0 auto;
  padding: 0 var(--space-6); /* 24px horizontal padding */
}

.container-lg {
  max-width: 1024px;       /* Large container - Dashboard layouts */
  margin: 0 auto;
  padding: 0 var(--space-8); /* 32px horizontal padding */
}

.container-xl {
  max-width: 1280px;       /* Extra large container - Wide dashboards */
  margin: 0 auto;
  padding: 0 var(--space-8); /* 32px horizontal padding */
}

.container-2xl {
  max-width: 1400px;       /* Maximum container - As per Tailwind config */
  margin: 0 auto;
  padding: 0 var(--space-8); /* 32px horizontal padding */
}

.container-full {
  width: 100%;             /* Full width container */
  padding: 0 var(--space-4); /* Minimal horizontal padding */
}
```

### Responsive Container Behavior
```css
/* Responsive Container Padding */
@media (max-width: 640px) {
  .container-sm,
  .container-md,
  .container-lg,
  .container-xl,
  .container-2xl {
    padding: 0 var(--space-4); /* 16px on mobile */
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .container-lg,
  .container-xl,
  .container-2xl {
    padding: 0 var(--space-6); /* 24px on tablet */
  }
}

@media (min-width: 1025px) {
  .container-lg,
  .container-xl,
  .container-2xl {
    padding: 0 var(--space-8); /* 32px on desktop */
  }
}
```

## Breakpoint System

### Responsive Breakpoints
Mobile-first breakpoint system aligned with common device sizes.

```css
/* Breakpoint Variables */
--breakpoint-xs: 0px;           /* Extra small devices */
--breakpoint-sm: 640px;         /* Small devices (mobile landscape) */
--breakpoint-md: 768px;         /* Medium devices (tablets) */
--breakpoint-lg: 1024px;        /* Large devices (desktop) */
--breakpoint-xl: 1280px;        /* Extra large devices (large desktop) */
--breakpoint-2xl: 1536px;       /* 2X large devices (very large desktop) */

/* Media Query Mixins (for Sass/SCSS) */
@mixin mobile-only {
  @media (max-width: 639px) { @content; }
}

@mixin tablet-up {
  @media (min-width: 640px) { @content; }
}

@mixin desktop-up {
  @media (min-width: 1024px) { @content; }
}

@mixin large-desktop-up {
  @media (min-width: 1280px) { @content; }
}
```

### Responsive Spacing
Spacing that adapts to different screen sizes.

```css
/* Responsive Spacing Classes */
.responsive-padding {
  padding: var(--space-4);  /* 16px on mobile */
}

@media (min-width: 768px) {
  .responsive-padding {
    padding: var(--space-6); /* 24px on tablet+ */
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: var(--space-8); /* 32px on desktop+ */
  }
}

/* Responsive Margins */
.responsive-margin-y {
  margin-top: var(--space-8);    /* 32px on mobile */
  margin-bottom: var(--space-8);
}

@media (min-width: 768px) {
  .responsive-margin-y {
    margin-top: var(--space-12);  /* 48px on tablet+ */
    margin-bottom: var(--space-12);
  }
}

@media (min-width: 1024px) {
  .responsive-margin-y {
    margin-top: var(--space-16);  /* 64px on desktop+ */
    margin-bottom: var(--space-16);
  }
}
```

## Grid Systems

### CSS Grid Layout
Modern CSS Grid system for complex layouts.

```css
/* Basic Grid Container */
.grid-container {
  display: grid;
  gap: var(--space-6);        /* 24px gap */
}

/* Common Grid Patterns */
.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Responsive Grid */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;  /* 1 column on mobile */
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr); /* 3 columns on desktop */
    gap: var(--space-8);
  }
}

/* Dashboard Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 250px 1fr; /* Sidebar + main content */
    gap: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 280px 1fr 320px; /* Sidebar + main + aside */
    gap: var(--space-8);
  }
}
```

### Flexbox Utilities
Flexbox patterns for common layout needs.

```css
/* Flex Container Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

/* Flex Item Utilities */
.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }

/* Alignment Utilities */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.items-baseline { align-items: baseline; }

/* Gap Utilities for Flexbox */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }
```

## Layout Patterns

### Common Layout Components

#### Card Layout
```css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: var(--space-6);        /* 24px internal padding */
  box-shadow: 0 1px 3px 0 hsl(0 0% 0% / 0.1);
}

.card-header {
  padding-bottom: var(--space-4); /* 16px bottom spacing */
  border-bottom: 1px solid hsl(var(--border));
  margin-bottom: var(--space-4);  /* 16px separation */
}

.card-content {
  /* No additional spacing - inherits card padding */
}

.card-footer {
  padding-top: var(--space-4);    /* 16px top spacing */
  border-top: 1px solid hsl(var(--border));
  margin-top: var(--space-4);     /* 16px separation */
}
```

#### Form Layout
```css
.form-container {
  max-width: 640px;               /* Optimal form width */
  margin: 0 auto;
  padding: var(--space-6);        /* 24px padding */
}

.form-group {
  margin-bottom: var(--space-6);  /* 24px between form groups */
}

.form-group-inline {
  display: flex;
  gap: var(--space-4);            /* 16px gap between inline elements */
  align-items: end;               /* Align to form input baseline */
}

.form-actions {
  display: flex;
  gap: var(--space-3);            /* 12px gap between buttons */
  justify-content: flex-end;
  margin-top: var(--space-8);     /* 32px top margin */
  padding-top: var(--space-6);    /* 24px top padding */
  border-top: 1px solid hsl(var(--border));
}
```

#### Navigation Layout
```css
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6); /* 16px vertical, 24px horizontal */
  border-bottom: 1px solid hsl(var(--border));
}

.nav-links {
  display: flex;
  gap: var(--space-6);            /* 24px gap between nav items */
  align-items: center;
}

.nav-link {
  padding: var(--space-2) var(--space-3); /* 8px vertical, 12px horizontal */
  min-height: var(--space-11);   /* 44px minimum touch target */
  display: flex;
  align-items: center;
}
```

## Mobile-First Responsive Principles

### Touch-Friendly Spacing
Optimized spacing for mobile touch interactions.

```css
/* Mobile Touch Targets */
.touch-target {
  min-height: var(--space-11);   /* 44px minimum */
  min-width: var(--space-11);    /* 44px minimum */
  display: flex;
  align-items: center;
  justify-content: center;
}

.touch-target-comfortable {
  min-height: var(--space-12);   /* 48px comfortable */
  min-width: var(--space-12);    /* 48px comfortable */
}

/* Mobile Spacing Adjustments */
@media (max-width: 640px) {
  .mobile-padding-reduce {
    padding: var(--space-4);     /* Reduce padding on mobile */
  }
  
  .mobile-gap-reduce {
    gap: var(--space-3);         /* Reduce gaps on mobile */
  }
  
  .mobile-margin-reduce {
    margin: var(--space-4) 0;    /* Reduce margins on mobile */
  }
}
```

### Scrollable Areas
Proper spacing for scrollable content areas.

```css
.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  padding: var(--space-4);           /* Internal padding */
}

.scroll-item {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid hsl(var(--border));
}

.scroll-item:last-child {
  border-bottom: none;
  margin-bottom: var(--space-4);     /* Extra space at bottom */
}
```

## Implementation Examples

### React Layout Components
```tsx
// Container Component
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  children: React.ReactNode;
  className?: string;
}

const Container = ({ size = 'lg', children, className = '' }: ContainerProps) => {
  return (
    <div className={`container-${size} ${className}`}>
      {children}
    </div>
  );
};

// Grid Component
interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Grid = ({ cols = 1, gap = 'md', children }: GridProps) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6', 
    lg: 'gap-8'
  };

  return (
    <div className={`grid grid-cols-${cols} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
};

// Stack Component for Vertical Spacing
interface StackProps {
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Stack = ({ space = 'md', children }: StackProps) => {
  const spaceClasses = {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };

  return (
    <div className={spaceClasses[space]}>
      {children}
    </div>
  );
};
```

### CSS Utility Classes
```css
/* Spacing Utilities */
.p-xs { padding: var(--space-1); }
.p-sm { padding: var(--space-2); }
.p-md { padding: var(--space-4); }
.p-lg { padding: var(--space-6); }
.p-xl { padding: var(--space-8); }

.m-xs { margin: var(--space-1); }
.m-sm { margin: var(--space-2); }
.m-md { margin: var(--space-4); }
.m-lg { margin: var(--space-6); }
.m-xl { margin: var(--space-8); }

/* Directional Spacing */
.px-md { padding-left: var(--space-4); padding-right: var(--space-4); }
.py-md { padding-top: var(--space-4); padding-bottom: var(--space-4); }
.mx-md { margin-left: var(--space-4); margin-right: var(--space-4); }
.my-md { margin-top: var(--space-4); margin-bottom: var(--space-4); }

/* Layout Utilities */
.section-spacing { margin: var(--spacing-layout-xl) 0; }
.component-spacing { padding: var(--spacing-component-lg); }
.touch-spacing { padding: var(--spacing-touch-comfortable); }
```

This spacing and layout system provides a solid foundation for consistent, responsive, and accessible layouts across the RocketHooks application while maintaining optimal user experience on all devices.