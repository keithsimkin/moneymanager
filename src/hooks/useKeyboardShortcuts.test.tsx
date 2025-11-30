import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useKeyboardShortcuts, useGlobalKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('should trigger action when matching key combination is pressed', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrl: true, description: 'Test shortcut', action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should not trigger action when key combination does not match', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrl: true, description: 'Test shortcut', action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: false,
    });
    window.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();
  });

  it('should handle alt key modifier', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'd', alt: true, description: 'Test shortcut', action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'd',
      altKey: true,
    });
    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });
});

describe('useGlobalKeyboardShortcuts', () => {
  it('should return array of shortcuts', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts(), {
      wrapper: BrowserRouter,
    });

    expect(result.current).toBeInstanceOf(Array);
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0]).toHaveProperty('key');
    expect(result.current[0]).toHaveProperty('description');
    expect(result.current[0]).toHaveProperty('action');
  });
});
