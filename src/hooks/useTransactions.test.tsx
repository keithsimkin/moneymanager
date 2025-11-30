import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';
import { useTransactions } from './useTransactions';
import type { FilterOptions } from '../types';

// Test component that uses both contexts
function TestComponent() {
  const { addAccount, addTransaction, accounts, transactions } = useFinance();
  const {
    filterTransactions,
    getTransactionsByAccount,
    getTransactionsByDateRange,
    getRecentTransactions,
    getTransactionsByCategory,
    getTransactionsByType,
    getIncomeTransactions,
    getExpenseTransactions,
    getTransactionCount,
    transactionExists,
    getTransactionById,
  } = useTransactions();

  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [filteredResults, setFilteredResults] = React.useState<any[]>([]);

  return (
    <div>
      <div data-testid="accounts-count">{accounts.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="filtered-count">{filteredResults.length}</div>
      
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
            addTransaction({
              accountId: accounts[0].id,
              amount: 100,
              description: 'Salary Payment',
              category: 'Other',
              date: '2024-01-15T10:00:00.000Z',
              type: 'income',
              isRecurring: false,
            });
          }
        }}
        data-testid="add-income"
      >
        Add Income
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addTransaction({
              accountId: accounts[0].id,
              amount: 50,
              description: 'Grocery Shopping',
              category: 'Groceries',
              date: '2024-01-20T14:00:00.000Z',
              type: 'expense',
              isRecurring: false,
            });
          }
        }}
        data-testid="add-expense"
      >
        Add Expense
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addTransaction({
              accountId: accounts[0].id,
              amount: 30,
              description: 'Restaurant Dinner',
              category: 'Dining',
              date: '2024-02-10T19:00:00.000Z',
              type: 'expense',
              isRecurring: false,
            });
          }
        }}
        data-testid="add-dining"
      >
        Add Dining
      </button>
      
      <button
        onClick={() => {
          setFilteredResults(filterTransactions(filters));
        }}
        data-testid="apply-filters"
      >
        Apply Filters
      </button>
      
      <button
        onClick={() => {
          setFilters({ searchTerm: 'grocery' });
        }}
        data-testid="set-search-filter"
      >
        Set Search Filter
      </button>
      
      <button
        onClick={() => {
          setFilters({ category: 'Groceries' });
        }}
        data-testid="set-category-filter"
      >
        Set Category Filter
      </button>
      
      <button
        onClick={() => {
          setFilters({ startDate: '2024-01-01', endDate: '2024-01-31' });
        }}
        data-testid="set-date-filter"
      >
        Set Date Filter
      </button>
      
      <button
        onClick={() => {
          setFilters({ type: 'expense' });
        }}
        data-testid="set-type-filter"
      >
        Set Type Filter
      </button>
      
      <button
        onClick={() => {
          setFilters({});
        }}
        data-testid="clear-filters"
      >
        Clear Filters
      </button>
      
      {accounts.length > 0 && (
        <>
          <div data-testid="account-transactions">
            {getTransactionsByAccount(accounts[0].id).length}
          </div>
          <div data-testid="recent-transactions">
            {getRecentTransactions(2).length}
          </div>
          <div data-testid="groceries-transactions">
            {getTransactionsByCategory('Groceries').length}
          </div>
          <div data-testid="income-transactions">
            {getIncomeTransactions().length}
          </div>
          <div data-testid="expense-transactions">
            {getExpenseTransactions().length}
          </div>
          <div data-testid="total-transaction-count">
            {getTransactionCount()}
          </div>
        </>
      )}
      
      {transactions.length > 0 && (
        <>
          <div data-testid="first-transaction-exists">
            {transactionExists(transactions[0].id) ? 'true' : 'false'}
          </div>
          <div data-testid="first-transaction-by-id">
            {getTransactionById(transactions[0].id)?.description || 'not found'}
          </div>
        </>
      )}
      
      <div data-testid="filtered-results">
        {JSON.stringify(filteredResults.map(t => ({ description: t.description, category: t.category })))}
      </div>
    </div>
  );
}

// Import React for useState
import * as React from 'react';

