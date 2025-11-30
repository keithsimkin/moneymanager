import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/accounts', label: 'Accounts' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/goals', label: 'Goals' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/ai-chat', label: 'AI Chat' },
];

export default function Navigation() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold mr-8">Finance Dashboard</h1>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Current theme: ${theme}`}
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
