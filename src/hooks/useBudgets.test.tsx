import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';
import { useBudgets } from './useBudgets';

// Test component that uses both contexts
function TestComponent() {
  const { addBudget, addTransaction, budgets, transactions } = useFinance();
  const {
    getBudgetProgress,
    getActiveBudgets,
    getAllBudgetProgress,
    checkBudgetAlerts,
    getBudgetByCategory,
    hasBudgetForCategory,
  } = useBudgets();

  return (
    <div>
      <div data-testid="budgets-count">{budgets.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="active-budgets-count">{getActiveBudgets().length}</div>
      <div data-testid="budget-alerts-count">{checkBudgetAlerts().length}</div>
      
      <button
        onClick={() =>
          addBudget({
            category: 'Groceries',
            amount: 500,
            period: 'monthly',
            startDate: new Date().toISOString(),
          })
        }
        data-testid="add-budget"
      >
        Add Budget
      </button>
      
      <button
        onClick={() =>
          addTransaction({
            accountId: 'test-account-id',
            amount: 100,
            description: 'Grocery shopping',
            category: 'Groceries',
            date: new Date().toISOString(),
            type: 'expense',
            isRecurring: false,
          })
        }
        data-testid="add-grocery-expense"
      >
        Add Grocery Expense
      </button>
      
      <button
        onClick={() =>
          addTransaction({
            accountId: 'test-account-id',
            amount: 400,
            description: 'Large grocery shopping',
            category: 'Groceries',
            date: new Date().toISOString(),
            type: 'expense',
            isRecurring: false,
          })
        }
        data-testid="add-large-grocery-expense"
      >
        Add Large Grocery Expense
      </button>
      
      <button
        onClick={() =>
          addTransaction({
            accountId: 'test-account-id',
            amount: 100,
            description: 'Exceeded budget',
            category: 'Groceries',
            date: new Date().toISOString(),
            type: 'expense',
            isRecurring: false,
          })
        }
        data-testid="add-exceeding-expense"
      >
        Add Exceeding Expense
      </button>
      
      {budgets.length > 0 && (
        <>
          <div data-testid="first-budget-progress">
            {JSON.stringify(getBudgetProgress(budgets[0].id))}
          </div>
          <div data-testid="has-groceries-budget">
            {hasBudgetForCategory('Groceries') ? 'true' : 'false'}
          </div>
          <div data-testid="groceries-budget">
            {JSON.stringify(getBudgetByCategory('Groceries'))}
          </div>
        </>
      )}
      
      <div data-testid="all-budget-progress">
        {JSON.stringify(getAllBudgetProgress())}
      </div>
      
      <div data-testid="budget-alerts">
        {JSON.stringify(checkBudgetAlerts())}
      </div>
    </div>
  );
}

describe('useBudgets', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return active budgets', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Should have 1 active budget
    expect(screen.getByTestId('active-budgets-count').textContent).toBe('1');
  });

  it('should calculate budget progress with no spending', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Get budget progress
    const progress = JSON.parse(
      screen.getByTestId('first-budget-progress').textContent || '{}'
    );

    expect(progress.spent).toBe(0);
    expect(progress.remaining).toBe(500);
    expect(progress.percentage).toBe(0);
    expect(progress.status).toBe('safe');
  });

  it('should calculate budget progress with some spending', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Add expense (100 out of 500 = 20%)
    act(() => {
      getByTestId('add-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Get budget progress
    const progress = JSON.parse(
      screen.getByTestId('first-budget-progress').textContent || '{}'
    );

    expect(progress.spent).toBe(100);
    expect(progress.remaining).toBe(400);
    expect(progress.percentage).toBe(20);
    expect(progress.status).toBe('safe');
  });

  it('should show warning status when spending exceeds 80%', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Add expense (400 out of 500 = 80%)
    act(() => {
      getByTestId('add-large-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Get budget progress
    const progress = JSON.parse(
      screen.getByTestId('first-budget-progress').textContent || '{}'
    );

    expect(progress.spent).toBe(400);
    expect(progress.remaining).toBe(100);
    expect(progress.percentage).toBe(80);
    expect(progress.status).toBe('warning');
  });

  it('should show exceeded status when spending exceeds 100%', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Add large expense (400)
    act(() => {
      getByTestId('add-large-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Add another expense (100) - total 500/500 = 100%
    act(() => {
      getByTestId('add-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Add exceeding expense (100) - total 600/500 = 120%
    act(() => {
      getByTestId('add-exceeding-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Get budget progress
    const progress = JSON.parse(
      screen.getByTestId('first-budget-progress').textContent || '{}'
    );

    expect(progress.spent).toBe(600);
    expect(progress.remaining).toBe(-100);
    expect(progress.percentage).toBe(120);
    expect(progress.status).toBe('exceeded');
  });

  it('should detect budget alerts for warning threshold', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // No alerts initially
    expect(screen.getByTestId('budget-alerts-count').textContent).toBe('0');

    // Add expense to trigger warning (400 out of 500 = 80%)
    act(() => {
      getByTestId('add-large-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Should have 1 alert
    expect(screen.getByTestId('budget-alerts-count').textContent).toBe('1');

    const alerts = JSON.parse(
      screen.getByTestId('budget-alerts').textContent || '[]'
    );

    expect(alerts).toHaveLength(1);
    expect(alerts[0].category).toBe('Groceries');
    expect(alerts[0].percentage).toBe(80);
    expect(alerts[0].type).toBe('warning');
  });

  it('should detect budget alerts for exceeded threshold', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Add expenses to exceed budget
    act(() => {
      getByTestId('add-large-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    act(() => {
      getByTestId('add-exceeding-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    act(() => {
      getByTestId('add-exceeding-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('3');
    });

    // Should have 1 alert
    expect(screen.getByTestId('budget-alerts-count').textContent).toBe('1');

    const alerts = JSON.parse(
      screen.getByTestId('budget-alerts').textContent || '[]'
    );

    expect(alerts).toHaveLength(1);
    expect(alerts[0].category).toBe('Groceries');
    expect(alerts[0].percentage).toBe(120);
    expect(alerts[0].type).toBe('exceeded');
  });

  it('should get budget by category', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Should find budget by category
    expect(screen.getByTestId('has-groceries-budget').textContent).toBe('true');

    const budget = JSON.parse(
      screen.getByTestId('groceries-budget').textContent || '{}'
    );

    expect(budget.category).toBe('Groceries');
    expect(budget.amount).toBe(500);
    expect(budget.period).toBe('monthly');
  });

  it('should return all budget progress', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    // Add budget
    act(() => {
      getByTestId('add-budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Add expense
    act(() => {
      getByTestId('add-grocery-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    const allProgress = JSON.parse(
      screen.getByTestId('all-budget-progress').textContent || '[]'
    );

    expect(allProgress).toHaveLength(1);
    expect(allProgress[0].spent).toBe(100);
    expect(allProgress[0].percentage).toBe(20);
    expect(allProgress[0].status).toBe('safe');
  });
});
