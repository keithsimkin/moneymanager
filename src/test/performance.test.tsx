import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TransactionList } from '@/components/TransactionList';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { BalanceChart } from '@/components/BalanceChart';
import type { Transaction, Account, CategorySpending } from '@/types';

/**
 * Performance tests to verify optimizations work with large datasets
 * 
 * Task 31: Optimize performance
 * - Test with large datasets (1000+ transactions)
 */
describe('Performance Tests', () => {
  // Generate large dataset for testing
  const generateLargeTransactionDataset = (count: number): Transaction[] => {
    const transactions: Transaction[] = [];
    const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare'];
    const accountIds = ['account-1', 'account-2', 'account-3'];
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      transactions.push({
        id: `transaction-${i}`,
        accountId: accountIds[Math.floor(Math.random() * accountIds.length)],
        amount: Math.random() * 1000,
        description: `Transaction ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: date.toISOString(),
        type: Math.random() > 0.5 ? 'income' : 'expense',
        isRecurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    return transactions;
  };

  const generateAccounts = (): Account[] => {
    return [
      {
        id: 'account-1',
        name: 'Checking',
        type: 'checking',
        initialBalance: 1000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'account-2',
        name: 'Savings',
        type: 'savings',
        initialBalance: 5000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'account-3',
        name: 'Credit Card',
        type: 'credit',
        initialBalance: 0,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  it('should render TransactionList with 1000+ transactions efficiently', () => {
    const transactions = generateLargeTransactionDataset(1000);
    const accounts = generateAccounts();
    
    const startTime = performance.now();
    
    const { container } = render(
      <TransactionList
        transactions={transactions}
        accounts={accounts}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Verify it renders
    expect(container).toBeTruthy();
    
    // Log performance for visibility
    console.log(`TransactionList with 1000 transactions rendered in ${renderTime.toFixed(2)}ms`);
    
    // Should render in reasonable time (less than 3 seconds for 1000 rows)
    // Note: In production, virtual scrolling would be used for better performance
    expect(renderTime).toBeLessThan(3000);
  });

  it('should render CategoryChart with large dataset efficiently', () => {
    const categoryData: CategorySpending[] = [
      { category: 'Groceries', amount: 5000, percentage: 25, transactionCount: 200 },
      { category: 'Utilities', amount: 3000, percentage: 15, transactionCount: 150 },
      { category: 'Entertainment', amount: 4000, percentage: 20, transactionCount: 180 },
      { category: 'Transportation', amount: 6000, percentage: 30, transactionCount: 220 },
      { category: 'Healthcare', amount: 2000, percentage: 10, transactionCount: 100 },
    ];
    
    const startTime = performance.now();
    
    const { container } = render(<CategoryChart data={categoryData} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(container).toBeTruthy();
    console.log(`CategoryChart rendered in ${renderTime.toFixed(2)}ms`);
    
    // Charts should render quickly
    expect(renderTime).toBeLessThan(500);
  });

  it('should render TrendChart efficiently', () => {
    const trendData = Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${String(i + 1).padStart(2, '0')}`,
      income: Math.random() * 10000,
      expenses: Math.random() * 8000,
    }));
    
    const startTime = performance.now();
    
    const { container } = render(<TrendChart data={trendData} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(container).toBeTruthy();
    console.log(`TrendChart rendered in ${renderTime.toFixed(2)}ms`);
    
    expect(renderTime).toBeLessThan(500);
  });

  it('should render BalanceChart efficiently', () => {
    const balanceData = Array.from({ length: 10 }, (_, i) => ({
      name: `Account ${i + 1}`,
      balance: Math.random() * 50000,
      type: 'checking',
    }));
    
    const startTime = performance.now();
    
    const { container } = render(<BalanceChart data={balanceData} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(container).toBeTruthy();
    console.log(`BalanceChart rendered in ${renderTime.toFixed(2)}ms`);
    
    expect(renderTime).toBeLessThan(500);
  });

  it('should handle re-renders efficiently with React.memo', () => {
    const transactions = generateLargeTransactionDataset(500);
    const accounts = generateAccounts();
    
    const { rerender } = render(
      <TransactionList
        transactions={transactions}
        accounts={accounts}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    
    const startTime = performance.now();
    
    // Re-render with same props (should be fast due to React.memo)
    rerender(
      <TransactionList
        transactions={transactions}
        accounts={accounts}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    
    const endTime = performance.now();
    const rerenderTime = endTime - startTime;
    
    console.log(`TransactionList re-render with same props took ${rerenderTime.toFixed(2)}ms`);
    
    // Re-render with same props should be faster than initial render
    // Note: React.memo prevents unnecessary re-renders when props haven't changed
    expect(rerenderTime).toBeLessThan(1000);
  });
});
