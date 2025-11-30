import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';
import { useRecurring } from './useRecurring';
import * as React from 'react';

// Test component that uses both contexts
function TestComponent() {
  const {
    addAccount,
    addRecurringPattern,
    updateRecurringPattern,
    accounts,
    transactions,
    recurringPatterns,
  } = useFinance();
  
  const {
    generateDueTransactions,
    generateDueTransactionsForPattern,
    getActivePatterns,
    getTransactionsForPattern,
    getNextScheduledDate,
    getDuePatternCount,
  } = useRecurring();

  const [testDate, setTestDate] = React.useState<Date | null>(null);
  const [nextScheduled, setNextScheduled] = React.useState<string>('');
  const [patternTransactions, setPatternTransactions] = React.useState<number>(0);

  return (
    <div>
      <div data-testid="accounts-count">{accounts.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="patterns-count">{recurringPatterns.length}</div>
      <div data-testid="active-patterns-count">{getActivePatterns().length}</div>
      <div data-testid="due-patterns-count">
        {testDate ? getDuePatternCount(testDate) : 0}
      </div>
      <div data-testid="next-scheduled">{nextScheduled}</div>
      <div data-testid="pattern-transactions">{patternTransactions}</div>
      
      <button
        onClick={() =>
          addAccount({
            name: 'Checking Account',
            type: 'checking',
            initialBalance: 1000,
            currency: 'USD',
          })
        }
        data-testid="add-account"
      >
        Add Account
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addRecurringPattern({
              accountId: accounts[0].id,
              amount: 3000,
              description: 'Monthly Salary',
              category: 'Other',
              type: 'income',
              frequency: 'monthly',
              startDate: '2024-01-01T00:00:00.000Z',
              isActive: true,
            });
          }
        }}
        data-testid="add-monthly-pattern"
      >
        Add Monthly Pattern
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addRecurringPattern({
              accountId: accounts[0].id,
              amount: 50,
              description: 'Weekly Groceries',
              category: 'Groceries',
              type: 'expense',
              frequency: 'weekly',
              startDate: '2024-01-01T00:00:00.000Z',
              isActive: true,
            });
          }
        }}
        data-testid="add-weekly-pattern"
      >
        Add Weekly Pattern
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addRecurringPattern({
              accountId: accounts[0].id,
              amount: 100,
              description: 'Daily Coffee',
              category: 'Dining',
              type: 'expense',
              frequency: 'daily',
              startDate: '2024-01-01T00:00:00.000Z',
              isActive: false,
            });
          }
        }}
        data-testid="add-inactive-pattern"
      >
        Add Inactive Pattern
      </button>
      
      <button
        onClick={() => {
          const date = new Date('2024-02-15T00:00:00.000Z');
          setTestDate(date);
          generateDueTransactions(date);
        }}
        data-testid="generate-due-feb15"
      >
        Generate Due (Feb 15)
      </button>
      
      <button
        onClick={() => {
          const date = new Date('2024-01-08T00:00:00.000Z');
          setTestDate(date);
          generateDueTransactions(date);
        }}
        data-testid="generate-due-jan8"
      >
        Generate Due (Jan 8)
      </button>
      
      <button
        onClick={() => {
          if (recurringPatterns.length > 0) {
            const pattern = recurringPatterns[0];
            const date = new Date('2024-02-15T00:00:00.000Z');
            generateDueTransactionsForPattern(pattern, date);
          }
        }}
        data-testid="generate-for-first-pattern"
      >
        Generate For First Pattern
      </button>
      
      <button
        onClick={() => {
          if (recurringPatterns.length > 0) {
            const pattern = recurringPatterns[0];
            const nextDate = getNextScheduledDate(pattern);
            setNextScheduled(nextDate ? nextDate.toISOString() : 'none');
          }
        }}
        data-testid="get-next-scheduled"
      >
        Get Next Scheduled
      </button>
      
      <button
        onClick={() => {
          if (recurringPatterns.length > 0) {
            const patternId = recurringPatterns[0].id;
            setPatternTransactions(getTransactionsForPattern(patternId).length);
          }
        }}
        data-testid="get-pattern-transactions"
      >
        Get Pattern Transactions
      </button>
      
      <button
        onClick={() => {
          if (recurringPatterns.length > 0) {
            updateRecurringPattern(recurringPatterns[0].id, {
              lastOccurrence: '2024-01-15T00:00:00.000Z',
            });
          }
        }}
        data-testid="update-last-occurrence"
      >
        Update Last Occurrence
      </button>
      
      <button
        onClick={() => {
          if (recurringPatterns.length > 0) {
            updateRecurringPattern(recurringPatterns[0].id, {
              isActive: false,
            });
          }
        }}
        data-testid="deactivate-pattern"
      >
        Deactivate Pattern
      </button>
    </div>
  );
}

