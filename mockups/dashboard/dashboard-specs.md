# Dashboard & Analytics Design Specifications

## Overview
This document outlines the design system and specifications for RocketHooks dashboard and analytics components, focusing on data visualization, responsive layouts, and user experience patterns.

## Color System

### Primary Colors
- **Primary Indigo**: `hsl(246 80% 60%)` (#6366f1)
- **Primary Light**: `hsl(246 80% 95%)` (backgrounds)
- **Primary Dark**: `hsl(246 80% 40%)` (emphasis)

### Status Colors
- **Success**: `#16a34a` (green-600)
- **Warning**: `#d97706` (amber-600)
- **Error**: `#dc2626` (red-600)
- **Info**: Primary Indigo

### Neutral Colors
- **Background**: `#f8fafc` (slate-50)
- **Card Background**: `#ffffff` (white)
- **Text Primary**: `#0f172a` (slate-900)
- **Text Secondary**: `#64748b` (slate-500)
- **Border**: `#e2e8f0` (slate-200)

## Typography

### Font Family
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Monospace: `'SF Mono', 'Monaco', monospace` (for metrics, timestamps)

### Font Sizes
- **Dashboard Title**: `2rem` (32px) - `font-weight: 700`
- **Section Title**: `1.25rem` (20px) - `font-weight: 600`
- **Metric Value**: `1.5rem-2.5rem` - `font-weight: 700`
- **Body Text**: `0.875rem` (14px)
- **Small Text**: `0.75rem` (12px)

## Layout Patterns

### Grid Systems
```css
/* Main Dashboard Layout */
.dashboard-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

/* Metrics Grid */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

/* Analytics Layout */
.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}
```

### Responsive Breakpoints
- **Desktop**: `1200px+` - Full grid layouts
- **Tablet**: `768px-1199px` - Stacked layouts
- **Mobile**: `<768px` - Single column

## Component Specifications

### Metric Cards
```css
.metric-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f5f9;
    transition: all 0.2s;
}

.metric-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}
```

**Structure:**
- Header with title and icon
- Large metric value (2rem, bold)
- Trend indicator with color coding
- Optional sparkline or mini-chart

### Chart Containers
```css
.chart-container {
    height: 300px;
    position: relative;
    background: #f8fafc;
    border-radius: 0.5rem;
    overflow: hidden;
}
```

**Requirements:**
- Minimum height: 250px
- Responsive aspect ratios
- Grid background for reference
- Loading states and empty states

### Status Indicators
```css
.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.status-success { background: #16a34a; }
.status-warning { background: #d97706; }
.status-error { background: #dc2626; }
```

## Data Visualization Guidelines

### Chart Types and Usage

#### Line Charts
- **Use for**: Time series data, trends over time
- **Colors**: Primary indigo with opacity variations
- **Animation**: Smooth transitions, 0.3s ease-out
- **Grid**: Subtle grid lines (#e2e8f0, 30% opacity)

#### Bar Charts
- **Use for**: Categorical data, comparisons
- **Colors**: Gradient from light to dark primary
- **Spacing**: 8px gaps between bars
- **Height**: Variable based on data range

#### Donut Charts
- **Use for**: Proportional data, status distribution
- **Colors**: Status colors (success, warning, error)
- **Stroke Width**: 20px for clarity
- **Center**: Display primary metric

#### Heatmaps
- **Use for**: Time-based patterns, intensity data
- **Colors**: Primary color with opacity levels
- **Cell Size**: Square aspect ratio
- **Spacing**: 2px gaps between cells

### Chart Color Coding

#### Single Series
- Primary: `hsl(246 80% 60%)`
- Light: `hsl(246 80% 80%)`
- Dark: `hsl(246 80% 40%)`

#### Multiple Series
1. Primary: `hsl(246 80% 60%)`
2. Success: `#16a34a`
3. Warning: `#d97706`
4. Error: `#dc2626`
5. Info: `#2563eb`

#### Opacity Levels
- Background: 0.1
- Hover: 0.3
- Active: 0.6
- Default: 0.8

## Interactive Elements

### Buttons
```css
.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: hsl(246 80% 60%);
    color: white;
}

.btn-primary:hover {
    background: hsl(246 80% 55%);
}
```

### Time Selectors
```css
.time-selector {
    display: flex;
    gap: 0.25rem;
    background: white;
    border-radius: 0.5rem;
    padding: 0.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.time-option.active {
    background: hsl(246 80% 60%);
    color: white;
}
```

### Filter Tags
```css
.filter-tag {
    padding: 0.25rem 0.75rem;
    background: #334155;
    border-radius: 1rem;
    font-size: 0.75rem;
    transition: all 0.2s;
}

.filter-tag.active {
    background: hsl(246 80% 60%);
    color: white;
}
```

## Performance Indicators

### Loading States
- Skeleton screens for charts
- Shimmer animations (2s pulse)
- Progress indicators for long operations

### Real-time Updates
- Pulse animations for live data
- Color transitions for status changes
- Smooth value transitions (0.3s ease)

### Error States
- Clear error messages
- Retry mechanisms
- Fallback visualizations

## Accessibility Guidelines

### Color Contrast
- Text on white: 4.5:1 minimum ratio
- Interactive elements: 3:1 minimum
- Status indicators: Don't rely on color alone

### Keyboard Navigation
- Tab order: logical flow
- Focus indicators: visible outlines
- Escape key: close modals/dropdowns

### Screen Readers
- ARIA labels for charts
- Data tables for complex visualizations
- Status announcements for updates

## Mobile Optimizations

### Layout Adaptations
```css
@media (max-width: 768px) {
    .dashboard-content {
        grid-template-columns: 1fr;
    }
    
    .metrics-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    .chart-container {
        height: 250px;
    }
}
```

### Touch Interactions
- Minimum tap target: 44px
- Swipe gestures for navigation
- Pinch-to-zoom for detailed charts

### Performance
- Lazy loading for off-screen charts
- Reduced animation complexity
- Optimized image formats

## Implementation Notes

### CSS Variables
```css
:root {
    --primary: hsl(246 80% 60%);
    --success: #16a34a;
    --warning: #d97706;
    --error: #dc2626;
    --background: #f8fafc;
    --card-bg: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border: #e2e8f0;
}
```

### Animation Timing
- **Micro-interactions**: 0.2s ease
- **Chart transitions**: 0.3s ease-out
- **Loading states**: 2s infinite
- **Hover effects**: 0.15s ease

### Z-Index Scale
- Tooltips: 1000
- Modals: 2000
- Loading overlays: 3000
- Notifications: 4000

## Future Considerations

### Dark Mode Support
- CSS custom properties for theming
- Automatic system preference detection
- User preference persistence

### Advanced Charts
- Interactive drill-down capabilities
- Real-time streaming data
- Custom visualization plugins

### Performance Monitoring
- Chart rendering performance
- Data loading optimization
- Memory usage monitoring

## Testing Guidelines

### Visual Testing
- Screenshot comparison tests
- Cross-browser compatibility
- Responsive design validation

### Interaction Testing
- Hover states and animations
- Keyboard navigation flows
- Touch gesture recognition

### Data Testing
- Empty state handling
- Large dataset performance
- Real-time update accuracy

---

*This specification serves as the foundation for implementing consistent, accessible, and performant dashboard components across the RocketHooks platform.*