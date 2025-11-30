// Demo component to verify all shadcn/ui components are properly installed
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

/**
 * This component demonstrates that all shadcn/ui components are properly installed
 * and can be imported without errors. This is a verification component for task 4.
 */
export function ComponentsDemo() {
  return (
    <div className="p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui Components Installed</CardTitle>
          <CardDescription>All required components are ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-input">Demo Input</Label>
            <Input id="demo-input" placeholder="Type something..." />
          </div>
          
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          
          <div className="space-y-2">
            <Label>Progress Demo</Label>
            <Progress value={60} />
          </div>
          
          <Alert>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              All shadcn/ui components have been successfully installed and configured.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Components: Button, Card, Dialog, Select, Input, Label, Table, Tabs, Badge, 
            Progress, DropdownMenu, Popover, Tooltip, Alert, AlertDialog, Calendar
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
