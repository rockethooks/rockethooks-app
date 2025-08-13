import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

export interface JSONPathBuilderProps {
  value: string;
  onChange: (path: string) => void;
  sampleData?: object;
  onTest?: () => void;
  className?: string;
}

const commonPatterns = [
  {
    label: 'Root property',
    pattern: '$.property',
    description: 'Access a top-level property',
  },
  {
    label: 'Array item',
    pattern: '$.items[0]',
    description: 'Access first item in array',
  },
  {
    label: 'All array items',
    pattern: '$.items[*]',
    description: 'Access all items in array',
  },
  {
    label: 'Nested property',
    pattern: '$.user.profile.name',
    description: 'Access nested property',
  },
  {
    label: 'Filter by value',
    pattern: '$.items[?(@.status == "active")]',
    description: 'Filter items by status',
  },
  {
    label: 'Array length',
    pattern: '$.items.length',
    description: 'Get array length',
  },
];

/**
 * JSONPathBuilder - visual interface for building JSONPath expressions
 *
 * @example
 * ```tsx
 * <JSONPathBuilder
 *   value="$.user.profile.name"
 *   onChange={(path) => setSelectedPath(path)}
 *   sampleData={{ user: { profile: { name: 'John' } } }}
 *   onTest={() => testJSONPath()}
 * />
 * ```
 */
function JSONPathBuilder({
  value,
  onChange,
  sampleData,
  onTest,
  className,
}: JSONPathBuilderProps) {
  const [isValid, setIsValid] = useState(true);
  const [testResult, setTestResult] = useState<string | object | null>(null);
  const [showSampleData, setShowSampleData] = useState(false);

  // Basic JSONPath validation
  useEffect(() => {
    try {
      // Basic validation - check for valid JSONPath syntax
      const isValidPath =
        /^\$(\.[a-zA-Z_][a-zA-Z0-9_]*|\[\d+\]|\[\*\]|\[.*?\])*$/.test(value) ||
        value === '$' ||
        /^\$(\.[a-zA-Z_][a-zA-Z0-9_]*|\[\?.*?\]|\[.*?\])*/.test(value);
      setIsValid(isValidPath);
    } catch {
      setIsValid(false);
    }
  }, [value]);

  const handlePatternSelect = (pattern: string) => {
    onChange(pattern);
  };

  const handleTest = () => {
    if (!sampleData || !isValid) return;

    try {
      // Simple JSONPath evaluation for demo purposes
      // In a real implementation, you'd use a proper JSONPath library like jsonpath-plus
      const result = evaluateSimpleJSONPath(sampleData, value);
      setTestResult(result as string | object | null);
      onTest?.();
    } catch (error) {
      setTestResult(
        `Error: ${error instanceof Error ? error.message : 'Invalid path'}`
      );
    }
  };

  // Simplified JSONPath evaluator for demo purposes
  const evaluateSimpleJSONPath = (data: unknown, path: string): unknown => {
    if (path === '$') return data;

    const parts = path.slice(2).split('.'); // Remove '$.' prefix
    let current = data;

    for (const part of parts) {
      if (!part) continue;

      if (part.includes('[') && part.includes(']')) {
        const bracketIndex = part.indexOf('[');
        const prop = part.substring(0, bracketIndex);
        const bracket = part.substring(bracketIndex + 1, part.length - 1);

        if (prop && typeof current === 'object' && current !== null) {
          current = (current as Record<string, unknown>)[prop];
        }

        if (bracket === '*') {
          return Array.isArray(current) ? current : [];
        } else if (!Number.isNaN(Number(bracket))) {
          if (Array.isArray(current)) {
            current = current[Number(bracket)];
          }
        }
      } else {
        if (typeof current === 'object' && current !== null) {
          current = (current as Record<string, unknown>)[part];
        }
      }

      if (current === undefined) break;
    }

    return current;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Path Input */}
      <div className="space-y-2">
        <Label htmlFor="jsonpath-input">JSONPath Expression</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              id="jsonpath-input"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              placeholder="$.property"
              className={cn(
                'font-mono',
                !isValid && 'border-destructive focus:border-destructive'
              )}
            />
            {!isValid && (
              <Badge
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2"
              >
                Invalid
              </Badge>
            )}
          </div>
          {sampleData && (
            <Button variant="outline" onClick={handleTest} disabled={!isValid}>
              Test
            </Button>
          )}
        </div>
      </div>

      {/* Common Patterns */}
      <div className="space-y-2">
        <Label>Common Patterns</Label>
        <Select onValueChange={handlePatternSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a pattern..." />
          </SelectTrigger>
          <SelectContent>
            {commonPatterns.map((pattern) => (
              <SelectItem key={pattern.pattern} value={pattern.pattern}>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{pattern.label}</div>
                  <code className="text-xs text-muted-foreground">
                    {pattern.pattern}
                  </code>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Test Result */}
      {testResult !== null && (
        <div className="space-y-2">
          <Label>Test Result</Label>
          <Textarea
            value={
              typeof testResult === 'string'
                ? testResult
                : JSON.stringify(testResult, null, 2)
            }
            readOnly
            className="font-mono text-sm min-h-[100px] resize-none"
            placeholder="Test your JSONPath expression to see results here"
          />
        </div>
      )}

      {/* Sample Data Viewer */}
      {sampleData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sample Data</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSampleData(!showSampleData);
              }}
            >
              {showSampleData ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showSampleData && (
            <Textarea
              value={JSON.stringify(sampleData, null, 2)}
              readOnly
              className="font-mono text-sm min-h-[150px] resize-none bg-muted/50"
            />
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">JSONPath Syntax:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>
            <code>$</code> - Root object
          </li>
          <li>
            <code>.property</code> - Object property
          </li>
          <li>
            <code>[0]</code> - Array index
          </li>
          <li>
            <code>[*]</code> - All array elements
          </li>
          <li>
            <code>[?(@.key == &quot;value&quot;)]</code> - Filter expression
          </li>
        </ul>
      </div>
    </div>
  );
}

export { JSONPathBuilder };
