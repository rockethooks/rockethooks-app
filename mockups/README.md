# RocketHooks Design System & Mockups

## 📁 Directory Structure

```
mockups/
├── design-system/          # Core design system foundation
├── authentication/         # Auth & onboarding flows
├── dashboard/             # Dashboard & analytics
├── settings/              # Settings & profile management
└── api-webhooks/          # API & webhook management
```

## 🎨 Design System (`design-system/`)

### Foundation Files
- `colors.md` - Complete color palette with HSL values
- `typography.md` - Font scales and text specifications
- `spacing-layout.md` - Grid, spacing, and responsive layouts
- `component-tokens.md` - Borders, shadows, animations
- `design-principles.md` - Core principles and accessibility
- `visual-examples.html` - **Interactive showcase of entire system**

## 🔐 Authentication (`authentication/`)

### User Flow Mockups
- `login.html` - Login page with OAuth
- `signup.html` - Registration with validation
- `onboarding.html` - 4-step onboarding flow
- `password-reset.html` - Password recovery flow
- `email-verification.html` - Email verification states
- `auth-onboarding-specs.md` - Complete specifications

## 📊 Dashboard (`dashboard/`)

### Analytics & Monitoring
- `dashboard.html` - Main dashboard overview
- `analytics.html` - Detailed analytics view
- `realtime-monitor.html` - Live monitoring interface
- `reports.html` - Report generation
- `metrics-detail.html` - Deep metric analysis
- `dashboard-specs.md` - Dashboard design guidelines

## ⚙️ Settings (`settings/`)

### User & Organization Management
- `profile.html` - User profile page
- `account-settings.html` - Account preferences
- `organization-settings.html` - Organization management
- `notification-settings.html` - Alert preferences
- `api-keys.html` - API key management
- `integrations.html` - Third-party integrations
- `settings-specs.md` - Settings UI patterns

## 🔧 API & Webhooks (`api-webhooks/`)

### Technical Interfaces
- `api-endpoints.html` - API endpoints list
- `api-detail.html` - Endpoint configuration
- `webhook-config.html` - Webhook setup
- `events.html` - Event management
- `testing.html` - API testing console
- `monitoring-rules.html` - Alert rules
- `api-webhook-specs.md` - Technical UI guidelines

## 🚀 Quick Start

### View the Design System
```bash
open mockups/design-system/visual-examples.html
```

### Browse All Mockups
Each HTML file is self-contained and can be opened directly in your browser:

```bash
# View login flow
open mockups/authentication/login.html

# View main dashboard
open mockups/dashboard/dashboard.html

# View API testing console
open mockups/api-webhooks/testing.html
```

## 🎯 Key Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Available in design system
- **Interactive Elements** - Working forms and animations
- **Accessibility** - WCAG 2.1 AA compliant
- **Brand Consistency** - Indigo Blue theme throughout
- **Self-Contained** - No external dependencies

## 🛠 Technology Stack

- **Framework**: React + TypeScript + Vite
- **UI Library**: ShadCN/UI + Radix UI
- **Styling**: Tailwind CSS
- **Colors**: HSL-based color system
- **Font**: Inter family

## 📝 Implementation Notes

1. All mockups use inline CSS for portability
2. JavaScript included for interactive demonstrations
3. Design tokens match existing `tailwind.config.ts`
4. Color values align with `src/index.css`
5. Component patterns follow ShadCN/UI conventions

## 🔗 Integration Guide

To implement these designs in the actual application:

1. **Colors**: Use HSL values from `design-system/colors.md`
2. **Typography**: Apply scales from `design-system/typography.md`
3. **Spacing**: Follow grid from `design-system/spacing-layout.md`
4. **Components**: Reference patterns in respective HTML files
5. **Interactions**: Use JavaScript examples as behavior guides

---

Created by 5 parallel UX/UI Engineer agents for RocketHooks webapp redesign.