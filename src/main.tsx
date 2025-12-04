import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { AIProvider } from './contexts/AIContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <StorageProvider>
          <FinanceProvider>
            <AIProvider>
              <App />
            </AIProvider>
          </FinanceProvider>
        </StorageProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
