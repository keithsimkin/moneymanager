import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

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
  { keys: ['Shift', '?'], description: 'Show this dialog', category: 'General' },
  { keys: ['Esc'], description: 'Close dialogs', category: 'General' },
];

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setOpen((prev) => !prev);
    window.addEventListener('toggle-shortcuts-dialog', handleToggle);
    return () => window.removeEventListener('toggle-shortcuts-dialog', handleToggle);
  }, []);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the app quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
