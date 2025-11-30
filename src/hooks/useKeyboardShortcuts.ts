import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          !!s.ctrl === (event.ctrlKey || event.metaKey) &&
          !!s.alt === event.altKey &&
          !!s.shift === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      alt: true,
      description: 'Go to Dashboard',
      action: () => navigate('/dashboard'),
    },
    {
      key: 'a',
      alt: true,
      description: 'Go to Accounts',
      action: () => navigate('/accounts'),
    },
    {
      key: 't',
      alt: true,
      description: 'Go to Transactions',
      action: () => navigate('/transactions'),
    },
    {
      key: 'b',
      alt: true,
      description: 'Go to Budgets',
      action: () => navigate('/budgets'),
    },
    {
      key: 'g',
      alt: true,
      description: 'Go to Goals',
      action: () => navigate('/goals'),
    },
    {
      key: 'r',
      alt: true,
      description: 'Go to Analytics',
      action: () => navigate('/analytics'),
    },
    {
      key: 'k',
      alt: true,
      description: 'Go to Keyboard Shortcuts',
      action: () => navigate('/keyboard-shortcuts'),
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        const event = new CustomEvent('toggle-shortcuts-dialog');
        window.dispatchEvent(event);
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