describe('useTransactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should filter transactions by search term (case-insensitive)', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Set search filter and apply
    act(() => {
      getByTestId('set-search-filter').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('1');
    });

    // Verify the filtered result is the grocery transaction
    const results = JSON.parse(screen.getByTestId('filtered-results').textContent || '[]');
    expect(results[0].description).toBe('Grocery Shopping');
  });

  it('should filter transactions by category', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-dining').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Set category filter and apply
    act(() => {
      getByTestId('set-category-filter').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('1');
    });

    // Verify the filtered result is the grocery transaction
    const results = JSON.parse(screen.getByTestId('filtered-results').textContent || '[]');
    expect(results[0].category).toBe('Groceries');
  });

  it('should filter transactions by date range', async () => {
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

    // Add transactions with different dates
    act(() => {
      getByTestId('add-income').click(); // Jan 15
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click(); // Jan 20
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    act(() => {
      getByTestId('add-dining').click(); // Feb 10
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Set date filter for January only
    act(() => {
      getByTestId('set-date-filter').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('2');
    });

    // Verify only January transactions are returned
    const results = JSON.parse(screen.getByTestId('filtered-results').textContent || '[]');
    expect(results).toHaveLength(2);
    expect(results.some((r: any) => r.description === 'Salary Payment')).toBe(true);
    expect(results.some((r: any) => r.description === 'Grocery Shopping')).toBe(true);
  });

  it('should filter transactions by type', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Set type filter for expenses
    act(() => {
      getByTestId('set-type-filter').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('1');
    });

    // Verify only expense transaction is returned
    const results = JSON.parse(screen.getByTestId('filtered-results').textContent || '[]');
    expect(results[0].description).toBe('Grocery Shopping');
  });

  it('should clear filters and return all transactions', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Set a filter first
    act(() => {
      getByTestId('set-category-filter').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('1');
    });

    // Clear filters
    act(() => {
      getByTestId('clear-filters').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('2');
    });
  });

  it('should sort transactions by date (most recent first)', async () => {
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

    // Add transactions in non-chronological order
    act(() => {
      getByTestId('add-income').click(); // Jan 15
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-dining').click(); // Feb 10 (most recent)
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    act(() => {
      getByTestId('add-expense').click(); // Jan 20
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Apply filters (no filters, just sorting)
    act(() => {
      getByTestId('clear-filters').click();
    });

    act(() => {
      getByTestId('apply-filters').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('filtered-count').textContent).toBe('3');
    });

    // Verify order: Feb 10, Jan 20, Jan 15
    const results = JSON.parse(screen.getByTestId('filtered-results').textContent || '[]');
    expect(results[0].description).toBe('Restaurant Dinner'); // Feb 10
    expect(results[1].description).toBe('Grocery Shopping'); // Jan 20
    expect(results[2].description).toBe('Salary Payment'); // Jan 15
  });

  it('should get transactions by account', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Check account transactions
    expect(screen.getByTestId('account-transactions').textContent).toBe('2');
  });

  it('should get recent transactions with limit', async () => {
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

    // Add 3 transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    act(() => {
      getByTestId('add-dining').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Get recent transactions (limit 2)
    expect(screen.getByTestId('recent-transactions').textContent).toBe('2');
  });

  it('should get transactions by category', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-expense').click(); // Groceries
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-dining').click(); // Dining
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Check groceries transactions
    expect(screen.getByTestId('groceries-transactions').textContent).toBe('1');
  });

  it('should separate income and expense transactions', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    act(() => {
      getByTestId('add-dining').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Check income and expense counts
    expect(screen.getByTestId('income-transactions').textContent).toBe('1');
    expect(screen.getByTestId('expense-transactions').textContent).toBe('2');
  });

  it('should get transaction count', async () => {
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

    // Add transactions
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Check total count
    expect(screen.getByTestId('total-transaction-count').textContent).toBe('2');
  });

  it('should check if transaction exists', async () => {
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

    // Add transaction
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Transaction should exist
    expect(screen.getByTestId('first-transaction-exists').textContent).toBe('true');
  });

  it('should get transaction by ID', async () => {
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

    // Add transaction
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Get transaction by ID
    expect(screen.getByTestId('first-transaction-by-id').textContent).toBe('Salary Payment');
  });
});
