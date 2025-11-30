import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  saveAccounts,
  loadAccounts,
  saveTransactions,
  loadTransactions,
  saveBudgets,
  loadBudgets,
  saveGoals,
  loadGoals,
  saveRecurringPatterns,
  loadRecurringPatterns,
  saveAllData,
  loadAllData,
  clearAllData,
  exportTransactionsToCSV,
  exportToJSON,
  importFromJSON,
} from './storage';
import type { Account, Transaction, Budget, Goal, RecurringPattern } from '../types';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Setup localStorage mock
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Generators for property-based testing
const accountTypeArb = fc.constantFrom('checking', 'savings', 'credit', 'investment');
const transactionTypeArb = fc.constantFrom('income', 'expense');
const budgetPeriodArb = fc.constantFrom('weekly', 'monthly', 'yearly');
const goalStatusArb = fc.constantFrom('active', 'achieved', 'overdue');
const frequencyArb = fc.constantFrom('daily', 'weekly', 'monthly', 'yearly');

// Generate valid ISO date strings within a reasonable range (past 2 years to future 2 years)
const dateArb = fc
  .integer({ min: new Date('2023-01-01').getTime(), max: new Date('2027-12-31').getTime() })
  .map((timestamp) => new Date(timestamp).toISOString());

// Generate valid account
const accountArb: fc.Arbitrary<Account> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  type: accountTypeArb,
  initialBalance: fc.double({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
  currency: fc.constant('USD'),
  createdAt: dateArb,
  updatedAt: dateArb,
});

