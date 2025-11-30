import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MoonIcon as Moon,
  SunIcon as Sun,
  UserIcon as User,
  ChevronDownIcon as ChevronDown,
  CommandLineIcon as Keyboard,
  ArrowRightOnRectangleIcon as LogOut,
  HomeIcon as Home
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
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExportImportDialog } from './ExportImportDialog';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/goals': 'Goals',
  '/analytics': 'Analytics',
  '/advanced-analytics': 'AI Analytics',
  '/ai-chat': 'AI Chat',
  '/settings': 'Settings',
  '/help': 'Help Center',
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [{ path: '/dashboard', label: 'Home' }];
    
    if (segments.length > 0 && segments[0] !== 'dashboard') {
      const currentPath = `/${segments[0]}`;
      const label = routeLabels[currentPath] || segments[0];
      breadcrumbs.push({ path: currentPath, label });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-border bg-white dark:bg-background">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 ml-12 lg:ml-0 flex-1 min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator className="hidden sm:block" />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-none">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="hidden sm:flex">
                        <Link to={crumb.path} className="flex items-center gap-1">
                          {index === 0 && <Home className="h-3.5 w-3.5" />}
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-1 sm:gap-2" role="toolbar" aria-label="User actions">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted hidden sm:flex"
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
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted"
            onClick={toggleTheme}
            aria-label={`Switch theme. Current theme: ${theme}`}
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 sm:h-9 gap-1 sm:gap-2 px-1 sm:px-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted"
                aria-label="Open user menu"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </div>
                <ChevronDown className="h-3 w-3 hidden sm:block" />
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
        </div>
      </div>

      <ExportImportDialog
        open={exportImportOpen}
        onOpenChange={setExportImportOpen}
      />
    </header>
  );
}
