import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export function ComponentTest() {
  return (
    <div className="p-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">
          shadcn/ui Component Test
        </h1>
        <p className="text-muted-foreground mb-8">
          Testing RocketHooks theme with Indigo primary color
        </p>

        {/* Primary Color Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Primary Theme Colors</CardTitle>
            <CardDescription>
              Verifying Indigo primary color implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* RocketHooks Custom Colors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>RocketHooks Custom Colors</CardTitle>
            <CardDescription>
              Testing success, warning, and info color variants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Custom Button Variants:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="success">
                    <CheckCircle className="h-4 w-4" />
                    Success
                  </Button>
                  <Button variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    Warning
                  </Button>
                  <Button variant="info">
                    <Info className="h-4 w-4" />
                    Info
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Custom Badge Variants:</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <p className="text-sm font-medium">Alert Components with Custom Colors:</p>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Info Alert</AlertTitle>
                <AlertDescription>
                  This is an info alert using the custom info color variant.
                </AlertDescription>
              </Alert>

              <Alert className="border-success text-success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription>
                  This is a success alert using the custom success color variant.
                </AlertDescription>
              </Alert>

              <Alert className="border-warning text-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning Alert</AlertTitle>
                <AlertDescription>
                  This is a warning alert using the custom warning color variant.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Alert</AlertTitle>
                <AlertDescription>
                  This is an error alert using the destructive variant.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>Testing form inputs and controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="select">Select Option</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Enter your message" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* Progress and Avatar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Progress & Avatar Components</CardTitle>
            <CardDescription>Testing progress bars and avatars</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Progress (33%)</Label>
              <Progress value={33} className="w-full" />
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction Test */}
        <Card>
          <CardHeader>
            <CardTitle>Interaction Test</CardTitle>
            <CardDescription>
              Test toast notifications and other interactive elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="success"
                onClick={() =>
                  toast.success('Success notification!', {
                    description:
                      'This is a success message using Sonner toast.',
                  })
                }
              >
                Test Success Toast
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  toast.error('Error notification!', {
                    description: 'This is an error message using Sonner toast.',
                  })
                }
              >
                Test Error Toast
              </Button>

              <Button
                variant="warning"
                onClick={() =>
                  toast.warning('Warning notification!', {
                    description: 'This is a warning message using Sonner toast.',
                  })
                }
              >
                Test Warning Toast
              </Button>
              
              <Button
                variant="info"
                onClick={() =>
                  toast.info('Info notification!', {
                    description: 'This is an info message using Sonner toast.',
                  })
                }
              >
                Test Info Toast
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Click the buttons above to test toast notifications and verify the
              theme is working correctly. Notice how the buttons now use the
              custom color variants that match their purpose.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}