describe('useRecurring', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should get active patterns only', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add active pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Add inactive pattern
    act(() => {
      getByTestId('add-inactive-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('2');
    });

    // Should only count active patterns
    expect(screen.getByTestId('active-patterns-count').textContent).toBe('1');
  });

  it('should generate monthly recurring transactions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern starting Jan 1
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions up to Feb 15 (should create Jan 1 and Feb 1)
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });
  });

  it('should generate weekly recurring transactions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add weekly pattern starting Jan 1
    act(() => {
      getByTestId('add-weekly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions up to Jan 8 (should create Jan 1 and Jan 8)
    act(() => {
      getByTestId('generate-due-jan8').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });
  });

  it('should not generate transactions for inactive patterns', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add inactive pattern
    act(() => {
      getByTestId('add-inactive-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      // Should not generate any transactions
      expect(screen.getByTestId('transactions-count').textContent).toBe('0');
    });
  });

  it('should update lastOccurrence after generating transactions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions for first pattern
    act(() => {
      getByTestId('generate-for-first-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Get next scheduled date (should be March 1 after generating Jan 1 and Feb 1)
    act(() => {
      getByTestId('get-next-scheduled').click();
    });

    await waitFor(() => {
      const nextScheduled = screen.getByTestId('next-scheduled').textContent;
      expect(nextScheduled).toContain('2024-03-01');
    });
  });

  it('should get transactions for a specific pattern', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Get transactions for pattern
    act(() => {
      getByTestId('get-pattern-transactions').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pattern-transactions').textContent).toBe('2');
    });
  });

  it('should respect lastOccurrence when generating transactions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Update lastOccurrence to Jan 15
    act(() => {
      getByTestId('update-last-occurrence').click();
    });

    await waitFor(() => {
      // Pattern should be updated
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions up to Feb 15 (should only create Feb 15, not Jan 1)
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });
  });

  it('should count due patterns correctly', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Add weekly pattern
    act(() => {
      getByTestId('add-weekly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('2');
    });

    // Generate transactions for Feb 15 (both should be due before generation)
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      // After generation, both patterns should have generated transactions
      // Monthly: Jan 1, Feb 1 = 2 transactions
      // Weekly: Jan 1, 8, 15, 22, 29, Feb 5, 12 = 7 transactions
      // Total = 9 transactions
      expect(screen.getByTestId('transactions-count').textContent).toBe('9');
    });
  });

  it('should not count deactivated patterns as due', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Deactivate pattern
    act(() => {
      getByTestId('deactivate-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('active-patterns-count').textContent).toBe('0');
    });

    // Check due patterns for Feb 15 (should be 0)
    act(() => {
      getByTestId('generate-due-feb15').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('due-patterns-count').textContent).toBe('0');
    });
  });

  it('should mark generated transactions as recurring', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add monthly pattern
    act(() => {
      getByTestId('add-monthly-pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('patterns-count').textContent).toBe('1');
    });

    // Generate transactions
    act(() => {
      getByTestId('generate-due-jan8').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Get pattern transactions (should find the generated transaction)
    act(() => {
      getByTestId('get-pattern-transactions').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pattern-transactions').textContent).toBe('1');
    });
  });
});
