import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Account, AccountWithBalance } from '../types';

/**
 * Custom hook for account operations and balance calculations
 * 
 * Provides:
 * - Balance calculation for individual accounts
 * - Total balance aggregation across all accounts
 * - Helper functions for account queries
 * 
 * Requirements: 1.2, 1.5, 2.2
 */
export function useAccounts() {
  const { accounts, transactions } = useFinance();

  /**
   * Calculate the current balance for a specific account
   * Balance = initialBalance + sum(income transactions) - sum(expense transactions)
   * 
   * Requirement 2.2: Account balance updates based on transactions
   */
  const calculateBalance = useMemo(() => {
    return (accountId: string): number => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) {
        return 0;
      }

      // Start with initial balance
      let balance = account.initialBalance;

      // Add/subtract all transactions for this account
      const accountTransactions = transactions.filter((t) => t.accountId === accountId);
      
      for (const transaction of accountTransactions) {
        if (transaction.type === 'income') {
          balance += transaction.amount;
        } else if (transaction.type === 'expense') {
          balance -= transaction.amount;
        }
      }

      return balance;
    };
  }, [accounts, transactions]);

  /**
   * Get total balance across all accounts
   * 
   * Requirement 1.5: Calculate and display total balance across all accounts
   */
  const getTotalBalance = useMemo(() => {
    return (): number => {
      return accounts.reduce((total, account) => {
        return total + calculateBalance(account.id);
      }, 0);
    };
  }, [accounts, calculateBalance]);

  /**
   * Get an account with its calculated balance
   * 
   * Requirement 1.2: Display account name, current balance, and account type
   */
  const getAccountWithBalance = useMemo(() => {
    return (accountId: string): AccountWithBalance | null => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) {
        return null;
      }

      return {
        ...account,
        balance: calculateBalance(accountId),
      };
    };
  }, [accounts, calculateBalance]);

  /**
   * Get all accounts with their calculated balances
   * 
   * Requirement 1.2: Display account information with balances
   */
  const getAllAccountsWithBalances = useMemo(() => {
    return (): AccountWithBalance[] => {
      return accounts.map((account) => ({
        ...account,
        balance: calculateBalance(account.id),
      }));
    };
  }, [accounts, calculateBalance]);

  /**
   * Get accounts by type
   */
  const getAccountsByType = useMemo(() => {
    return (type: Account['type']): Account[] => {
      return accounts.filter((account) => account.type === type);
    };
  }, [accounts]);

  /**
   * Check if an account exists
   */
  const accountExists = useMemo(() => {
    return (accountId: string): boolean => {
      return accounts.some((account) => account.id === accountId);
    };
  }, [accounts]);

  return {
    calculateBalance,
    getTotalBalance,
    getAccountWithBalance,
    getAllAccountsWithBalances,
    getAccountsByType,
    accountExists,
  };
}
