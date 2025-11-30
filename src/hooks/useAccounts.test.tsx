import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';
import { useAccounts } from './useAccounts';

// Test component that uses both contexts
function TestComponent() {
  const { addAccount, addTransaction, accounts, transactions } = useFinance();
  const {
    calculateBalance,
    getTotalBalance,
    getAccountWithBalance,
    getAllAccountsWithBalances,
    getAccountsByType,
    accountExists,
  } = useAccounts();

  return (
    <div>
      <div data-testid="accounts-count">{accounts.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="total-balance">{getTotalBalance()}</div>
      
      <button
        onClick={() =>
          addAccount({
            name: 'Checking Account',
            type: 'checking',
            initialBalance: 1000,
            currency: 'USD',
          })
        }
        data-testid="add-checking"
      >
        Add Checking
      </button>
      
      <button
        onClick={() =>
          addAccount({
            name: 'Savings Account',
            type: 'savings',
            initialBalance: 5000,
            currency: 'USD',
          })
        }
        data-testid="add-savings"
      >
        Add Savings
      </button>
      
      <button
        onClick={() => {
          if (accounts.length > 0) {
            addTransaction({
              accountId: accounts[0].id,
              amount: 100,
              description: 'Income',
              category: 'Other',
              date: new Date().toISOString(),
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
              description: 'Expense',
              category: 'Groceries',
              date: new Date().toISOString(),
              type: 'expense',
              isRecurring: false,
            });
          }
        }}
        data-testid="add-expense"
      >
        Add Expense
      </button>
      
      {accounts.length > 0 && (
        <>
          <div data-testid="first-account-balance">
            {calculateBalance(accounts[0].id)}
          </div>
          <div data-testid="first-account-exists">
            {accountExists(accounts[0].id) ? 'true' : 'false'}
          </div>
          <div data-testid="first-account-with-balance">
            {JSON.stringify(getAccountWithBalance(accounts[0].id))}
          </div>
        </>
      )}
      
      <div data-testid="all-accounts-with-balances">
        {JSON.stringify(getAllAccountsWithBalances())}
      </div>
      
      <div data-testid="checking-accounts-count">
        {getAccountsByType('checking').length}
      </div>
      
      <div data-testid="savings-accounts-count">
        {getAccountsByType('savings').length}
      </div>
    </div>
  );
}

describe('useAccounts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should calculate balance correctly with initial balance only', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Balance should equal initial balance
    expect(screen.getByTestId('first-account-balance').textContent).toBe('1000');
  });

  it('should calculate balance correctly with income transactions', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add income transaction
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Balance should be initial + income (1000 + 100 = 1100)
    expect(screen.getByTestId('first-account-balance').textContent).toBe('1100');
  });

  it('should calculate balance correctly with expense transactions', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add expense transaction
    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Balance should be initial - expense (1000 - 50 = 950)
    expect(screen.getByTestId('first-account-balance').textContent).toBe('950');
  });

  it('should calculate balance correctly with mixed transactions', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add income
    act(() => {
      getByTestId('add-income').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Add expense
    act(() => {
      getByTestId('add-expense').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('2');
    });

    // Balance should be initial + income - expense (1000 + 100 - 50 = 1050)
    expect(screen.getByTestId('first-account-balance').textContent).toBe('1050');
  });

  it('should calculate total balance across all accounts', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add checking account (1000)
    act(() => {
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add savings account (5000)
    act(() => {
      getByTestId('add-savings').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('2');
    });

    // Total balance should be 1000 + 5000 = 6000
    expect(screen.getByTestId('total-balance').textContent).toBe('6000');
  });

  it('should return account with balance', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Get account with balance
    const accountWithBalance = JSON.parse(
      screen.getByTestId('first-account-with-balance').textContent || '{}'
    );

    expect(accountWithBalance).toBeDefined();
    expect(accountWithBalance.name).toBe('Checking Account');
    expect(accountWithBalance.type).toBe('checking');
    expect(accountWithBalance.initialBalance).toBe(1000);
    expect(accountWithBalance.balance).toBe(1000);
  });

  it('should return all accounts with balances', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add checking account
    act(() => {
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add savings account
    act(() => {
      getByTestId('add-savings').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('2');
    });

    // Get all accounts with balances
    const allAccountsWithBalances = JSON.parse(
      screen.getByTestId('all-accounts-with-balances').textContent || '[]'
    );

    expect(allAccountsWithBalances).toHaveLength(2);
    expect(allAccountsWithBalances[0].balance).toBe(1000);
    expect(allAccountsWithBalances[1].balance).toBe(5000);
  });

  it('should filter accounts by type', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add checking account
    act(() => {
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add savings account
    act(() => {
      getByTestId('add-savings').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('2');
    });

    // Check counts by type
    expect(screen.getByTestId('checking-accounts-count').textContent).toBe('1');
    expect(screen.getByTestId('savings-accounts-count').textContent).toBe('1');
  });

  it('should check if account exists', async () => {
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
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Account should exist
    expect(screen.getByTestId('first-account-exists').textContent).toBe('true');
  });

  it('should return 0 balance for non-existent account', async () => {
    function NonExistentAccountTestComponent() {
      const { addAccount, accounts } = useFinance();
      const { calculateBalance } = useAccounts();

      return (
        <div>
          <div data-testid="accounts-count">{accounts.length}</div>
          <div data-testid="non-existent-balance">
            {calculateBalance('non-existent-id')}
          </div>
          <button
            onClick={() =>
              addAccount({
                name: 'Checking Account',
                type: 'checking',
                initialBalance: 1000,
                currency: 'USD',
              })
            }
            data-testid="add-checking"
          >
            Add Checking
          </button>
        </div>
      );
    }

    const { getByTestId } = render(
      <FinanceProvider>
        <NonExistentAccountTestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByTestId('add-checking').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Non-existent account should return 0
    expect(screen.getByTestId('non-existent-balance').textContent).toBe('0');
  });
});
