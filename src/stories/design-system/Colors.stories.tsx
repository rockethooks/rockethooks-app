import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';

/**
 * Color palette and semantic color system for RocketHooks.
 *
 * Our color system includes brand colors, semantic colors for states,
 * surface colors for backgrounds, and a complete text color hierarchy.
 * All colors support both light and dark themes.
 */

const ColorSwatch: React.FC<{
  name: string;
  cssVar: string;
  description?: string;
  textColor?: string;
}> = ({ name, cssVar, description, textColor = 'var(--text-primary)' }) => (
  <div className="flex flex-col">
    <div
      className="w-20 h-20 rounded-lg border shadow-sm mb-2"
      style={{
        backgroundColor: `var(${cssVar})`,
        borderColor: 'var(--border-primary)',
      }}
    />
    <div className="text-sm">
      <div className="font-medium" style={{ color: textColor }}>
        {name}
      </div>
      <div className="font-mono text-xs text-gray-500">{cssVar}</div>
      {description && (
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      )}
    </div>
  </div>
);

const ColorSection: React.FC<{
  title: string;
  description: string;
  colors: Array<{
    name: string;
    cssVar: string;
    description?: string;
  }>;
}> = ({ title, description, colors }) => (
  <div className="mb-8">
    <h3
      className="text-lg font-semibold mb-2"
      style={{ color: 'var(--text-primary)' }}
    >
      {title}
    </h3>
    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
      {description}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {colors.map((color) => (
        <ColorSwatch key={color.name} {...color} />
      ))}
    </div>
  </div>
);

function ColorsComponent() {
  return (
    <div
      className="max-w-6xl mx-auto p-8 min-h-screen"
      style={{ backgroundColor: 'var(--surface-secondary)' }}
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            background:
              'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Color System
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          RocketHooks uses a systematic approach to color that ensures
          consistency, accessibility, and visual hierarchy across all
          interfaces.
        </p>
      </div>

      <ColorSection
        title="Brand Colors"
        description="Primary brand colors used for key actions, links, and brand elements."
        colors={[
          {
            name: 'Primary',
            cssVar: '--primary',
            description: 'Main brand color',
          },
          {
            name: 'Primary Dark',
            cssVar: '--primary-dark',
            description: 'Hover states',
          },
          {
            name: 'Primary Light',
            cssVar: '--primary-light',
            description: 'Gradients',
          },
        ]}
      />

      <ColorSection
        title="Secondary Colors"
        description="Supporting colors for secondary actions and neutral elements."
        colors={[
          {
            name: 'Secondary',
            cssVar: '--secondary',
            description: 'Neutral actions',
          },
          {
            name: 'Secondary Dark',
            cssVar: '--secondary-dark',
            description: 'Hover states',
          },
          {
            name: 'Secondary Light',
            cssVar: '--secondary-light',
            description: 'Light variant',
          },
        ]}
      />

      <ColorSection
        title="Semantic Colors"
        description="Colors that communicate meaning and state information."
        colors={[
          {
            name: 'Success',
            cssVar: '--success',
            description: 'Positive actions',
          },
          {
            name: 'Success Light',
            cssVar: '--success-light',
            description: 'Backgrounds',
          },
          {
            name: 'Warning',
            cssVar: '--warning',
            description: 'Caution states',
          },
          {
            name: 'Warning Light',
            cssVar: '--warning-light',
            description: 'Backgrounds',
          },
          {
            name: 'Error',
            cssVar: '--error',
            description: 'Error states',
          },
          {
            name: 'Error Light',
            cssVar: '--error-light',
            description: 'Backgrounds',
          },
          {
            name: 'Info',
            cssVar: '--info',
            description: 'Information',
          },
          {
            name: 'Info Light',
            cssVar: '--info-light',
            description: 'Backgrounds',
          },
        ]}
      />

      <ColorSection
        title="Surface Colors"
        description="Background colors for containers, cards, and page surfaces."
        colors={[
          {
            name: 'Primary',
            cssVar: '--surface-primary',
            description: 'Main backgrounds',
          },
          {
            name: 'Secondary',
            cssVar: '--surface-secondary',
            description: 'Page backgrounds',
          },
          {
            name: 'Tertiary',
            cssVar: '--surface-tertiary',
            description: 'Subtle backgrounds',
          },
          {
            name: 'Quaternary',
            cssVar: '--surface-quaternary',
            description: 'Disabled states',
          },
        ]}
      />

      <ColorSection
        title="Text Colors"
        description="Text colors providing proper hierarchy and contrast ratios."
        colors={[
          {
            name: 'Primary',
            cssVar: '--text-primary',
            description: 'Headings, body',
          },
          {
            name: 'Secondary',
            cssVar: '--text-secondary',
            description: 'Subheadings',
          },
          {
            name: 'Tertiary',
            cssVar: '--text-tertiary',
            description: 'Captions',
          },
          {
            name: 'Quaternary',
            cssVar: '--text-quaternary',
            description: 'Placeholders',
          },
          {
            name: 'Inverse',
            cssVar: '--text-inverse',
            description: 'Text on dark',
          },
        ]}
      />

      <ColorSection
        title="Border Colors"
        description="Colors for borders, dividers, and outline elements."
        colors={[
          {
            name: 'Primary',
            cssVar: '--border-primary',
            description: 'Default borders',
          },
          {
            name: 'Secondary',
            cssVar: '--border-secondary',
            description: 'Subtle borders',
          },
          {
            name: 'Focus',
            cssVar: '--border-focus',
            description: 'Focus states',
          },
        ]}
      />

      <div
        className="mt-12 p-6 rounded-xl border"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Usage Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Accessibility
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• All colors meet WCAG 2.1 AA contrast requirements</li>
              <li>• Text colors provide 4.5:1 contrast ratio minimum</li>
              <li>
                • Semantic colors are not the only way meaning is conveyed
              </li>
              <li>• Dark mode variants maintain accessibility standards</li>
            </ul>
          </div>
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Best Practices
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• Use CSS variables for theme consistency</li>
              <li>• Limit custom colors outside the system</li>
              <li>• Test colors in both light and dark themes</li>
              <li>• Use semantic colors for their intended meaning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Design System/Colors',
  component: ColorsComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The RocketHooks color system provides a comprehensive palette of colors that work together
to create consistent, accessible, and beautiful user interfaces. The system includes:

- **Brand Colors**: Primary colors that represent the RocketHooks brand
- **Semantic Colors**: Colors that communicate meaning and state
- **Surface Colors**: Background colors for different levels of content
- **Text Colors**: Hierarchical text colors for proper contrast
- **Border Colors**: Colors for borders, dividers, and outlines

All colors are defined as CSS custom properties and support both light and dark themes.
        `,
      },
    },
  },
} satisfies Meta<typeof ColorsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete color palette showing all available colors in the design system.
 * Use the theme toggle in the toolbar to see how colors adapt to dark mode.
 */
export const ColorPalette: Story = {};
