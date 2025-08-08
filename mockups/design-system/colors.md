# RocketHooks Color System

A comprehensive color system built on HSL values for consistent theming and accessibility across light and dark modes.

## Primary Colors

### Brand Primary
The signature indigo blue that represents RocketHooks' modern, trustworthy identity.

```css
/* Primary */
--primary: 246 80% 60%;           /* hsl(246, 80%, 60%) - #6366f1 */
--primary-foreground: 210 40% 98%; /* hsl(210, 40%, 98%) - #f8fafc */

/* Usage */
.btn-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

### Secondary & Supporting
Neutral colors for secondary actions and supporting UI elements.

```css
/* Light Mode */
--secondary: 210 40% 96.1%;       /* hsl(210, 40%, 96.1%) - #f1f5f9 */
--secondary-foreground: 222.2 47.4% 11.2%; /* hsl(222.2, 47.4%, 11.2%) - #0f172a */

/* Dark Mode */
--secondary: 217.2 32.6% 17.5%;   /* hsl(217.2, 32.6%, 17.5%) - #1e293b */
--secondary-foreground: 210 40% 98%; /* hsl(210, 40%, 98%) - #f8fafc */
```

## Surface Colors

### Backgrounds & Cards
Base surfaces that provide the foundation for content.

```css
/* Light Mode */
--background: 0 0% 100%;          /* Pure white */
--card: 0 0% 100%;               /* Pure white */
--popover: 0 0% 100%;            /* Pure white */

/* Dark Mode */
--background: 222.2 84% 4.9%;     /* hsl(222.2, 84%, 4.9%) - #020617 */
--card: 222.2 84% 4.9%;          /* hsl(222.2, 84%, 4.9%) - #020617 */
--popover: 222.2 84% 4.9%;       /* hsl(222.2, 84%, 4.9%) - #020617 */
```

### Text Colors
Foreground colors for optimal readability and hierarchy.

```css
/* Light Mode */
--foreground: 222.2 84% 4.9%;     /* Near black for high contrast */
--muted-foreground: 215.4 16.3% 46.9%; /* Medium gray for secondary text */

/* Dark Mode */
--foreground: 210 40% 98%;        /* Near white for high contrast */
--muted-foreground: 215 20.2% 65.1%; /* Light gray for secondary text */
```

## State Colors

### Success States
For confirmations, successful actions, and positive feedback.

```css
--success: 142 76% 36%;           /* hsl(142, 76%, 36%) - #16a34a */
--success-foreground: 210 40% 98%; /* White text on success background */

/* Usage Examples */
.alert-success {
  background: hsl(var(--success) / 0.1);
  border: 1px solid hsl(var(--success) / 0.2);
  color: hsl(var(--success));
}

.btn-success {
  background: hsl(var(--success));
  color: hsl(var(--success-foreground));
}
```

### Warning States
For caution messages and potentially destructive actions.

```css
--warning: 38 92% 50%;            /* hsl(38, 92%, 50%) - #f59e0b */
--warning-foreground: 210 40% 98%; /* White text on warning background */

/* Usage Examples */
.alert-warning {
  background: hsl(var(--warning) / 0.1);
  border: 1px solid hsl(var(--warning) / 0.2);
  color: hsl(var(--warning));
}
```

### Error/Destructive States
For errors, failed actions, and destructive operations.

```css
--destructive: 0 84.2% 60.2%;     /* hsl(0, 84.2%, 60.2%) - #ef4444 */
--destructive-foreground: 210 40% 98%; /* White text on error background */

/* Dark Mode - Adjusted for better readability */
--destructive: 0 62.8% 30.6%;     /* Darker red for dark mode */

/* Usage Examples */
.alert-error {
  background: hsl(var(--destructive) / 0.1);
  border: 1px solid hsl(var(--destructive) / 0.2);
  color: hsl(var(--destructive));
}

.btn-destructive {
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}
```

### Info States
For informational messages and neutral feedback.

```css
--info: 217 91% 60%;              /* hsl(217, 91%, 60%) - #3b82f6 */
--info-foreground: 210 40% 98%;   /* White text on info background */

/* Usage Examples */
.alert-info {
  background: hsl(var(--info) / 0.1);
  border: 1px solid hsl(var(--info) / 0.2);
  color: hsl(var(--info));
}
```

## Interface Colors

### Borders & Inputs
Subtle colors for form elements and component boundaries.

```css
/* Light Mode */
--border: 214.3 31.8% 91.4%;      /* hsl(214.3, 31.8%, 91.4%) - #e2e8f0 */
--input: 214.3 31.8% 91.4%;       /* Same as border for consistency */
--ring: 221.2 83.2% 53.3%;        /* Focus ring - similar to primary */

