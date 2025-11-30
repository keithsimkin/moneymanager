import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { BalanceChart } from '@/components/BalanceChart';

// Mock window.matchMedia for tests
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
});

describe('Accessibility Tests', () => {

  describe('Chart Accessibility', () => {
    it('should have role="img" and aria-label on CategoryChart', () => {
      const mockData = [
        { category: 'Groceries', amount: 500, percentage: 50, transactionCount: 10 },
        { category: 'Utilities', amount: 300, percentage: 30, transactionCount: 5 },
        { category: 'Entertainment', amount: 200, percentage: 20, transactionCount: 8 },
      ];

      const { container } = render(<CategoryChart data={mockData} />);
      const chartContainer = container.querySelector('[role="img"]');
      
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveAttribute('aria-label');
      
      const ariaLabel = chartContainer?.getAttribute('aria-label');
      expect(ariaLabel).toContain('Pie chart');
      expect(ariaLabel).toContain('Groceries');
    });

    it('should have role="img" and aria-label on TrendChart', () => {
      const mockData = [
        { month: 'Jan', income: 5000, expenses: 3000 },
        { month: 'Feb', income: 5500, expenses: 3200 },
      ];

      const { container } = render(<TrendChart data={mockData} />);
      const chartContainer = container.querySelector('[role="img"]');
      
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveAttribute('aria-label');
      
      const ariaLabel = chartContainer?.getAttribute('aria-label');
      expect(ariaLabel).toContain('Line chart');
      expect(ariaLabel).toContain('income');
    });

    it('should have role="img" and aria-label on BalanceChart', () => {
      const mockData = [
        { name: 'Checking', balance: 5000, type: 'checking' },
        { name: 'Savings', balance: 10000, type: 'savings' },
      ];

      const { container } = render(<BalanceChart data={mockData} />);
      const chartContainer = container.querySelector('[role="img"]');
      
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveAttribute('aria-label');
      
      const ariaLabel = chartContainer?.getAttribute('aria-label');
      expect(ariaLabel).toContain('Bar chart');
      expect(ariaLabel).toContain('Checking');
    });

    it('should provide accessible description for empty charts', () => {
      const { container } = render(<CategoryChart data={[]} />);
      const chartContainer = container.querySelector('[role="img"]');
      
      expect(chartContainer).toBeInTheDocument();
      const ariaLabel = chartContainer?.getAttribute('aria-label');
      expect(ariaLabel).toContain('No spending data available');
    });
  });


});
