import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
import { useState } from 'react';
import * as fc from 'fast-check';
import { FinanceProvider, useFinance } from './FinanceContext';
import type { Account } from '../types';

// Test component that uses the finance context
function TestComponent() {
  const {
    accounts,
    transactions,
    budgets,
    goals,
    recurringPatterns,
    addAccount,
    addTransaction,
    addBudget,
    addGoal,
    addRecurringPattern,
  } = useFinance();

  return (
    <div>
      <div data-testid="accounts-count">{accounts.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="budgets-count">{budgets.length}</div>
      <div data-testid="goals-count">{goals.length}</div>
      <div data-testid="recurring-patterns-count">{recurringPatterns.length}</div>
      
      <button
        onClick={() =>
          addAccount({
            name: 'Test Account',
            type: 'checking',
            initialBalance: 1000,
            currency: 'USD',
          })
        }
      >
        Add Account
      </button>
      
      <button
        onClick={() =>
          addTransaction({
            accountId: 'test-account-id',
            amount: 100,
            description: 'Test Transaction',
            category: 'groceries',
            date: new Date().toISOString(),
            type: 'expense',
            isRecurring: false,
          })
        }
      >
        Add Transaction
      </button>
      
      <button
        onClick={() =>
          addBudget({
            category: 'groceries',
            amount: 500,
            period: 'monthly',
            startDate: new Date().toISOString(),
          })
        }
      >
        Add Budget
      </button>
      
      <button
        onClick={() =>
          addGoal({
            name: 'Test Goal',
            targetAmount: 5000,
            currentAmount: 0,
            deadline: new Date().toISOString(),
            status: 'active',
          })
        }
      >
        Add Goal
      </button>
      
      <button
        onClick={() =>
          addRecurringPattern({
            accountId: 'test-account-id',
            amount: 50,
            description: 'Test Recurring',
            category: 'utilities',
            type: 'expense',
            frequency: 'monthly',
            startDate: new Date().toISOString(),
            isActive: true,
          })
        }
      >
        Add Recurring Pattern
      </button>
    </div>
  );
}

describe('FinanceContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty state when no data in storage', async () => {
    render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    expect(screen.getByTestId('transactions-count').textContent).toBe('0');
    expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    expect(screen.getByTestId('goals-count').textContent).toBe('0');
    expect(screen.getByTestId('recurring-patterns-count').textContent).toBe('0');
  });

  it('should add an account and persist to storage', async () => {
    const { getByText } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    act(() => {
      getByText('Add Account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Verify data is persisted to localStorage
    const storedAccounts = localStorage.getItem('finance-dashboard-accounts');
    expect(storedAccounts).toBeTruthy();
    const accounts = JSON.parse(storedAccounts!);
    expect(accounts).toHaveLength(1);
    expect(accounts[0].name).toBe('Test Account');
    expect(accounts[0].type).toBe('checking');
    expect(accounts[0].initialBalance).toBe(1000);
  });

  it('should add a transaction and persist to storage', async () => {
    const { getByText } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('0');
    });

    act(() => {
      getByText('Add Transaction').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Verify data is persisted to localStorage
    const storedTransactions = localStorage.getItem('finance-dashboard-transactions');
    expect(storedTransactions).toBeTruthy();
    const transactions = JSON.parse(storedTransactions!);
    expect(transactions).toHaveLength(1);
    expect(transactions[0].description).toBe('Test Transaction');
    expect(transactions[0].amount).toBe(100);
  });

  it('should add a budget and persist to storage', async () => {
    const { getByText } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('0');
    });

    act(() => {
      getByText('Add Budget').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('budgets-count').textContent).toBe('1');
    });

    // Verify data is persisted to localStorage
    const storedBudgets = localStorage.getItem('finance-dashboard-budgets');
    expect(storedBudgets).toBeTruthy();
    const budgets = JSON.parse(storedBudgets!);
    expect(budgets).toHaveLength(1);
    expect(budgets[0].category).toBe('groceries');
    expect(budgets[0].amount).toBe(500);
  });

  it('should add a goal and persist to storage', async () => {
    const { getByText } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    act(() => {
      getByText('Add Goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Verify data is persisted to localStorage
    const storedGoals = localStorage.getItem('finance-dashboard-goals');
    expect(storedGoals).toBeTruthy();
    const goals = JSON.parse(storedGoals!);
    expect(goals).toHaveLength(1);
    expect(goals[0].name).toBe('Test Goal');
    expect(goals[0].targetAmount).toBe(5000);
  });

  it('should add a recurring pattern and persist to storage', async () => {
    const { getByText } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('recurring-patterns-count').textContent).toBe('0');
    });

    act(() => {
      getByText('Add Recurring Pattern').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('recurring-patterns-count').textContent).toBe('1');
    });

    // Verify data is persisted to localStorage
    const storedPatterns = localStorage.getItem('finance-dashboard-recurring-patterns');
    expect(storedPatterns).toBeTruthy();
    const patterns = JSON.parse(storedPatterns!);
    expect(patterns).toHaveLength(1);
    expect(patterns[0].description).toBe('Test Recurring');
    expect(patterns[0].frequency).toBe('monthly');
  });

  it('should throw error when useFinance is used outside FinanceProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFinance must be used within a FinanceProvider');

    console.error = originalError;
  });

  it('should load data from localStorage on mount', async () => {
    // Pre-populate localStorage with test data
    const testAccount = {
      id: 'test-id',
      name: 'Saved Account',
      type: 'savings',
      initialBalance: 2000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('finance-dashboard-accounts', JSON.stringify([testAccount]));

    render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });
  });
});

