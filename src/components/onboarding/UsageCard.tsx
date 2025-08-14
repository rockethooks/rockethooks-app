import { Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UsageCardProps {
  /** Icon component to display */
  icon: LucideIcon;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** List of benefits/features */
  benefits: string[];
  /** Whether the card is selected */
  isSelected: boolean;
  /** Whether the card is disabled */
  isDisabled?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * UsageCard component for selecting organization usage type
 *
 * Features:
 * - Visual card with icon, title, description, and benefits
 * - Hover effects and selected states
 * - Disabled state support
 * - Accessibility compliant with ARIA attributes
 * - Mobile responsive design
 * - Focus management with keyboard navigation
 */
export function UsageCard({
  icon: Icon,
  title,
  description,
  benefits,
  isSelected,
  isDisabled = false,
  onClick,
  className,
}: UsageCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        // Base styles
        'relative w-full p-6 rounded-lg border-2 transition-all duration-200',
        'text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

        // Default state
        'border-border bg-card text-card-foreground',
        'hover:border-primary/50 hover:bg-accent/50',

        // Selected state
        isSelected && ['border-primary bg-primary/5', 'ring-1 ring-primary/20'],

        // Disabled state
        isDisabled && [
          'opacity-50 cursor-not-allowed',
          'hover:border-border hover:bg-card',
        ],

        className
      )}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-describedby={`${title.toLowerCase().replace(/\s+/g, '-')}-description`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" />
          <span className="sr-only">Selected</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Icon and title */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            <p
              id={`${title.toLowerCase().replace(/\s+/g, '-')}-description`}
              className="text-sm text-muted-foreground mt-1"
            >
              {description}
            </p>
          </div>
        </div>

        {/* Benefits list */}
        {benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              What you get:
            </h4>
            <ul className="space-y-1">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </button>
  );
}
