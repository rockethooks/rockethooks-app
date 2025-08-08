# RocketHooks Typography System

A comprehensive typography system built on Inter font family with optimized readability, accessibility, and visual hierarchy.

## Font Families

### Primary Font Stack
Inter is the primary font family, providing excellent readability across all screen sizes and devices.

```css
/* Font Family Definition */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Font Feature Settings for Enhanced Rendering */
font-feature-settings: 'rlig' 1, 'calt' 1, 'ss01' 1, 'ss02' 1;
```

### Font Weights
Inter supports a full range of weights for proper typographic hierarchy:

```css
/* Available Font Weights */
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;        /* Default body text */
--font-medium: 500;        /* UI elements, labels */
--font-semibold: 600;      /* Subheadings, important text */
--font-bold: 700;          /* Headings, emphasis */
--font-extrabold: 800;     /* Large headings */
--font-black: 900;         /* Display text, hero headings */
```

## Type Scale

### Desktop Scale (Base: 16px)
Optimized for desktop viewing with comfortable reading sizes.

```css
/* Display Styles - For hero sections and large headings */
.text-display-2xl {
  font-size: 72px;          /* 4.5rem */
  line-height: 90px;        /* 5.625rem - 1.25 ratio */
  font-weight: 800;         /* extrabold */
  letter-spacing: -0.025em; /* -2.5% */
}

.text-display-xl {
  font-size: 60px;          /* 3.75rem */
  line-height: 72px;        /* 4.5rem - 1.2 ratio */
  font-weight: 800;         /* extrabold */
  letter-spacing: -0.025em; /* -2.5% */
}

.text-display-lg {
  font-size: 48px;          /* 3rem */
  line-height: 60px;        /* 3.75rem - 1.25 ratio */
  font-weight: 700;         /* bold */
  letter-spacing: -0.02em;  /* -2% */
}

/* Heading Styles */
.text-h1 {
  font-size: 36px;          /* 2.25rem */
  line-height: 40px;        /* 2.5rem - 1.11 ratio */
  font-weight: 700;         /* bold */
  letter-spacing: -0.02em;  /* -2% */
}

.text-h2 {
  font-size: 30px;          /* 1.875rem */
  line-height: 36px;        /* 2.25rem - 1.2 ratio */
  font-weight: 600;         /* semibold */
  letter-spacing: -0.01em;  /* -1% */
}

.text-h3 {
  font-size: 24px;          /* 1.5rem */
  line-height: 32px;        /* 2rem - 1.33 ratio */
  font-weight: 600;         /* semibold */
  letter-spacing: 0;
}

.text-h4 {
  font-size: 20px;          /* 1.25rem */
  line-height: 28px;        /* 1.75rem - 1.4 ratio */
  font-weight: 600;         /* semibold */
  letter-spacing: 0;
}

.text-h5 {
  font-size: 18px;          /* 1.125rem */
  line-height: 28px;        /* 1.75rem - 1.55 ratio */
  font-weight: 600;         /* semibold */
  letter-spacing: 0;
}

.text-h6 {
  font-size: 16px;          /* 1rem */
  line-height: 24px;        /* 1.5rem - 1.5 ratio */
  font-weight: 600;         /* semibold */
  letter-spacing: 0;
}

/* Body Text Styles */
.text-xl {
  font-size: 20px;          /* 1.25rem */
  line-height: 30px;        /* 1.875rem - 1.5 ratio */
  font-weight: 400;         /* normal */
  letter-spacing: 0;
}

.text-lg {
  font-size: 18px;          /* 1.125rem */
  line-height: 28px;        /* 1.75rem - 1.55 ratio */
  font-weight: 400;         /* normal */
  letter-spacing: 0;
}

.text-base {
  font-size: 16px;          /* 1rem - Base size */
  line-height: 24px;        /* 1.5rem - 1.5 ratio */
  font-weight: 400;         /* normal */
  letter-spacing: 0;
}

.text-sm {
  font-size: 14px;          /* 0.875rem */
  line-height: 20px;        /* 1.25rem - 1.43 ratio */
  font-weight: 400;         /* normal */
  letter-spacing: 0;
}

.text-xs {
  font-size: 12px;          /* 0.75rem */
  line-height: 16px;        /* 1rem - 1.33 ratio */
  font-weight: 400;         /* normal */
  letter-spacing: 0;
}

/* Caption and Label Styles */
.text-caption {
  font-size: 12px;          /* 0.75rem */
  line-height: 16px;        /* 1rem */
  font-weight: 500;         /* medium */
  letter-spacing: 0.01em;   /* 1% */
  text-transform: uppercase;
}

.text-overline {
  font-size: 10px;          /* 0.625rem */
  line-height: 16px;        /* 1rem */
  font-weight: 600;         /* semibold */
  letter-spacing: 0.05em;   /* 5% */
  text-transform: uppercase;
}
```