describe('FinanceContext - CRUD Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should update an account and persist changes', async () => {
    function UpdateTestComponent() {
      const { accounts, addAccount, updateAccount } = useFinance();

      return (
        <div>
          <div data-testid="accounts-count">{accounts.length}</div>
          {accounts.map((account) => (
            <div key={account.id} data-testid={`account-${account.id}`}>
              {account.name} - {account.type}
            </div>
          ))}
          <button
            onClick={() =>
              addAccount({
                name: 'Original Account',
                type: 'checking',
                initialBalance: 1000,
                currency: 'USD',
              })
            }
          >
            Add Account
          </button>
          <button
            onClick={() => {
              if (accounts.length > 0) {
                updateAccount(accounts[0].id, { name: 'Updated Account', type: 'savings' });
              }
            }}
          >
            Update Account
          </button>
        </div>
      );
    }

    const { getByText } = render(
      <FinanceProvider>
        <UpdateTestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByText('Add Account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
      expect(screen.getByText(/Original Account - checking/)).toBeTruthy();
    });

    // Update account
    act(() => {
      getByText('Update Account').click();
    });

    await waitFor(() => {
      expect(screen.getByText(/Updated Account - savings/)).toBeTruthy();
    });

    // Verify persistence
    const storedAccounts = localStorage.getItem('finance-dashboard-accounts');
    const accounts = JSON.parse(storedAccounts!);
    expect(accounts[0].name).toBe('Updated Account');
    expect(accounts[0].type).toBe('savings');
  });

  it('should delete an account and cascade delete transactions', async () => {
    function DeleteTestComponent() {
      const { accounts, transactions, addAccount, addTransaction, deleteAccount } = useFinance();

      return (
        <div>
          <div data-testid="accounts-count">{accounts.length}</div>
          <div data-testid="transactions-count">{transactions.length}</div>
          <button
            onClick={() =>
              addAccount({
                name: 'Test Account',
                type: 'checking',
                initialBalance: 1000,
                currency: 'USD',
              })
            }
          >
            Add Account
          </button>
          <button
            onClick={() => {
              if (accounts.length > 0) {
                addTransaction({
                  accountId: accounts[0].id,
                  amount: 100,
                  description: 'Test Transaction',
                  category: 'groceries',
                  date: new Date().toISOString(),
                  type: 'expense',
                  isRecurring: false,
                });
              }
            }}
          >
            Add Transaction
          </button>
          <button
            onClick={() => {
              if (accounts.length > 0) {
                deleteAccount(accounts[0].id);
              }
            }}
          >
            Delete Account
          </button>
        </div>
      );
    }

    const { getByText } = render(
      <FinanceProvider>
        <DeleteTestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add account
    act(() => {
      getByText('Add Account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Add transaction
    act(() => {
      getByText('Add Transaction').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count').textContent).toBe('1');
    });

    // Delete account (should cascade delete transaction)
    act(() => {
      getByText('Delete Account').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
      expect(screen.getByTestId('transactions-count').textContent).toBe('0');
    });

    // Verify persistence
    const storedAccounts = localStorage.getItem('finance-dashboard-accounts');
    const storedTransactions = localStorage.getItem('finance-dashboard-transactions');
    expect(JSON.parse(storedAccounts!)).toHaveLength(0);
    expect(JSON.parse(storedTransactions!)).toHaveLength(0);
  });

  it('should export and import data with replace strategy', async () => {
    function ExportImportTestComponent() {
      const { accounts, addAccount, exportData, importData } = useFinance();
      const [exportedData, setExportedData] = useState<string>('');

      return (
        <div>
          <div data-testid="accounts-count">{accounts.length}</div>
          <button
            onClick={() =>
              addAccount({
                name: 'Account 1',
                type: 'checking',
                initialBalance: 1000,
                currency: 'USD',
              })
            }
          >
            Add Account 1
          </button>
          <button
            onClick={() =>
              addAccount({
                name: 'Account 2',
                type: 'savings',
                initialBalance: 2000,
                currency: 'USD',
              })
            }
          >
            Add Account 2
          </button>
          <button onClick={() => setExportedData(exportData())}>Export Data</button>
          <button
            onClick={() => {
              if (exportedData) {
                importData(exportedData, 'replace');
              }
            }}
          >
            Import Data (Replace)
          </button>
        </div>
      );
    }

    const { getByText } = render(
      <FinanceProvider>
        <ExportImportTestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('0');
    });

    // Add first account
    act(() => {
      getByText('Add Account 1').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });

    // Export data
    act(() => {
      getByText('Export Data').click();
    });

    // Add second account
    act(() => {
      getByText('Add Account 2').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('2');
    });

    // Import data with replace (should go back to 1 account)
    act(() => {
      getByText('Import Data (Replace)').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('accounts-count').textContent).toBe('1');
    });
  });
});

