import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-950 p-4 overflow-hidden">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <div className="flex gap-4 h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-background">
          <Header />
          <main id="main-content" className="flex-1 p-6 overflow-y-auto" role="main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
