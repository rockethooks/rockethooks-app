import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

/**
 * Welcome to the RocketHooks Design System
 * 
 * This Storybook contains the comprehensive component library for RocketHooks,
 * a modern SaaS platform for API monitoring and webhook management.
 * 
 * ## What's Inside
 * 
 * - **Design System** - Colors, typography, spacing, and design tokens
 * - **Core UI Components** - Buttons, inputs, cards, and basic building blocks  
 * - **Layout Components** - Headers, sidebars, and page structures
 * - **Data Display** - Tables, charts, metrics, and status indicators
 * - **Form Components** - Complete form elements with validation states
 * - **RocketHooks Components** - Business-specific components and patterns
 * 
 * ## Design Principles
 * 
 * - **Consistent** - Unified design language across all components
 * - **Accessible** - WCAG 2.1 AA compliant with proper ARIA support
 * - **Responsive** - Mobile-first design that works on all screen sizes
 * - **Performant** - Optimized components with efficient rendering
 * - **Developer-friendly** - TypeScript support with clear prop interfaces
 * 
 * ## Getting Started
 * 
 * Browse the components in the sidebar to see examples, controls, and documentation.
 * Each component includes:
 * 
 * - Interactive examples with different states
 * - Full TypeScript prop documentation
 * - Accessibility guidelines
 * - Usage examples and best practices
 * 
 * ## Component Categories
 * 
 * ### 🎨 Design System
 * Foundation elements including colors, typography, spacing, and design tokens
 * 
 * ### 🧩 Core UI
 * Basic building blocks like buttons, inputs, cards, badges, and alerts
 * 
 * ### 🏗️ Layout
 * Page structures, navigation, headers, sidebars, and containers
 * 
 * ### 📊 Data Display
 * Tables, charts, metrics, status indicators, and data visualization
 * 
 * ### 📝 Forms
 * Form elements, validation states, multi-step forms, and input groups
 * 
 * ### 🚀 RocketHooks
 * Business-specific components for API monitoring, webhooks, and events
 */

const WelcomeComponent = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              color: 'var(--text-inverse)'
            }}
          >
            🚀
          </div>
          <h1 
            className="text-4xl font-bold ml-4"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            RocketHooks Design System
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive component library for building modern, accessible, and performant user interfaces
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div 
          className="p-6 rounded-xl border shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            🎨
          </div>
          <h3 className="text-lg font-semibold mb-2">Design System</h3>
          <p className="text-sm text-gray-600 mb-4">
            Foundation elements including colors, typography, spacing, and design tokens
          </p>
          <ul className="text-sm space-y-1">
            <li>• Color Palette & Semantic Colors</li>
            <li>• Typography Scale & Font Families</li>
            <li>• Spacing System & Layout Grid</li>
            <li>• Shadows, Borders & Effects</li>
          </ul>
        </div>

        <div 
          className="p-6 rounded-xl border shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-4">
            🧩
          </div>
          <h3 className="text-lg font-semibold mb-2">Core UI Components</h3>
          <p className="text-sm text-gray-600 mb-4">
            Essential building blocks for creating user interfaces
          </p>
          <ul className="text-sm space-y-1">
            <li>• Buttons, Inputs & Form Elements</li>
            <li>• Cards, Badges & Status Indicators</li>
            <li>• Alerts, Modals & Tooltips</li>
            <li>• Tables, Lists & Data Display</li>
          </ul>
        </div>

        <div 
          className="p-6 rounded-xl border shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            🏗️
          </div>
          <h3 className="text-lg font-semibold mb-2">Layout Components</h3>
          <p className="text-sm text-gray-600 mb-4">
            Page structures and navigation patterns
          </p>
          <ul className="text-sm space-y-1">
            <li>• Page Headers & Navigation</li>
            <li>• Sidebars & Menu Systems</li>
            <li>• Containers & Grid Layouts</li>
            <li>• Split Panels & Responsive Layouts</li>
          </ul>
        </div>

        <div 
          className="p-6 rounded-xl border shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
            🚀
          </div>
          <h3 className="text-lg font-semibold mb-2">RocketHooks Components</h3>
          <p className="text-sm text-gray-600 mb-4">
            Specialized components for API monitoring and webhook management
          </p>
          <ul className="text-sm space-y-1">
            <li>• API Connection Cards</li>
            <li>• Event Timelines & Status</li>
            <li>• Transformation Editors</li>
            <li>• Real-time Monitoring</li>
          </ul>
        </div>
      </div>

      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: 'var(--surface-secondary)',
          borderColor: 'var(--border-primary)'
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
            <p>Browse components in the sidebar to explore available UI elements</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
            <p>Use the Controls panel to interact with component properties</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
            <p>Check the Docs tab for detailed prop documentation and usage examples</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</span>
            <p>Copy code snippets to use components in your application</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Welcome',
  component: WelcomeComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: null, // Disable the docs page for this story
    },
  },
} satisfies Meta<typeof WelcomeComponent>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Welcome to the RocketHooks Design System - your guide to building consistent,
 * accessible, and beautiful user interfaces.
 */
export const Welcome: Story = {}