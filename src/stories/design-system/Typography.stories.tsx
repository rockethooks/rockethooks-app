import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';

/**
 * Typography system for RocketHooks including font families, sizes,
 * weights, and line heights. Built with Inter for UI text and JetBrains Mono
 * for code and technical content.
 */

const TypeSample: React.FC<{
  title: string;
  description: string;
  cssClass?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ title, description, cssClass, style, children }) => (
  <div className="mb-6">
    <div className="mb-2">
      <span
        className="font-medium text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </span>
      <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>
        {description}
      </span>
    </div>
    <div className={cssClass} style={style}>
      {children}
    </div>
  </div>
);

function TypographyComponent() {
  return (
    <div
      className="max-w-4xl mx-auto p-8 min-h-screen"
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
          Typography System
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          A consistent typographic system using Inter for interface text and
          JetBrains Mono for code and technical content.
        </p>
      </div>

      {/* Font Families */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Font Families
        </h2>

        <TypeSample
          title="Sans Serif - Inter"
          description="Primary font for interface text"
          style={{
            fontFamily: 'var(--font-family-sans)',
            fontSize: 'var(--text-lg)',
            color: 'var(--text-primary)',
          }}
        >
          The quick brown fox jumps over the lazy dog. Inter provides excellent
          readability and works well across different sizes and weights.
        </TypeSample>

        <TypeSample
          title="Monospace - JetBrains Mono"
          description="Font for code, technical content, and data"
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--surface-primary)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {`const webhook = {
  url: "https://api.example.com/webhook",
  method: "POST",
  status: "active"
}`}
        </TypeSample>
      </div>

      {/* Font Sizes */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Font Sizes
        </h2>

        <TypeSample
          title="Extra Small (12px)"
          description="--text-xs"
          style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}
        >
          Used for captions, badges, and fine print
        </TypeSample>

        <TypeSample
          title="Small (14px)"
          description="--text-sm"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
        >
          Used for body text in compact layouts and secondary content
        </TypeSample>

        <TypeSample
          title="Base (16px)"
          description="--text-base"
          style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}
        >
          The default body text size for most content and interfaces
        </TypeSample>

        <TypeSample
          title="Large (18px)"
          description="--text-lg"
          style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}
        >
          Used for large body text and prominent content
        </TypeSample>

        <TypeSample
          title="Extra Large (20px)"
          description="--text-xl"
          style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}
        >
          Used for small headings and important labels
        </TypeSample>

        <TypeSample
          title="2X Large (24px)"
          description="--text-2xl"
          style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}
        >
          Used for section headings and card titles
        </TypeSample>

        <TypeSample
          title="3X Large (30px)"
          description="--text-3xl"
          style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)' }}
        >
          Used for page headings and important titles
        </TypeSample>

        <TypeSample
          title="4X Large (36px)"
          description="--text-4xl"
          style={{ fontSize: 'var(--text-4xl)', color: 'var(--text-primary)' }}
        >
          Used for hero headings and display text
        </TypeSample>

        <TypeSample
          title="5X Large (48px)"
          description="--text-5xl"
          style={{ fontSize: 'var(--text-5xl)', color: 'var(--text-primary)' }}
        >
          Used for large display headings and marketing content
        </TypeSample>
      </div>

      {/* Font Weights */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Font Weights
        </h2>

        <TypeSample
          title="Normal (400)"
          description="--font-normal"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-normal)',
            color: 'var(--text-primary)',
          }}
        >
          Normal weight for body text and default content
        </TypeSample>

        <TypeSample
          title="Medium (500)"
          description="--font-medium"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-primary)',
          }}
        >
          Medium weight for emphasized text and labels
        </TypeSample>

        <TypeSample
          title="Semibold (600)"
          description="--font-semibold"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
          }}
        >
          Semibold weight for headings and important content
        </TypeSample>

        <TypeSample
          title="Bold (700)"
          description="--font-bold"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
          }}
        >
          Bold weight for strong emphasis and display headings
        </TypeSample>
      </div>

      {/* Text Colors */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Text Color Hierarchy
        </h2>

        <TypeSample
          title="Primary Text"
          description="--text-primary"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
          }}
        >
          Used for headings, body text, and primary content
        </TypeSample>

        <TypeSample
          title="Secondary Text"
          description="--text-secondary"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
          }}
        >
          Used for subheadings and secondary information
        </TypeSample>

        <TypeSample
          title="Tertiary Text"
          description="--text-tertiary"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-tertiary)',
          }}
        >
          Used for captions, metadata, and supporting text
        </TypeSample>

        <TypeSample
          title="Quaternary Text"
          description="--text-quaternary"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-quaternary)',
          }}
        >
          Used for placeholders and disabled text
        </TypeSample>

        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <TypeSample
            title="Inverse Text"
            description="--text-inverse"
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-inverse)',
            }}
          >
            Used for text on dark backgrounds and primary buttons
          </TypeSample>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Common Patterns
        </h2>

        <div
          className="p-6 rounded-xl border mb-6"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--text-primary)',
            }}
          >
            Card Heading
          </h3>
          <p
            className="mb-3"
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-normal)',
            }}
          >
            Body text with proper line height for readability. This demonstrates
            the typical content hierarchy used in cards.
          </p>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--font-medium)',
            }}
          >
            Metadata • Last updated 5 minutes ago
          </p>
        </div>

        <div
          className="font-mono p-4 rounded-lg border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-primary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <div style={{ color: 'var(--text-tertiary)' }}>
            {'/* CSS Usage Examples */'}
          </div>
          <div style={{ color: 'var(--text-primary)' }}>.heading {'{'}</div>
          <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
            font-size: var(--text-2xl);
          </div>
          <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
            font-weight: var(--font-semibold);
          </div>
          <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>
            color: var(--text-primary);
          </div>
          <div style={{ color: 'var(--text-primary)' }}>{'}'}</div>
        </div>
      </div>

      {/* Guidelines */}
      <div
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Typography Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Hierarchy
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• Establish clear information hierarchy</li>
              <li>• Use consistent heading levels (h1, h2, h3)</li>
              <li>• Limit font sizes to avoid visual chaos</li>
              <li>• Use font weight to create emphasis</li>
            </ul>
          </div>
          <div>
            <h4
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Readability
            </h4>
            <ul
              className="space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• Use appropriate line heights (1.4-1.6)</li>
              <li>• Ensure sufficient contrast ratios</li>
              <li>• Limit line length to 45-75 characters</li>
              <li>• Test with different font sizes and zoom levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Design System/Typography',
  component: TypographyComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The RocketHooks typography system provides consistent text styling across all interfaces.
It includes:

- **Font Families**: Inter for UI text, JetBrains Mono for code
- **Font Sizes**: Scaled from 12px to 48px using CSS custom properties
- **Font Weights**: Four weights from normal (400) to bold (700)
- **Text Colors**: Hierarchical system for proper contrast and readability
- **Line Heights**: Optimized for different text sizes and use cases

The system uses CSS custom properties for easy theming and consistency.
        `,
      },
    },
  },
} satisfies Meta<typeof TypographyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete typography system showing font families, sizes, weights, and text colors.
 * All typography uses CSS custom properties for consistent theming.
 */
export const TypographySystem: Story = {};
