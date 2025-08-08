# API & Webhook Management UI Specifications

## Overview
This document outlines the technical UI patterns, components, and design specifications used in RocketHooks' API and webhook management interfaces.

## Color System

### Primary Colors
- **Primary Indigo**: `hsl(246 80% 60%)` - Main brand color for actions and highlights
- **Primary Indigo Hover**: `hsl(246 80% 55%)` - Hover states
- **Primary Indigo Light**: `hsl(246 80% 95%)` - Background tints

### Status Colors
- **Success Green**: `#22c55e` - Successful operations, healthy status
- **Warning Orange**: `#f59e0b` - Warnings, slow responses
- **Error Red**: `#ef4444` - Errors, failures, critical alerts
- **Info Blue**: `#3b82f6` - Information, retrying states

### Neutral Colors
- **Text Primary**: `#1e293b` - Main text content
- **Text Secondary**: `#64748b` - Secondary text, labels
- **Background**: `#f8fafc` - Page background
- **Card Background**: `#ffffff` - Card and panel backgrounds
- **Border**: `#e2e8f0` - Borders and dividers

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Code Font Stack
```css
font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

### Typography Scale
- **Page Title**: `2rem` (32px), `font-weight: 700`
- **Section Title**: `1.5rem` (24px), `font-weight: 600`
- **Card Title**: `1.25rem` (20px), `font-weight: 600`
- **Body Text**: `1rem` (16px), `font-weight: 400`
- **Small Text**: `0.875rem` (14px), `font-weight: 400`
- **Micro Text**: `0.75rem` (12px), `font-weight: 500`

## Component Patterns

### HTTP Method Badges
Visual indicators for different HTTP methods with consistent color coding:

```css
.endpoint-method {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.method-get { background: #dcfce7; color: #166534; }
.method-post { background: #dbeafe; color: #1d4ed8; }
.method-put { background: #fef3c7; color: #d97706; }
.method-delete { background: #fee2e2; color: #dc2626; }
```

### Status Indicators
Consistent status visualization across all interfaces:

```css
.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-healthy { background: #dcfce7; color: #166534; }
.status-warning { background: #fef3c7; color: #d97706; }
.status-error { background: #fee2e2; color: #dc2626; }
```

### Code Syntax Highlighting
JSON and code blocks with consistent syntax coloring:

```css
.code-block, .json-viewer {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 0.5rem;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
}

.json-key { color: #60a5fa; }     /* Blue for keys */
.json-string { color: #34d399; }  /* Green for strings */
.json-number { color: #fbbf24; }  /* Yellow for numbers */
.json-boolean { color: #f87171; } /* Red for booleans */
```

### Interactive Toggle Switches
Modern toggle switches for enable/disable states:

```css
.toggle input {
    width: 44px;
    height: 24px;
    appearance: none;
    background: #e2e8f0;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
}

.toggle input:checked {
    background: hsl(246 80% 60%);
}

.toggle input::before {
    content: '';
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle input:checked::before {
    left: 22px;
}
```

## Layout Patterns

### Grid-Based Cards
Responsive card layouts using CSS Grid:

```css
.endpoints-grid {
    display: grid;
    gap: 1rem;
}

.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}
```

### Two-Column Layouts
Main content with sidebar pattern:

```css
.content-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
}

@media (max-width: 768px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}
```

### Tab Navigation
Consistent tab interface across components:

```css
.tabs {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1.5rem;
}

.tab {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: #64748b;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.tab.active {
    color: hsl(246 80% 60%);
    border-bottom-color: hsl(246 80% 60%);
}
```

## Interactive Elements

### Button Variants
Consistent button styling across all interfaces:

```css
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.btn-primary {
    background: hsl(246 80% 60%);
    color: white;
}

.btn-secondary {
    background: white;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}
```

### Modal Windows
Consistent modal implementation:

```css
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    padding: 2rem;
}

.modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 0.75rem;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    width: 100%;
}
```

## Form Elements

### Input Styling
Consistent form input appearance:

```css
.input, .textarea, .select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    transition: border-color 0.2s;
}

.input:focus, .textarea:focus {
    outline: none;
    border-color: hsl(246 80% 60%);
    box-shadow: 0 0 0 3px hsl(246 80% 60% / 0.1);
}
```

### Key-Value Pair Editor
Pattern for editing headers, parameters, etc:

```css
.key-value-pair {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.remove-btn {
    padding: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.75rem;
}
```

## Data Visualization

### Metrics Display
Consistent metric presentation:

```css
.metric {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.metric-label {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
}
```

### Event Log Display
Structured event and log display:

```css
.event-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    align-items: center;
    transition: background 0.2s;
}

.event-item:hover {
    background: #f8fafc;
}
```

## Responsive Design

### Breakpoints
- **Mobile**: `max-width: 768px`
- **Tablet**: `769px - 1024px`
- **Desktop**: `1025px+`

### Mobile Adaptations
```css
@media (max-width: 768px) {
    .container { padding: 1rem; }
    .content-grid { grid-template-columns: 1fr; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .event-item { 
        grid-template-columns: 1fr; 
        gap: 0.5rem; 
    }
}
```

## Accessibility Features

### Focus Management
All interactive elements have visible focus states:

```css
.btn:focus, .input:focus, .tab:focus {
    outline: none;
    box-shadow: 0 0 0 3px hsl(246 80% 60% / 0.1);
}
```

### Screen Reader Support
- Semantic HTML elements (`<main>`, `<nav>`, `<section>`)
- ARIA labels for complex interactions
- Proper heading hierarchy
- Alt text for status indicators

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space activation for buttons
- Escape to close modals
- Arrow keys for tab navigation

## Error Handling Patterns

### Inline Validation
Form validation with clear error messaging:

```css
.form-group.error .input {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
```

### Empty States
Consistent empty state messaging:

```css
.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
}

.empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}
```

## Performance Considerations

### Code Editor Integration
- Syntax highlighting using lightweight libraries
- Virtual scrolling for large response bodies
- Debounced input for real-time validation

### Efficient Animations
```css
.transition-element {
    transition: all 0.2s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
    .transition-element {
        transition: none;
    }
}
```

## Security Patterns

### Secure Input Display
- Masked password fields
- Truncated API keys with show/hide toggle
- XSS protection in user-generated content

### Safe External Links
```html
<a href="external-link" target="_blank" rel="noopener noreferrer">
    External Documentation
</a>
```

This specification ensures consistent, accessible, and maintainable UI patterns across all RocketHooks API and webhook management interfaces.