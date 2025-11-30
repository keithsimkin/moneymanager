import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import AIChat from './pages/AIChat';
import KeyboardShortcuts from './pages/KeyboardShortcuts';
import HelpCenter from './pages/HelpCenter';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog';
import { useGlobalKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function AppContent() {
  useGlobalKeyboardShortcuts();

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/keyboard-shortcuts" element={<KeyboardShortcuts />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
      <KeyboardShortcutsDialog />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
