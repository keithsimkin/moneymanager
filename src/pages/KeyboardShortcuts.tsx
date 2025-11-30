import { CommandLineIcon as Keyboard, CommandLineIcon as Command } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Alt', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['Alt', 'A'], description: 'Go to Accounts', category: 'Navigation' },
  { keys: ['Alt', 'T'], description: 'Go to Transactions', category: 'Navigation' },
  { keys: ['Alt', 'B'], description: 'Go to Budgets', category: 'Navigation' },
  { keys: ['Alt', 'G'], description: 'Go to Goals', category: 'Navigation' },
  { keys: ['Alt', 'R'], description: 'Go to Analytics', category: 'Navigation' },
  { keys: ['Alt', 'K'], description: 'Go to Keyboard Shortcuts', category: 'Navigation' },
  { keys: ['Shift', '?'], description: 'Show shortcuts dialog', category: 'General' },
  { keys: ['Esc'], description: 'Close dialogs and modals', category: 'General' },
  { keys: ['Tab'], description: 'Navigate between form fields', category: 'Forms' },
  { keys: ['Enter'], description: 'Submit forms', category: 'Forms' },
  { keys: ['Esc'], description: 'Cancel form editing', category: 'Forms' },
];

export default function KeyboardShortcuts() {
  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Keyboard className="h-8 w-8" />
          Keyboard Shortcuts
        </h1>
        <p className="text-muted-foreground mt-2">
          Use these keyboard shortcuts to navigate and interact with the app quickly and efficiently.
        </p>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Command className="h-5 w-5" />
                {category}
              </CardTitle>
              <CardDescription>
                {category === 'Navigation' && 'Quickly navigate between different pages'}
                {category === 'General' && 'General app shortcuts'}
                {category === 'Forms' && 'Shortcuts for working with forms'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <span className="text-sm font-medium">{shortcut.description}</span>
                      <div className="flex gap-1.5">
                        {shortcut.keys.map((key, i) => (
                          <kbd
                            key={i}
                            className="min-w-[2.5rem] px-3 py-1.5 text-sm font-semibold text-center text-foreground bg-muted border border-border rounded shadow-sm"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Press <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">Shift</kbd> + <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">?</kbd> anywhere in the app to see a quick reference dialog.</p>
          <p>• All navigation shortcuts use the <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">Alt</kbd> key to avoid conflicts with browser shortcuts.</p>
          <p>• Keyboard shortcuts work on all pages and are always active in the background.</p>
        </CardContent>
      </Card>
    </div>
  );
}