// Property-Based Tests
describe('FinanceContext - Property-Based Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Feature: finance-dashboard, Property 1: Account creation persistence
  it('Property 1: Account creation persistence - for any valid account, creating it should result in it appearing in the account list with all provided information intact', { timeout: 30000 }, async () => {
    // Generator for account types
    const accountTypeArb = fc.constantFrom('checking', 'savings', 'credit', 'investment');
    
    // Generator for account data (without id, createdAt, updatedAt)
    const accountDataArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      type: accountTypeArb,
      initialBalance: fc.double({ min: -10000, max: 10000, noNaN: true }),
      currency: fc.constant('USD'), // Keep currency simple for now
    });

    await fc.assert(
      fc.asyncProperty(accountDataArb, async (accountData) => {
        // Create a test component that will add the account and verify it
        function PropertyTestComponent() {
          const { accounts, addAccount } = useFinance();
          const [hasAdded, setHasAdded] = useState(false);

          return (
            <div>
              <div data-testid="accounts-count">{accounts.length}</div>
              <div data-testid="accounts-data">{JSON.stringify(accounts)}</div>
              <button
                onClick={() => {
                  addAccount(accountData);
                  setHasAdded(true);
                }}
                data-testid="add-account-btn"
              >
                Add Account
              </button>
              <div data-testid="has-added">{hasAdded ? 'true' : 'false'}</div>
            </div>
          );
        }

        const { getByTestId, unmount } = render(
          <FinanceProvider>
            <PropertyTestComponent />
          </FinanceProvider>
        );

        // Wait for initial render
        await waitFor(() => {
          expect(getByTestId('accounts-count').textContent).toBe('0');
        });

        // Add the account
        act(() => {
          getByTestId('add-account-btn').click();
        });

        // Wait for the account to be added
        await waitFor(() => {
          expect(getByTestId('has-added').textContent).toBe('true');
        });

        // Verify the account appears in the list
        await waitFor(() => {
          expect(getByTestId('accounts-count').textContent).toBe('1');
        });

        // Get the accounts data
        const accountsData = JSON.parse(getByTestId('accounts-data').textContent || '[]') as Account[];
        
        // Verify we have exactly one account
        expect(accountsData).toHaveLength(1);
        
        const createdAccount = accountsData[0];
        
        // Verify all provided information is intact
        expect(createdAccount.name).toBe(accountData.name);
        expect(createdAccount.type).toBe(accountData.type);
        expect(createdAccount.initialBalance).toBe(accountData.initialBalance);
        expect(createdAccount.currency).toBe(accountData.currency);
        
        // Verify generated fields exist
        expect(createdAccount.id).toBeDefined();
        expect(typeof createdAccount.id).toBe('string');
        expect(createdAccount.id.length).toBeGreaterThan(0);
        expect(createdAccount.createdAt).toBeDefined();
        expect(createdAccount.updatedAt).toBeDefined();
        
        // Verify timestamps are valid ISO strings
        expect(() => new Date(createdAccount.createdAt)).not.toThrow();
        expect(() => new Date(createdAccount.updatedAt)).not.toThrow();
        
        // Verify data is persisted to localStorage
        const storedAccounts = localStorage.getItem('finance-dashboard-accounts');
        expect(storedAccounts).toBeTruthy();
        const parsedStoredAccounts = JSON.parse(storedAccounts!) as Account[];
        expect(parsedStoredAccounts).toHaveLength(1);
        expect(parsedStoredAccounts[0].name).toBe(accountData.name);
        expect(parsedStoredAccounts[0].type).toBe(accountData.type);
        expect(parsedStoredAccounts[0].initialBalance).toBe(accountData.initialBalance);
        expect(parsedStoredAccounts[0].currency).toBe(accountData.currency);

        // Clean up
        unmount();
        cleanup();
        localStorage.clear();
      }),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  // Feature: finance-dashboard, Property 6: Transaction creation and association
  it('Property 6: Transaction creation and association - for any valid transaction data and account, creating the transaction should result in it being associated with the correct account', { timeout: 30000 }, async () => {
    // Generator for account types
    const accountTypeArb = fc.constantFrom('checking', 'savings', 'credit', 'investment');
    
    // Generator for transaction types
    const transactionTypeArb = fc.constantFrom('income', 'expense');
    
    // Generator for categories (matching the predefined categories)
    const categoryArb = fc.constantFrom('Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare', 'Shopping', 'Dining', 'Other');
    
    // Generator for account data
    const accountDataArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      type: accountTypeArb,
      initialBalance: fc.double({ min: -10000, max: 10000, noNaN: true }),
      currency: fc.constant('USD'),
    });
    
    // Generator for transaction data (without accountId which will be set later)
    const transactionDataArb = fc.record({
      amount: fc.double({ min: 0.01, max: 10000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 100 }),
      category: categoryArb,
      date: fc.date({ min: new Date(2022, 0, 1), max: new Date(2024, 11, 31) }).map(d => d.toISOString()),
      type: transactionTypeArb,
      isRecurring: fc.boolean(),
      recurringId: fc.option(fc.uuid(), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(accountDataArb, transactionDataArb, async (accountData, transactionData) => {
        // Create a test component that will add account and transaction
        function PropertyTestComponent() {
          const { accounts, transactions, addAccount, addTransaction } = useFinance();
          const [accountId, setAccountId] = useState<string | null>(null);
          const [hasAddedAccount, setHasAddedAccount] = useState(false);
          const [hasAddedTransaction, setHasAddedTransaction] = useState(false);

          return (
            <div>
              <div data-testid="accounts-count">{accounts.length}</div>
              <div data-testid="transactions-count">{transactions.length}</div>
              <div data-testid="accounts-data">{JSON.stringify(accounts)}</div>
              <div data-testid="transactions-data">{JSON.stringify(transactions)}</div>
              <button
                onClick={() => {
                  addAccount(accountData);
                  setHasAddedAccount(true);
                }}
                data-testid="add-account-btn"
              >
                Add Account
              </button>
              <button
                onClick={() => {
                  if (accounts.length > 0) {
                    const accId = accounts[0].id;
                    setAccountId(accId);
                    addTransaction({
                      ...transactionData,
                      accountId: accId,
                    });
                    setHasAddedTransaction(true);
                  }
                }}
                data-testid="add-transaction-btn"
              >
                Add Transaction
              </button>
              <div data-testid="has-added-account">{hasAddedAccount ? 'true' : 'false'}</div>
              <div data-testid="has-added-transaction">{hasAddedTransaction ? 'true' : 'false'}</div>
              <div data-testid="account-id">{accountId || ''}</div>
            </div>
          );
        }

        const { getByTestId, unmount } = render(
          <FinanceProvider>
            <PropertyTestComponent />
          </FinanceProvider>
        );

        // Wait for initial render
        await waitFor(() => {
          expect(getByTestId('accounts-count').textContent).toBe('0');
          expect(getByTestId('transactions-count').textContent).toBe('0');
        });

        // Step 1: Add the account
        act(() => {
          getByTestId('add-account-btn').click();
        });

        await waitFor(() => {
          expect(getByTestId('has-added-account').textContent).toBe('true');
          expect(getByTestId('accounts-count').textContent).toBe('1');
        });

        // Get the account ID
        const accountsData = JSON.parse(getByTestId('accounts-data').textContent || '[]');
        expect(accountsData).toHaveLength(1);
        const createdAccountId = accountsData[0].id;
        expect(createdAccountId).toBeDefined();
        expect(typeof createdAccountId).toBe('string');
        expect(createdAccountId.length).toBeGreaterThan(0);

        // Step 2: Add the transaction
        act(() => {
          getByTestId('add-transaction-btn').click();
        });

        await waitFor(() => {
          expect(getByTestId('has-added-transaction').textContent).toBe('true');
          expect(getByTestId('transactions-count').textContent).toBe('1');
        });

        // Verify the transaction was created and associated with the correct account
        const transactionsData = JSON.parse(getByTestId('transactions-data').textContent || '[]');
        expect(transactionsData).toHaveLength(1);
        
        const createdTransaction = transactionsData[0];
        
        // Verify the transaction is associated with the correct account
        expect(createdTransaction.accountId).toBe(createdAccountId);
        
        // Verify all provided information is intact
        expect(createdTransaction.amount).toBe(transactionData.amount);
        expect(createdTransaction.description).toBe(transactionData.description);
        expect(createdTransaction.category).toBe(transactionData.category);
        expect(createdTransaction.date).toBe(transactionData.date);
        expect(createdTransaction.type).toBe(transactionData.type);
        expect(createdTransaction.isRecurring).toBe(transactionData.isRecurring);
        
        // Handle optional recurringId
        if (transactionData.recurringId !== undefined) {
          expect(createdTransaction.recurringId).toBe(transactionData.recurringId);
        }
        
        // Verify generated fields exist
        expect(createdTransaction.id).toBeDefined();
        expect(typeof createdTransaction.id).toBe('string');
        expect(createdTransaction.id.length).toBeGreaterThan(0);
        expect(createdTransaction.createdAt).toBeDefined();
        expect(createdTransaction.updatedAt).toBeDefined();
        
        // Verify timestamps are valid ISO strings
        expect(() => new Date(createdTransaction.createdAt)).not.toThrow();
        expect(() => new Date(createdTransaction.updatedAt)).not.toThrow();
        
        // Verify data is persisted to localStorage
        const storedTransactions = localStorage.getItem('finance-dashboard-transactions');
        expect(storedTransactions).toBeTruthy();
        const parsedStoredTransactions = JSON.parse(storedTransactions!);
        expect(parsedStoredTransactions).toHaveLength(1);
        expect(parsedStoredTransactions[0].accountId).toBe(createdAccountId);
        expect(parsedStoredTransactions[0].amount).toBe(transactionData.amount);
        expect(parsedStoredTransactions[0].description).toBe(transactionData.description);
        expect(parsedStoredTransactions[0].category).toBe(transactionData.category);
        expect(parsedStoredTransactions[0].type).toBe(transactionData.type);

        // Clean up
        unmount();
        cleanup();
        localStorage.clear();
      }),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  // Feature: finance-dashboard, Property 4: Account deletion cascade
  it('Property 4: Account deletion cascade - for any account with associated transactions, deleting the account should remove both the account and all its transactions from the system', { timeout: 30000 }, async () => {
    // Generator for account types
    const accountTypeArb = fc.constantFrom('checking', 'savings', 'credit', 'investment');
    
    // Generator for transaction types
    const transactionTypeArb = fc.constantFrom('income', 'expense');
    
    // Generator for categories
    const categoryArb = fc.constantFrom('groceries', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'dining', 'other');
    
    // Generator for account data
    const accountDataArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      type: accountTypeArb,
      initialBalance: fc.double({ min: -10000, max: 10000, noNaN: true }),
      currency: fc.constant('USD'),
    });
    
    // Generator for transaction data (without accountId which will be set later)
    const transactionDataArb = fc.record({
      amount: fc.double({ min: 0.01, max: 10000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 100 }),
      category: categoryArb,
      date: fc.date({ min: new Date(2022, 0, 1), max: new Date(2026, 11, 31) }).map(d => d.toISOString()),
      type: transactionTypeArb,
      isRecurring: fc.boolean(),
    });
    
    // Generator for an array of 1-10 transactions
    const transactionsArrayArb = fc.array(transactionDataArb, { minLength: 1, maxLength: 10 });

    await fc.assert(
      fc.asyncProperty(accountDataArb, transactionsArrayArb, async (accountData, transactionsData) => {
        // Create a test component that will add account, transactions, and delete the account
        function PropertyTestComponent() {
          const { accounts, transactions, addAccount, addTransaction, deleteAccount } = useFinance();
          const [accountId, setAccountId] = useState<string | null>(null);
          const [hasAddedAccount, setHasAddedAccount] = useState(false);
          const [hasAddedTransactions, setHasAddedTransactions] = useState(false);
          const [hasDeletedAccount, setHasDeletedAccount] = useState(false);

          return (
            <div>
              <div data-testid="accounts-count">{accounts.length}</div>
              <div data-testid="transactions-count">{transactions.length}</div>
              <div data-testid="accounts-data">{JSON.stringify(accounts)}</div>
              <div data-testid="transactions-data">{JSON.stringify(transactions)}</div>
              <button
                onClick={() => {
                  addAccount(accountData);
                  setHasAddedAccount(true);
                }}
                data-testid="add-account-btn"
              >
                Add Account
              </button>
              <button
                onClick={() => {
                  if (accounts.length > 0) {
                    const accId = accounts[0].id;
                    setAccountId(accId);
                    transactionsData.forEach((txData) => {
                      addTransaction({
                        ...txData,
                        accountId: accId,
                      });
                    });
                    setHasAddedTransactions(true);
                  }
                }}
                data-testid="add-transactions-btn"
              >
                Add Transactions
              </button>
              <button
                onClick={() => {
                  if (accountId) {
                    deleteAccount(accountId);
                    setHasDeletedAccount(true);
                  }
                }}
                data-testid="delete-account-btn"
              >
                Delete Account
              </button>
              <div data-testid="has-added-account">{hasAddedAccount ? 'true' : 'false'}</div>
              <div data-testid="has-added-transactions">{hasAddedTransactions ? 'true' : 'false'}</div>
              <div data-testid="has-deleted-account">{hasDeletedAccount ? 'true' : 'false'}</div>
              <div data-testid="account-id">{accountId || ''}</div>
            </div>
          );
        }

        const { getByTestId, unmount } = render(
          <FinanceProvider>
            <PropertyTestComponent />
          </FinanceProvider>
        );

        // Wait for initial render
        await waitFor(() => {
          expect(getByTestId('accounts-count').textContent).toBe('0');
          expect(getByTestId('transactions-count').textContent).toBe('0');
        });

        // Step 1: Add the account
        act(() => {
          getByTestId('add-account-btn').click();
        });

        await waitFor(() => {
          expect(getByTestId('has-added-account').textContent).toBe('true');
          expect(getByTestId('accounts-count').textContent).toBe('1');
        });

        // Step 2: Add transactions associated with the account
        act(() => {
          getByTestId('add-transactions-btn').click();
        });

        await waitFor(() => {
          expect(getByTestId('has-added-transactions').textContent).toBe('true');
          expect(getByTestId('transactions-count').textContent).toBe(transactionsData.length.toString());
        });

        // Verify the account ID was captured
        const accountId = getByTestId('account-id').textContent;
        expect(accountId).toBeTruthy();
        expect(accountId!.length).toBeGreaterThan(0);

        // Verify all transactions are associated with the account
        const transactionsBeforeDelete = JSON.parse(getByTestId('transactions-data').textContent || '[]');
        expect(transactionsBeforeDelete).toHaveLength(transactionsData.length);
        transactionsBeforeDelete.forEach((tx: any) => {
          expect(tx.accountId).toBe(accountId);
        });

        // Step 3: Delete the account
        act(() => {
          getByTestId('delete-account-btn').click();
        });

        await waitFor(() => {
          expect(getByTestId('has-deleted-account').textContent).toBe('true');
        });

        // Verify the account is deleted
        await waitFor(() => {
          expect(getByTestId('accounts-count').textContent).toBe('0');
        });

        // Verify all associated transactions are also deleted (cascade)
        await waitFor(() => {
          expect(getByTestId('transactions-count').textContent).toBe('0');
        });

        // Verify the account is not in the accounts list
        const accountsAfterDelete = JSON.parse(getByTestId('accounts-data').textContent || '[]');
        expect(accountsAfterDelete).toHaveLength(0);
        expect(accountsAfterDelete.find((a: any) => a.id === accountId)).toBeUndefined();

        // Verify no transactions remain
        const transactionsAfterDelete = JSON.parse(getByTestId('transactions-data').textContent || '[]');
        expect(transactionsAfterDelete).toHaveLength(0);

        // Verify data is persisted correctly to localStorage
        const storedAccounts = localStorage.getItem('finance-dashboard-accounts');
        const storedTransactions = localStorage.getItem('finance-dashboard-transactions');
        
        expect(storedAccounts).toBeTruthy();
        expect(storedTransactions).toBeTruthy();
        
        const parsedStoredAccounts = JSON.parse(storedAccounts!);
        const parsedStoredTransactions = JSON.parse(storedTransactions!);
        
        expect(parsedStoredAccounts).toHaveLength(0);
        expect(parsedStoredTransactions).toHaveLength(0);

        // Clean up
        unmount();
        cleanup();
        localStorage.clear();
      }),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });
});
