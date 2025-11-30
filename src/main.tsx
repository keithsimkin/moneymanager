import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { AIProvider } from './contexts/AIContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <FinanceProvider>
        <AIProvider>
          <App />
        </AIProvider>
      </FinanceProvider>
    </ThemeProvider>
  </StrictMode>,
)