### Mobile Scale (Responsive)
Adjusted typography for mobile devices with touch-friendly sizing.

```css
/* Mobile Responsive Adjustments */
@media (max-width: 768px) {
  .text-display-2xl {
    font-size: 48px;         /* Reduced from 72px */
    line-height: 56px;       /* Adjusted line height */
    letter-spacing: -0.02em; /* Slightly reduced */
  }

  .text-display-xl {
    font-size: 40px;         /* Reduced from 60px */
    line-height: 48px;       /* Adjusted line height */
  }

  .text-display-lg {
    font-size: 36px;         /* Reduced from 48px */
    line-height: 44px;       /* Adjusted line height */
  }

  .text-h1 {
    font-size: 30px;         /* Reduced from 36px */
    line-height: 36px;       /* Adjusted line height */
  }

  .text-h2 {
    font-size: 24px;         /* Reduced from 30px */
    line-height: 32px;       /* Adjusted line height */
  }

  .text-h3 {
    font-size: 20px;         /* Reduced from 24px */
    line-height: 28px;       /* Adjusted line height */
  }

  /* Body text remains the same for readability */
  /* Only large display and heading sizes are reduced */
}
```

## Typography Tokens

### Line Height System
Consistent line heights for optimal readability and vertical rhythm.

```css
/* Line Height Scale */
--leading-none: 1;           /* 100% - For single-line elements */
--leading-tight: 1.25;       /* 125% - For headings */
--leading-snug: 1.375;       /* 137.5% - For compact text */
--leading-normal: 1.5;       /* 150% - Default for body text */
--leading-relaxed: 1.625;    /* 162.5% - For comfortable reading */
--leading-loose: 2;          /* 200% - For very spacious text */
```

### Letter Spacing System
Carefully calibrated spacing for different text sizes and purposes.

```css
/* Letter Spacing Scale */
--tracking-tighter: -0.05em; /* -5% - Very tight, large display text */
--tracking-tight: -0.025em;  /* -2.5% - Tight, headings */
--tracking-normal: 0;        /* 0% - Default, body text */
--tracking-wide: 0.025em;    /* 2.5% - Wide, small text */
--tracking-wider: 0.05em;    /* 5% - Wider, labels and captions */
--tracking-widest: 0.1em;    /* 10% - Widest, overlines */
```

## Usage Guidelines

### Hierarchy and Semantics
Proper usage of typography styles for information hierarchy:

```html
<!-- Page Structure -->
<h1 class="text-h1">Main Page Title</h1>
<h2 class="text-h2">Section Headings</h2>
<h3 class="text-h3">Subsection Headings</h3>

<!-- Body Content -->
<p class="text-base">Default paragraph text for comfortable reading.</p>
<p class="text-lg">Larger body text for emphasis or introduction paragraphs.</p>
<p class="text-sm">Smaller text for captions, footnotes, or secondary information.</p>

<!-- UI Elements -->
<button class="text-sm font-medium">Button Text</button>
<label class="text-xs font-medium uppercase tracking-wide">Form Label</label>
<span class="text-caption">Caption Text</span>
```

### Color Combinations
Typography colors that work with the color system:

