import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoonIcon as Moon,
  SunIcon as Sun,
  EnvelopeIcon as Mail,
  BellIcon as Bell,
  UserIcon as User,
  ChevronDownIcon as ChevronDown,
  EllipsisHorizontalIcon as MoreHorizontal,
  CommandLineIcon as Keyboard,
  ArrowRightOnRectangleIcon as LogOut
} from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exportImportOpen, setExportImportOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-border bg-white dark:bg-background">
      <div className="flex h-14 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4 ml-12 lg:ml-0">
          {/* Page title will be rendered by individual pages */}
        </div>

        <div className="flex items-center gap-2" role="toolbar" aria-label="User actions">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
            onClick={() => {
              const event = new CustomEvent('toggle-shortcuts-dialog');
              window.dispatchEvent(event);
            }}
            aria-label="Keyboard shortcuts (Shift + ?)"
            title="Keyboard shortcuts (Shift + ?)"
          >
            <Keyboard className="h-4 w-4" />
            <span className="sr-only">Keyboard shortcuts</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
            onClick={toggleTheme}
            aria-label={`Switch theme. Current theme: ${theme}`}
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
            aria-label="Messages"
          >
            <Mail className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 gap-2 px-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted"
                aria-label="Open user menu"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </div>
                <ChevronDown className="h-3 w-3" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setExportImportOpen(true)}>
                Export / Import Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ExportImportDialog
        open={exportImportOpen}
        onOpenChange={setExportImportOpen}
      />
    </header>
  );
}
