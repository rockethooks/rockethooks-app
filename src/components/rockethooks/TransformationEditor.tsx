import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'

export interface TransformationEditorProps {
  mode: 'visual' | 'code'
  value: string
  onChange: (value: string) => void
  inputSchema?: object
  outputPreview?: object
  className?: string
}

/**
 * TransformationEditor - dual-mode editor for webhook payload transformations
 *
 * @example
 * ```tsx
 * <TransformationEditor
 *   mode="visual"
 *   value="{ user: $.data.user.name, timestamp: $.timestamp }"
 *   onChange={(value) => setTransformation(value)}
 *   inputSchema={{ data: { user: { name: 'string' } }, timestamp: 'number' }}
 *   outputPreview={{ user: 'John Doe', timestamp: 1634567890 }}
 * />
 * ```
 */
function TransformationEditor({
  mode: initialMode = 'visual',
  value,
  onChange,
  inputSchema,
  outputPreview,
  className,
}: TransformationEditorProps) {
  const [currentMode, setCurrentMode] = useState<'visual' | 'code'>(initialMode)
  const [isValid, setIsValid] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Validate JSON syntax
  useEffect(() => {
    if (currentMode === 'code' && value.trim()) {
      try {
        JSON.parse(value)
        setIsValid(true)
        setValidationError(null)
      } catch (error) {
        setIsValid(false)
        setValidationError(
          error instanceof Error ? error.message : 'Invalid JSON syntax'
        )
      }
    } else {
      setIsValid(true)
      setValidationError(null)
    }
  }, [value, currentMode])

  const handleModeChange = (newMode: 'visual' | 'code') => {
    setCurrentMode(newMode)

    // Convert between modes if needed
    if (newMode === 'code' && currentMode === 'visual') {
      // In a real implementation, convert visual rules to code
      // For now, we'll just ensure proper JSON format
      try {
        if (value && !value.startsWith('{')) {
          onChange(`{\n  ${value}\n}`)
        }
      } catch {
        // Keep existing value if conversion fails
      }
    }
  }

  const formatCode = () => {
    try {
      const parsed = JSON.parse(value) as unknown
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
    } catch {
      // Do nothing if JSON is invalid
    }
  }

  const sampleTransformations = [
    {
      name: 'Basic Field Mapping',
      transformation:
        '{\n  "user_name": "$.data.user.name",\n  "created_at": "$.timestamp",\n  "status": "active"\n}',
    },
    {
      name: 'Array Transformation',
      transformation:
        '{\n  "items": "$.data.items[*].{id: id, name: name}",\n  "total": "$.data.items.length"\n}',
    },
    {
      name: 'Conditional Mapping',
      transformation:
        '{\n  "user_type": "$.data.user.role == \'admin\' ? \'administrator\' : \'user\'",\n  "permissions": "$.data.user.permissions[*]"\n}',
    },
  ]

  const placeholderText = `{
  // Define your transformation rules here
  "output_field": "$.input.field",
  "computed_field": "$.data.value * 2"
}`

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Transformation Rules</Label>
        <div className="flex items-center gap-2">
          {!isValid && (
            <Badge variant="destructive" size="sm">
              Syntax Error
            </Badge>
          )}
          <Tabs
            value={currentMode}
            onValueChange={(value) => {
              handleModeChange(value as 'visual' | 'code')
            }}
          >
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="visual" className="text-xs">
                Visual
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Error Display */}
      {validationError && (
        <Alert className="border-destructive">
          <AlertDescription className="text-sm">
            <strong>Syntax Error:</strong> {validationError}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={currentMode} className="space-y-4">
        {/* Visual Mode */}
        <TabsContent value="visual" className="space-y-4 mt-0">
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="text-center text-muted-foreground py-8">
              <div className="text-sm font-medium mb-2">Visual Editor</div>
              <div className="text-xs">
                Visual drag-and-drop transformation builder coming soon.
                <br />
                Switch to Code mode to edit transformations manually.
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Code Mode */}
        <TabsContent value="code" className="space-y-4 mt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="transformation-code">Transformation JSON</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={formatCode}
                disabled={!isValid}
              >
                Format
              </Button>
            </div>
            <Textarea
              id="transformation-code"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              className={cn(
                'font-mono text-sm min-h-[200px] resize-none',
                !isValid && 'border-destructive focus:border-destructive'
              )}
              placeholder={placeholderText}
            />
          </div>

          {/* Sample Transformations */}
          <div className="space-y-2">
            <Label className="text-sm">Sample Transformations</Label>
            <div className="grid gap-2">
              {sampleTransformations.map((sample) => (
                <Button
                  key={sample.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange(sample.transformation)
                  }}
                  className="h-auto p-3 justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{sample.name}</div>
                    <code className="text-xs text-muted-foreground block mt-1">
                      {sample.transformation.split('\n')[1]?.trim()}...
                    </code>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Input Schema Display */}
      {inputSchema && (
        <div className="space-y-2">
          <Label className="text-sm">Input Schema</Label>
          <Textarea
            value={JSON.stringify(inputSchema, null, 2)}
            readOnly
            className="font-mono text-sm min-h-[100px] resize-none bg-muted/50"
          />
        </div>
      )}

      {/* Output Preview */}
      {outputPreview && (
        <div className="space-y-2">
          <Label className="text-sm">Output Preview</Label>
          <Textarea
            value={JSON.stringify(outputPreview, null, 2)}
            readOnly
            className="font-mono text-sm min-h-[100px] resize-none bg-success/5 border-success/20"
          />
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">Transformation Syntax:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>
            <code>&quot;field&quot;: &quot;$.input.path&quot;</code> - Map input
            field to output
          </li>
          <li>
            <code>&quot;field&quot;: &quot;static_value&quot;</code> - Set
            static value
          </li>
          <li>
            <code>&quot;field&quot;: &quot;$.input.array[*]&quot;</code> -
            Transform arrays
          </li>
          <li>
            <code>&quot;field&quot;: &quot;$.input.value * 2&quot;</code> -
            Apply calculations
          </li>
        </ul>
      </div>
    </div>
  )
}

export { TransformationEditor }