/* Dark Mode */
--border: 217.2 32.6% 17.5%;      /* hsl(217.2, 32.6%, 17.5%) - #334155 */
--input: 217.2 32.6% 17.5%;       /* Same as border for consistency */
--ring: 224.3 76.3% 48%;          /* Adjusted focus ring for dark mode */
```

### Muted & Accent
Supporting colors for subtle backgrounds and accents.

```css
/* Light Mode */
--muted: 210 40% 96.1%;           /* Very light gray background */
--accent: 210 40% 96.1%;          /* Same as muted for consistency */

/* Dark Mode */
--muted: 217.2 32.6% 17.5%;       /* Dark gray background */
--accent: 217.2 32.6% 17.5%;      /* Same as muted for consistency */
```

## Sidebar Colors

Dedicated color tokens for sidebar navigation components.

```css
/* Light Mode */
--sidebar-background: 0 0% 98%;    /* Slightly off-white */
--sidebar-foreground: 240 5.3% 26.1%; /* Dark gray text */
--sidebar-primary: 246 80% 60%;    /* Brand primary */
--sidebar-primary-foreground: 0 0% 98%; /* Near white */
--sidebar-accent: 240 4.8% 95.9%;  /* Light hover state */
--sidebar-accent-foreground: 240 5.9% 10%; /* Dark text on light hover */
--sidebar-border: 220 13% 91%;     /* Subtle border */
--sidebar-ring: 221.2 83.2% 53.3%; /* Focus ring */

/* Dark Mode */
--sidebar-background: 222.2 84% 4.9%; /* Same as main background */
--sidebar-foreground: 210 40% 98%;  /* Light text */
--sidebar-primary: 246 80% 60%;     /* Brand primary (unchanged) */
--sidebar-primary-foreground: 0 0% 100%; /* Pure white */
--sidebar-accent: 217.2 32.6% 17.5%; /* Dark hover state */
--sidebar-accent-foreground: 210 40% 98%; /* Light text on dark hover */
--sidebar-border: 217.2 32.6% 17.5%; /* Subtle dark border */
--sidebar-ring: 224.3 76.3% 48%;    /* Adjusted focus ring */
```

## Color Usage Guidelines

### Semantic Usage
- **Primary**: Main actions, links, active states
- **Secondary**: Supporting actions, less prominent buttons
- **Success**: Confirmations, completed states, positive indicators
- **Warning**: Caution messages, pending states, attention-required items
- **Destructive**: Errors, delete actions, critical alerts
- **Info**: Informational messages, tips, neutral feedback
- **Muted**: Secondary text, disabled states, subtle backgrounds

### Accessibility Standards
All color combinations meet WCAG 2.1 AA contrast requirements:
- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

### Alpha Transparency Usage
Use HSL with alpha for layered effects:

```css
/* Subtle backgrounds */
background: hsl(var(--primary) / 0.1);   /* 10% opacity */
background: hsl(var(--success) / 0.15);  /* 15% opacity */

/* Borders */
border: 1px solid hsl(var(--border) / 0.2); /* 20% opacity */

/* Overlays */
background: hsl(0 0% 0% / 0.5);          /* 50% black overlay */
```

### Dark Mode Considerations
- Colors maintain their semantic meaning across themes
- Contrast ratios are preserved or improved in dark mode
- Some colors are adjusted (like destructive red) for better dark mode readability
- Surface colors invert appropriately while maintaining hierarchy

## Implementation Examples

### CSS Custom Properties
```css
:root {
  /* Light mode colors */
  --primary: 246 80% 60%;
  --primary-foreground: 210 40% 98%;
  /* ... other colors */
}

.dark {
  /* Dark mode overrides */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other colors */
}
```

### Tailwind CSS Classes
```html
<!-- Primary button -->
<button class="bg-primary text-primary-foreground">
  Primary Action
</button>

<!-- Success alert -->
<div class="bg-success/10 border border-success/20 text-success">
  Success message
</div>

<!-- Card with proper theming -->
<div class="bg-card text-card-foreground border border-border">
  Card content
</div>
```

### Component Styling
```tsx
// React component with proper color usage
const Alert = ({ variant, children }) => {
  const variants = {
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning", 
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    info: "bg-info/10 border-info/20 text-info"
  };
  
  return (
    <div className={`p-4 rounded-md border ${variants[variant]}`}>
      {children}
    </div>
  );
};
```

This color system provides a solid foundation for consistent, accessible, and maintainable theming across the RocketHooks application.