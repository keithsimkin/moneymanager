import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 lg:h-screen lg:p-4 lg:overflow-hidden">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <div className="flex flex-col lg:flex-row lg:gap-4 lg:h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:rounded-xl lg:border lg:border-gray-200 lg:dark:border-gray-800 bg-gray-50 dark:bg-background">
          <Header />
          <main id="main-content" className="flex-1 p-4 sm:p-6 overflow-y-auto" role="main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
