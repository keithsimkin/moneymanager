import { useState } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportImportDialog } from './ExportImportDialog';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [exportImportOpen, setExportImportOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold ml-12 lg:ml-0">Finance Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setExportImportOpen(true)}>
                Export / Import Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ExportImportDialog
        open={exportImportOpen}
        onOpenChange={setExportImportOpen}
      />
    </header>
  );
}
