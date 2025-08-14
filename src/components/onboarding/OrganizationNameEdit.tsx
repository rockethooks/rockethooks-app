import { Check, Pencil, User, Users, X } from 'lucide-react';
import { type KeyboardEvent, useCallback, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loggers } from '@/utils';

const logger = loggers.onboarding;

export interface OrganizationNameEditProps {
  /** Pre-filled organization name */
  defaultName?: string;
  /** Callback when organization name is submitted */
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
 * UsageTypeSelector component for selecting organization usage type
 */
interface UsageTypeSelectorProps {
  selectedUsageType: UsageType;
  onUsageTypeChange: (type: UsageType) => void;
  isLoading?: boolean;
}

function UsageTypeSelector({
  selectedUsageType,
  onUsageTypeChange,
  isLoading = false,
}: UsageTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        How will you use this organization?
      </p>
      <div className="flex gap-2">
        <Button
          variant={selectedUsageType === 'solo' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            onUsageTypeChange('solo');
          }}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Just me
        </Button>
        <Button
          variant={selectedUsageType === 'team' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            onUsageTypeChange('team');
          }}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          With my team
        </Button>
      </div>
    </div>
  );
}

/**
 * OrganizationNameEdit component for inline editing of organization names
 *
 * Features:
 * - Displays pre-filled organization name with hover effects
 * - Allows inline editing with pencil icon
 * - Supports keyboard shortcuts (Enter to save, Escape to cancel)
 * - Handles two usage types: 'solo' and 'team'
 * - Includes error handling and logging
 * - Uses existing UI components from @/components/ui
 */
export function OrganizationNameEdit({
  defaultName = '',
  onSubmit,
  isLoading = false,
  error,
  className = '',
}: OrganizationNameEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(defaultName);
  const [selectedUsageType, setSelectedUsageType] = useState<UsageType>('team');

  const handleStartEdit = useCallback(() => {
    logger.debug('Starting organization name edit', { currentName: localName });
    setIsEditing(true);
  }, [localName]);

  const handleCancelEdit = useCallback(() => {
    logger.debug('Cancelling organization name edit');
    setLocalName(defaultName);
    setIsEditing(false);
  }, [defaultName]);

  const handleSaveEdit = useCallback(() => {
    const trimmedName = localName.trim();

    if (!trimmedName) {
      logger.warn('Attempted to save empty organization name');
      return;
    }

    logger.info('Saving organization name', {
      name: trimmedName,
      usageType: selectedUsageType,
    });

    onSubmit(trimmedName, selectedUsageType);
    setIsEditing(false);
  }, [localName, selectedUsageType, onSubmit]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSaveEdit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const handleUsageTypeChange = useCallback((usageType: UsageType) => {
    logger.debug('Usage type changed', { usageType });
    setSelectedUsageType(usageType);
  }, []);

  if (isEditing) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Editing Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={localName}
              onChange={(e) => {
                setLocalName(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter organization name"
              className="flex-1"
              autoFocus
              disabled={isLoading}
            />
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveEdit}
                disabled={!localName.trim() || isLoading}
                title="Save (Enter)"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isLoading}
                title="Cancel (Escape)"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Usage Type Selection */}
          <UsageTypeSelector
            selectedUsageType={selectedUsageType}
            onUsageTypeChange={handleUsageTypeChange}
            isLoading={isLoading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <p className="text-sm">{error}</p>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Display Mode */}
      <div className="group">
        <button
          type="button"
          className="flex items-center gap-2 text-left p-2 rounded-md transition-colors hover:bg-muted/50 w-full"
          onClick={handleStartEdit}
          aria-label="Click to edit organization name"
        >
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {localName || 'Click to add organization name'}
          </h2>
          <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Usage Type Selection in Display Mode */}
      <UsageTypeSelector
        selectedUsageType={selectedUsageType}
        onUsageTypeChange={handleUsageTypeChange}
        isLoading={isLoading}
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}
    </div>
  );
}
