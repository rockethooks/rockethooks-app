# Issue #70: Usage Type Selector Implementation Plan

## Overview
GitHub Issue #70 involves creating a card-based component for users to select between Solo Developer and Team usage during onboarding.

## Key Decision: Option 2 - Create New Components
- Build fresh `OrganizationSetup` and `UsageCard` components
- Delete existing `OrganizationNameEdit` component (only used in OnboardingFlow.tsx)
- Clean implementation matching exact design specifications

## Component Structure
```
OrganizationSetup.tsx (NEW - Main container)
├── Organization name section (Faker.js generation)
├── UsageCard.tsx (NEW - Solo Developer card)
└── UsageCard.tsx (NEW - Team card)
```

## Technical Stack
- UI: React 19 + TypeScript + Tailwind CSS v4
- Styling variants: class-variance-authority (CVA)
- Name generation: @faker-js/faker (new) + tldts (existing)
- GraphQL: Apollo Client with CREATE_ORGANIZATION_WITH_EXAMPLES mutation
- Icons: Lucide React
- Notifications: Sonner

## Implementation Files
- `/docs/implementation-plan-issue-70.md` - Developer implementation guide
- `/docs/technical-spec-usage-type-selector.md` - Detailed technical specification

## Context from PR #78
- Basic usage type selection already exists (button-based)
- Organization name generator using tldts implemented
- Needs transformation from buttons to elegant cards
- Missing GraphQL mutation and Faker.js enhancement

## Future Enhancement
- Issue #79 created for Framer Motion animations (premium UI interactions)

## Migration Impact
- Only ONE file needs updating: `OnboardingFlow.tsx`
- Direct replacement, no deprecation needed
- Clean cut with zero technical debt

## Estimated Time: 4-6 hours