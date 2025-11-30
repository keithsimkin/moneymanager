import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Squares2X2Icon as LayoutDashboard,
  WalletIcon as Wallet,
  ReceiptPercentIcon as Receipt,
  BanknotesIcon as PiggyBank,
  FlagIcon as Target,
  ChartBarIcon as BarChart3,
  SparklesIcon as Sparkles,
  ChatBubbleLeftRightIcon as MessageSquare,
  Bars3Icon as Menu,
  XMarkIcon as X,
  MagnifyingGlassIcon as Search,
  Cog6ToothIcon as Settings,
  QuestionMarkCircleIcon as HelpCircle
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/budgets', label: 'Budgets', icon: PiggyBank },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/advanced-analytics', label: 'AI Analytics', icon: Sparkles },
  { path: '/ai-chat', label: 'AI Chat', icon: MessageSquare },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="sidebar-navigation"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar-navigation"
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-60 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-border">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">MoneyManager</span>
          </div>

          {/* Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search" 
                className="pl-9 h-9 bg-gray-50 dark:bg-muted border-gray-200 dark:border-border text-sm"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-border bg-white dark:bg-card px-1.5 font-mono text-[10px] font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Main Menu */}
          <div className="px-3 py-2">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-muted-foreground mb-2">Main Menu</p>
            <nav className="space-y-1" aria-label="Primary navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="mt-auto border-t border-gray-200 dark:border-border px-3 py-4 space-y-1">
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                location.pathname === '/help'
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted'
              )}
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                location.pathname === '/settings'
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted'
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
