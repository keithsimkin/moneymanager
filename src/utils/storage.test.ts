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
Object.defineProperty(global, 'localStorage', {
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

describe('Storage Round-Trip Property Tests', () => {
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
});