```css
/* Primary Text Colors */
.text-primary {
  color: hsl(var(--foreground));      /* Main text color */
}

.text-secondary {
  color: hsl(var(--muted-foreground)); /* Secondary text color */
}

.text-muted {
  color: hsl(var(--muted-foreground)); /* Muted text color */
}

/* State Text Colors */
.text-success {
  color: hsl(var(--success));         /* Success messages */
}

.text-warning {
  color: hsl(var(--warning));         /* Warning messages */
}

.text-destructive {
  color: hsl(var(--destructive));     /* Error messages */
}

.text-info {
  color: hsl(var(--info));           /* Info messages */
}
```

### Accessibility Considerations

#### Contrast Requirements
All text meets WCAG 2.1 AA standards:
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px): 3:1 contrast ratio
- Bold text (≥ 14px): 3:1 contrast ratio

#### Font Size Minimums
- Minimum body text size: 16px (1rem) on desktop
- Minimum touch target text: 14px (0.875rem) on mobile
- Maximum line length: 70-80 characters for optimal readability

### Responsive Typography

#### Fluid Typography with clamp()
For smooth scaling across screen sizes:

```css
/* Fluid heading sizes */
.text-h1-fluid {
  font-size: clamp(1.875rem, 4vw, 2.25rem); /* 30px to 36px */
  line-height: clamp(2.25rem, 4.5vw, 2.5rem);
}

.text-h2-fluid {
  font-size: clamp(1.5rem, 3.5vw, 1.875rem); /* 24px to 30px */
  line-height: clamp(2rem, 4vw, 2.25rem);
}

.text-display-fluid {
  font-size: clamp(3rem, 8vw, 4.5rem); /* 48px to 72px */
  line-height: clamp(3.5rem, 9vw, 5.625rem);
}
```

## Implementation Examples

### React Component with Typography
```tsx
interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
}

const Typography = ({ variant, children, className = '' }: TypographyProps) => {
  const variants = {
    h1: 'text-h1',
    h2: 'text-h2', 
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-h5',
    h6: 'text-h6',
    body: 'text-base',
    caption: 'text-caption'
  };

  const Component = variant.startsWith('h') ? variant : 'p';
  
  return (
    <Component className={`${variants[variant]} ${className}`}>
      {children}
    </Component>
  );
};
```

### CSS Classes for Common Patterns
```css
/* Reading Content */
.prose {
  font-size: 16px;
  line-height: 1.6;
  max-width: 70ch; /* Optimal reading width */
}

.prose h1 { @apply text-h1 mb-6; }
.prose h2 { @apply text-h2 mb-4 mt-8; }
.prose h3 { @apply text-h3 mb-3 mt-6; }
.prose p { @apply text-base mb-4; }

/* UI Text Patterns */
.ui-label {
  @apply text-xs font-medium tracking-wide uppercase;
  color: hsl(var(--muted-foreground));
}

.ui-button {
  @apply text-sm font-medium;
}

.ui-input {
  @apply text-base;
}

/* Status Text */
.status-text {
  @apply text-sm font-medium;
}

.error-text {
  @apply text-sm font-medium;
  color: hsl(var(--destructive));
}

.success-text {
  @apply text-sm font-medium;
  color: hsl(var(--success));
}
```

### Tailwind Configuration
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['72px', { lineHeight: '90px', letterSpacing: '-0.025em' }],
        'display-xl': ['60px', { lineHeight: '72px', letterSpacing: '-0.025em' }],
        'display-lg': ['48px', { lineHeight: '60px', letterSpacing: '-0.02em' }],
        'h1': ['36px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'h2': ['30px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'h3': ['24px', { lineHeight: '32px' }],
        'h4': ['20px', { lineHeight: '28px' }],
        'h5': ['18px', { lineHeight: '28px' }],
        'h6': ['16px', { lineHeight: '24px' }],
      }
    }
  }
}
```

This typography system ensures consistent, accessible, and beautiful text rendering across all RocketHooks interfaces while maintaining excellent readability and user experience.