// Generate valid transaction (avoiding -0 and handling optional fields for JSON serialization)
const transactionArb: fc.Arbitrary<Transaction> = fc
  .record({
    id: fc.uuid(),
    accountId: fc.uuid(),
    amount: fc.double({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
    description: fc.string({ minLength: 1, maxLength: 100 }),
    category: fc.constantFrom('groceries', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'dining', 'other'),
    date: dateArb,
    type: transactionTypeArb,
    isRecurring: fc.boolean(),
    recurringId: fc.option(fc.uuid(), { nil: undefined }),
    createdAt: dateArb,
    updatedAt: dateArb,
  })
  .map((t) => {
    // Remove undefined recurringId to match JSON serialization behavior
    if (t.recurringId === undefined) {
      const { recurringId, ...rest } = t;
      return rest as Transaction;
    }
    return t;
  });

// Generate valid budget
const budgetArb: fc.Arbitrary<Budget> = fc.record({
  id: fc.uuid(),
  category: fc.constantFrom('groceries', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'dining', 'other'),
  amount: fc.double({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
  period: budgetPeriodArb,
  startDate: dateArb,
  createdAt: dateArb,
  updatedAt: dateArb,
});

// Generate valid goal
const goalArb: fc.Arbitrary<Goal> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  targetAmount: fc.double({ min: 0, max: 100000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
  currentAmount: fc.double({ min: 0, max: 100000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
  deadline: dateArb,
  status: goalStatusArb,
  createdAt: dateArb,
  updatedAt: dateArb,
});

// Generate valid recurring pattern (avoiding -0 and handling optional fields for JSON serialization)
const recurringPatternArb: fc.Arbitrary<RecurringPattern> = fc
  .record({
    id: fc.uuid(),
    accountId: fc.uuid(),
    amount: fc.double({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true }).filter(n => !Object.is(n, -0)),
    description: fc.string({ minLength: 1, maxLength: 100 }),
    category: fc.constantFrom('groceries', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'dining', 'other'),
    type: transactionTypeArb,
    frequency: frequencyArb,
    startDate: dateArb,
    lastOccurrence: fc.option(dateArb, { nil: undefined }),
    isActive: fc.boolean(),
    createdAt: dateArb,
  })
  .map((p) => {
    // Remove undefined lastOccurrence to match JSON serialization behavior
    if (p.lastOccurrence === undefined) {
      const { lastOccurrence, ...rest } = p;
      return rest as RecurringPattern;
    }
    return p;
  });

describe('Storage Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    clearAllData();
  });

  // Feature: finance-dashboard, Property 16: Storage round-trip consistency
  describe('Property 16: Storage round-trip consistency', () => {
    it('should preserve accounts through save and load cycle', () => {
      fc.assert(
        fc.property(fc.array(accountArb, { maxLength: 20 }), (accounts) => {
          saveAccounts(accounts);
          const loaded = loadAccounts();
          expect(loaded).toEqual(accounts);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve transactions through save and load cycle', () => {
      fc.assert(
        fc.property(fc.array(transactionArb, { maxLength: 20 }), (transactions) => {
          saveTransactions(transactions);
          const loaded = loadTransactions();
          expect(loaded).toEqual(transactions);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve budgets through save and load cycle', () => {
      fc.assert(
        fc.property(fc.array(budgetArb, { maxLength: 20 }), (budgets) => {
          saveBudgets(budgets);
          const loaded = loadBudgets();
          expect(loaded).toEqual(budgets);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve goals through save and load cycle', () => {
      fc.assert(
        fc.property(fc.array(goalArb, { maxLength: 20 }), (goals) => {
          saveGoals(goals);
          const loaded = loadGoals();
          expect(loaded).toEqual(goals);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve recurring patterns through save and load cycle', () => {
      fc.assert(
        fc.property(fc.array(recurringPatternArb, { maxLength: 20 }), (patterns) => {
          saveRecurringPatterns(patterns);
          const loaded = loadRecurringPatterns();
          expect(loaded).toEqual(patterns);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve all data through saveAllData and loadAllData cycle', () => {
      fc.assert(
        fc.property(
          fc.record({
            accounts: fc.array(accountArb, { maxLength: 10 }),
            transactions: fc.array(transactionArb, { maxLength: 10 }),
            budgets: fc.array(budgetArb, { maxLength: 10 }),
            goals: fc.array(goalArb, { maxLength: 10 }),
            recurringPatterns: fc.array(recurringPatternArb, { maxLength: 10 }),
          }),
          (data) => {
            saveAllData(data);
            const loaded = loadAllData();
            expect(loaded).toEqual(data);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty arrays when no data is stored', () => {
      clearAllData();
      const loaded = loadAllData();
      expect(loaded).toEqual({
        accounts: [],
        transactions: [],
        budgets: [],
        goals: [],
        recurringPatterns: [],
      });
    });
  });

  // Feature: finance-dashboard, Property 17: Corrupted data handling
  describe('Property 17: Corrupted data handling', () => {
    it('should throw ValidationError when loading corrupted account data with invalid JSON', () => {
      fc.assert(
        fc.property(fc.string().filter(s => {
          // Filter out empty strings and valid JSON
          if (s === '') return false;
          try {
            JSON.parse(s);
            return false; // Valid JSON, skip
          } catch {
            return true; // Invalid JSON, use it
          }
        }), (corruptedData) => {
          localStorage.setItem('finance-dashboard-accounts', corruptedData);
          expect(() => loadAccounts()).toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading accounts with invalid structure', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.constant({}),
            fc.string({ minLength: 1 }),
            fc.integer(),
            fc.boolean(),
            fc.array(fc.anything(), { minLength: 1 }) // At least one invalid item
          ),
          (invalidData) => {
            localStorage.setItem('finance-dashboard-accounts', JSON.stringify(invalidData));
            expect(() => loadAccounts()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading transactions with missing required fields', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Missing id
            fc.array(fc.record({
              accountId: fc.uuid(),
              amount: fc.double({ noNaN: true, noDefaultInfinity: true }),
              description: fc.string(),
              category: fc.string(),
              date: dateArb,
              type: transactionTypeArb,
              isRecurring: fc.boolean(),
              createdAt: dateArb,
              updatedAt: dateArb,
            }), { minLength: 1, maxLength: 3 }),
            // Missing accountId
            fc.array(fc.record({
              id: fc.uuid(),
              amount: fc.double({ noNaN: true, noDefaultInfinity: true }),
              description: fc.string(),
              category: fc.string(),
              date: dateArb,
              type: transactionTypeArb,
              isRecurring: fc.boolean(),
              createdAt: dateArb,
              updatedAt: dateArb,
            }), { minLength: 1, maxLength: 3 }),
            // Missing amount
            fc.array(fc.record({
              id: fc.uuid(),
              accountId: fc.uuid(),
              description: fc.string(),
              category: fc.string(),
              date: dateArb,
              type: transactionTypeArb,
              isRecurring: fc.boolean(),
              createdAt: dateArb,
              updatedAt: dateArb,
            }), { minLength: 1, maxLength: 3 }),
            // Wrong type for amount
            fc.array(fc.record({
              id: fc.uuid(),
              accountId: fc.uuid(),
              amount: fc.string(),
              description: fc.string(),
              category: fc.string(),
              date: dateArb,
              type: transactionTypeArb,
              isRecurring: fc.boolean(),
              createdAt: dateArb,
              updatedAt: dateArb,
            }), { minLength: 1, maxLength: 3 })
          ),
          (invalidTransactions) => {
            localStorage.setItem('finance-dashboard-transactions', JSON.stringify(invalidTransactions));
            expect(() => loadTransactions()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading budgets with invalid period values', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              category: fc.string(),
              amount: fc.double({ noNaN: true, noDefaultInfinity: true }),
              period: fc.string().filter(s => !['weekly', 'monthly', 'yearly'].includes(s)),
              startDate: dateArb,
              createdAt: dateArb,
              updatedAt: dateArb,
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (invalidBudgets) => {
            localStorage.setItem('finance-dashboard-budgets', JSON.stringify(invalidBudgets));
            expect(() => loadBudgets()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading goals with invalid status values', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1 }),
              targetAmount: fc.double({ min: 0, noNaN: true, noDefaultInfinity: true }),
              currentAmount: fc.double({ min: 0, noNaN: true, noDefaultInfinity: true }),
              deadline: dateArb,
              status: fc.string().filter(s => !['active', 'achieved', 'overdue'].includes(s)),
              createdAt: dateArb,
              updatedAt: dateArb,
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (invalidGoals) => {
            localStorage.setItem('finance-dashboard-goals', JSON.stringify(invalidGoals));
            expect(() => loadGoals()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading recurring patterns with invalid frequency', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              accountId: fc.uuid(),
              amount: fc.double({ noNaN: true, noDefaultInfinity: true }),
              description: fc.string({ minLength: 1 }),
              category: fc.string(),
              type: transactionTypeArb,
              frequency: fc.string().filter(s => !['daily', 'weekly', 'monthly', 'yearly'].includes(s)),
              startDate: dateArb,
              isActive: fc.boolean(),
              createdAt: dateArb,
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (invalidPatterns) => {
            localStorage.setItem('finance-dashboard-recurring-patterns', JSON.stringify(invalidPatterns));
            expect(() => loadRecurringPatterns()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError when loading accounts with wrong data types', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.oneof(fc.integer(), fc.boolean(), fc.constant(null)), // Wrong type
              type: accountTypeArb,
              initialBalance: fc.double({ noNaN: true, noDefaultInfinity: true }),
              currency: fc.constant('USD'),
              createdAt: dateArb,
              updatedAt: dateArb,
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (invalidAccounts) => {
            localStorage.setItem('finance-dashboard-accounts', JSON.stringify(invalidAccounts));
            expect(() => loadAccounts()).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not crash the application when encountering corrupted data', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('{"invalid": json}'),
            fc.constant('[1, 2, "not an account"]'),
            fc.constant('null'),
            fc.constant('undefined'),
            fc.constant('{broken json'),
            fc.constant('[{"id": 123}]') // Invalid account structure
          ),
          (corruptedData) => {
            localStorage.setItem('finance-dashboard-accounts', corruptedData);
            
            // The function should throw an error but not crash
            let errorThrown = false;
            try {
              loadAccounts();
            } catch (error) {
              errorThrown = true;
              // Verify it's a proper error object
              expect(error).toBeInstanceOf(Error);
            }
            
            // Should always throw for corrupted data
            expect(errorThrown).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: finance-dashboard, Property 35: CSV export format correctness
  describe('Property 35: CSV export format correctness', () => {
    it('should export transactions to valid CSV format with proper headers', () => {
      fc.assert(
        fc.property(
          fc.array(accountArb, { minLength: 1, maxLength: 5 }),
          fc.array(transactionArb, { minLength: 1, maxLength: 20 }),
          (accounts, transactions) => {
            // Link transactions to accounts
            const linkedTransactions = transactions.map((t, i) => ({
              ...t,
              accountId: accounts[i % accounts.length].id,
            }));

            const csv = exportTransactionsToCSV(linkedTransactions, accounts);
            
            // CSV should not be empty
            expect(csv.length).toBeGreaterThan(0);
            
            // CSV should have headers
            const lines = csv.split('\n');
            expect(lines.length).toBeGreaterThan(0);
            
            const headers = lines[0];
            expect(headers).toContain('ID');
            expect(headers).toContain('Date');
            expect(headers).toContain('Account');
            expect(headers).toContain('Description');
            expect(headers).toContain('Category');
            expect(headers).toContain('Type');
            expect(headers).toContain('Amount');
            
            // Should have correct number of rows (header + transactions)
            expect(lines.length).toBe(linkedTransactions.length + 1);
            
            // Each transaction row should contain the transaction data
            for (let i = 0; i < linkedTransactions.length; i++) {
              const transaction = linkedTransactions[i];
              const row = lines[i + 1];
              
              // Row should contain transaction ID
              expect(row).toContain(transaction.id);
              // Row should contain transaction type
              expect(row).toContain(transaction.type);
              // Row should contain transaction category
              expect(row).toContain(transaction.category);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should properly escape CSV fields containing commas', () => {
      const accounts: Account[] = [{
        id: 'acc-1',
        name: 'Test Account',
        type: 'checking',
        initialBalance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }];

      const transactions: Transaction[] = [{
        id: 'txn-1',
        accountId: 'acc-1',
        amount: 100,
        description: 'Groceries, milk, bread',
        category: 'groceries',
        date: '2024-01-01T00:00:00.000Z',
        type: 'expense',
        isRecurring: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }];

      const csv = exportTransactionsToCSV(transactions, accounts);
      
      // Field with comma should be wrapped in quotes
      expect(csv).toContain('"Groceries, milk, bread"');
    });

    it('should properly escape CSV fields containing quotes', () => {
      const accounts: Account[] = [{
        id: 'acc-1',
        name: 'Test Account',
        type: 'checking',
        initialBalance: 1000,
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }];

      const transactions: Transaction[] = [{
        id: 'txn-1',
        accountId: 'acc-1',
        amount: 100,
        description: 'Payment for "special" item',
        category: 'shopping',
        date: '2024-01-01T00:00:00.000Z',
        type: 'expense',
        isRecurring: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }];

      const csv = exportTransactionsToCSV(transactions, accounts);
      
      // Quotes should be escaped as double quotes
      expect(csv).toContain('""special""');
    });

    it('should handle empty transaction list', () => {
      const accounts: Account[] = [];
      const transactions: Transaction[] = [];

      const csv = exportTransactionsToCSV(transactions, accounts);
      
      // Should still have headers
      const lines = csv.split('\n');
      expect(lines.length).toBe(1);
      expect(lines[0]).toContain('ID');
    });

    it('should include account name in CSV output', () => {
      fc.assert(
        fc.property(
          fc.array(accountArb, { minLength: 1, maxLength: 5 }),
          fc.array(transactionArb, { minLength: 1, maxLength: 10 }),
          (accounts, transactions) => {
            // Link transactions to accounts
            const linkedTransactions = transactions.map((t, i) => ({
              ...t,
              accountId: accounts[i % accounts.length].id,
            }));

            const csv = exportTransactionsToCSV(linkedTransactions, accounts);
            
            // Parse CSV to verify account names are present
            const lines = csv.split('\n');
            const dataRows = lines.slice(1); // Skip header
            
            // For each transaction, verify its account name appears in the corresponding row
            for (let i = 0; i < linkedTransactions.length; i++) {
              const transaction = linkedTransactions[i];
              const account = accounts.find(a => a.id === transaction.accountId);
              const row = dataRows[i];
              
              if (account) {
                // The row should contain either the raw account name or the escaped version
                // Account name might be escaped if it contains special characters
                const hasRawName = row.includes(account.name);
                const hasEscapedName = row.includes(`"${account.name.replace(/"/g, '""')}"`);
                
                expect(hasRawName || hasEscapedName).toBe(true);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: finance-dashboard, Property 33: Export data completeness
  describe('Property 33: Export data completeness', () => {
    it('should export all data types to JSON without data loss', () => {
      fc.assert(
        fc.property(
          fc.record({
            accounts: fc.array(accountArb, { maxLength: 10 }),
            transactions: fc.array(transactionArb, { maxLength: 10 }),
            budgets: fc.array(budgetArb, { maxLength: 10 }),
            goals: fc.array(goalArb, { maxLength: 10 }),
            recurringPatterns: fc.array(recurringPatternArb, { maxLength: 10 }),
          }),
          (data) => {
            const json = exportToJSON(data);
            
            // Should be valid JSON
            expect(() => JSON.parse(json)).not.toThrow();
            
            const parsed = JSON.parse(json);
            
            // Should contain all data types
            expect(parsed.accounts).toEqual(data.accounts);
            expect(parsed.transactions).toEqual(data.transactions);
            expect(parsed.budgets).toEqual(data.budgets);
            expect(parsed.goals).toEqual(data.goals);
            expect(parsed.recurringPatterns).toEqual(data.recurringPatterns);
            
            // Should include metadata
            expect(parsed.exportDate).toBeDefined();
            expect(parsed.version).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: finance-dashboard, Property 34: Import data integrity
  describe('Property 34: Import data integrity', () => {
    it('should import valid JSON data correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            accounts: fc.array(accountArb, { maxLength: 10 }),
            transactions: fc.array(transactionArb, { maxLength: 10 }),
            budgets: fc.array(budgetArb, { maxLength: 10 }),
            goals: fc.array(goalArb, { maxLength: 10 }),
            recurringPatterns: fc.array(recurringPatternArb, { maxLength: 10 }),
          }),
          (data) => {
            const json = exportToJSON(data);
            const imported = importFromJSON(json);
            
            // Should preserve all data
            expect(imported.accounts).toEqual(data.accounts);
            expect(imported.transactions).toEqual(data.transactions);
            expect(imported.budgets).toEqual(data.budgets);
            expect(imported.goals).toEqual(data.goals);
            expect(imported.recurringPatterns).toEqual(data.recurringPatterns);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw ValidationError for invalid import data', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('{"invalid": "data"}'),
            fc.constant('[]'),
            fc.constant('null'),
            fc.constant('{"accounts": "not an array"}')
          ),
          (invalidJson) => {
            expect(() => importFromJSON(invalidJson)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
