import { Check, Pencil, User, Users, X } from 'lucide-react';
import { type KeyboardEvent, useCallback, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loggers } from '@/utils';
import { UsageCard } from './UsageCard';

const logger = loggers.onboarding;

export interface OrganizationSetupProps {
  /** Pre-filled organization name */
  defaultName?: string;
  /** Callback when organization setup is submitted */
  onSubmit: (name: string, usageType: 'solo' | 'team') => void;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Optional error message to display */
  error?: string;
  /** Optional className for custom styling */
  className?: string;
}

export type UsageType = 'solo' | 'team';

/**
 * Usage type configuration for the cards
 */
const USAGE_TYPES = {
  solo: {
    title: 'Solo Developer',
    description: 'Perfect for individual projects and personal development',
    benefits: [
      'Personal dashboard and monitoring',
      'Unlimited API endpoints',
      'Real-time webhook testing',
      'Individual usage analytics',
    ],
  },
  team: {
    title: 'Team Collaboration',
    description: 'Built for teams working together on shared projects',
    benefits: [
      'Team dashboard with shared access',
      'Collaborative monitoring and alerts',
      'Team member management',
      'Shared webhook endpoints',
      'Team usage analytics',
    ],
  },
} as const;

/**
 * OrganizationSetup component for setting up organization during onboarding
 *
 * Features:
 * - Displays pre-filled organization name with hover effects
 * - Allows inline editing with keyboard shortcuts
 * - Card-based usage type selection (Solo/Team)
 * - Mobile responsive design
 * - Accessibility compliant with WCAG 2.1 AA
 * - Loading states and error handling
 * - Integration with existing UI components
 */
export function OrganizationSetup({
  defaultName = '',
  onSubmit,
  isLoading = false,
  error,
  className = '',
}: OrganizationSetupProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(defaultName);
  const [selectedUsageType, setSelectedUsageType] = useState<UsageType>('team');

  const handleStartNameEdit = useCallback(() => {
    logger.debug('Starting organization name edit', { currentName: localName });
    setIsEditingName(true);
  }, [localName]);

  const handleCancelNameEdit = useCallback(() => {
    logger.debug('Cancelling organization name edit');
    setLocalName(defaultName);
    setIsEditingName(false);
  }, [defaultName]);

  const handleSaveNameEdit = useCallback(() => {
    const trimmedName = localName.trim();

    if (!trimmedName) {
      logger.warn('Attempted to save empty organization name');
      return;
    }

    logger.debug('Saving organization name edit', { name: trimmedName });
    setIsEditingName(false);
  }, [localName]);

  const handleNameKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSaveNameEdit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelNameEdit();
      }
    },
    [handleSaveNameEdit, handleCancelNameEdit]
  );

  const handleUsageTypeChange = useCallback((usageType: UsageType) => {
    logger.debug('Usage type changed', { usageType });
    setSelectedUsageType(usageType);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedName = localName.trim();

    if (!trimmedName) {
      logger.warn('Cannot submit with empty organization name');
      return;
    }

    logger.info('Submitting organization setup', {
      name: trimmedName,
      usageType: selectedUsageType,
    });

    onSubmit(trimmedName, selectedUsageType);
  }, [localName, selectedUsageType, onSubmit]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Organization Name Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Organization Name
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a name for your workspace that represents your project or
            team.
          </p>
        </div>

        {/* Name Display/Edit */}
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={localName}
              onChange={(e) => {
                setLocalName(e.target.value);
              }}
              onKeyDown={handleNameKeyDown}
              placeholder="Enter organization name"
              className="flex-1"
              autoFocus
              disabled={isLoading}
              aria-label="Organization name"
            />
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveNameEdit}
                disabled={!localName.trim() || isLoading}
                aria-label="Save organization name"
                title="Save (Enter)"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelNameEdit}
                disabled={isLoading}
                aria-label="Cancel editing"
                title="Cancel (Escape)"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="group flex items-center gap-2 text-left p-3 rounded-md transition-colors hover:bg-muted/50 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleStartNameEdit}
            disabled={isLoading}
            aria-label="Click to edit organization name"
          >
            <h4 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {localName || 'Click to add organization name'}
            </h4>
            <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Usage Type Selection Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            How will you use this organization?
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose the option that best describes your intended use case.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <UsageCard
            icon={User}
            title={USAGE_TYPES.solo.title}
            description={USAGE_TYPES.solo.description}
            benefits={[...USAGE_TYPES.solo.benefits]}
            isSelected={selectedUsageType === 'solo'}
            isDisabled={isLoading}
            onClick={() => {
              handleUsageTypeChange('solo');
            }}
          />

          <UsageCard
            icon={Users}
            title={USAGE_TYPES.team.title}
            description={USAGE_TYPES.team.description}
            benefits={[...USAGE_TYPES.team.benefits]}
            isSelected={selectedUsageType === 'team'}
            isDisabled={isLoading}
            onClick={() => {
              handleUsageTypeChange('team');
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {/* Submit Section */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!localName.trim() || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? 'Creating Organization...' : 'Create Organization'}
        </Button>
      </div>
    </div>
  );
}
