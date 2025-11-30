import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import * as fc from 'fast-check';

// Test component that uses the theme context
function TestComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Mock matchMedia with default light mode preference
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // Default to light mode
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('should default to system theme when no stored preference exists', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe('system');
  });

  it('should load theme from localStorage if available', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe('dark');
  });

  it('should persist theme changes to localStorage', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByText('Set Dark').click();
    });

    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByTestId('current-theme').textContent).toBe('dark');
  });

  it('should apply dark class to document root when theme is dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Set Dark').click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should apply light class to document root when theme is light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Set Light').click();
    });

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should respect system preference when theme is system', () => {
    // Mock matchMedia to simulate dark mode preference
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Set System').click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('should respect system preference on initial load', () => {
    // Clear localStorage to simulate first-time load
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');

    // Mock matchMedia to simulate dark mode system preference
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Render ThemeProvider without any stored preference
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should default to 'system' theme
    expect(screen.getByTestId('current-theme').textContent).toBe('system');
    
    // Should apply dark class based on system preference
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should respect light system preference on initial load', () => {
    // Clear localStorage to simulate first-time load
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');

    // Mock matchMedia to simulate light mode system preference
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // No match for dark mode = light mode
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Render ThemeProvider without any stored preference
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should default to 'system' theme
    expect(screen.getByTestId('current-theme').textContent).toBe('system');
    
    // Should apply light class based on system preference
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  // Feature: finance-dashboard, Property 38: Theme persistence
  it('property: theme persistence - any theme preference should persist to local storage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const, 'system' as const),
        (themeValue) => {
          // Clear localStorage before each iteration
          localStorage.clear();
          document.documentElement.classList.remove('light', 'dark');

          // Create a container for this iteration
          const container = document.createElement('div');
          document.body.appendChild(container);

          // Render the ThemeProvider with TestComponent
          const { unmount, getByText, getByTestId } = render(
            <ThemeProvider>
              <TestComponent />
            </ThemeProvider>,
            { container }
          );

          // Set the theme
          act(() => {
            const buttonText = `Set ${themeValue.charAt(0).toUpperCase() + themeValue.slice(1)}`;
            const button = getByText(buttonText);
            button.click();
          });

          // Verify the theme is persisted to localStorage
          const storedTheme = localStorage.getItem('theme');
          expect(storedTheme).toBe(themeValue);

          // Verify the theme state is updated
          expect(getByTestId('current-theme').textContent).toBe(themeValue);

          // Clean up first render
          unmount();
          document.body.removeChild(container);

          // Create a new container for the second render
          const container2 = document.createElement('div');
          document.body.appendChild(container2);

          // Remount to simulate a new session
          const { getByTestId: getByTestId2, unmount: unmount2 } = render(
            <ThemeProvider>
              <TestComponent />
            </ThemeProvider>,
            { container: container2 }
          );

          // Verify the theme is loaded from localStorage in the new session
          expect(getByTestId2('current-theme').textContent).toBe(themeValue);

          // Clean up
          unmount2();
          document.body.removeChild(container2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
