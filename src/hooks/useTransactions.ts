import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Transaction, FilterOptions } from '../types';

/**
 * Custom hook for transaction operations, filtering, and queries
 * 
 * Provides:
 * - Transaction filtering by search term, date range, category, account, and type
 * - Sorting by date
 * - Helper functions for transaction queries
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function useTransactions() {
  const { transactions } = useFinance();

  /**
   * Filter transactions based on multiple criteria
   * 
   * Requirements:
   * - 6.1: Search by description (case-insensitive)
   * - 6.2: Filter by date range
   * - 6.3: Apply multiple filters (all criteria must match)
   * - 6.4: Clear filters returns all transactions
   * - 6.5: Maintain chronological order by date
   */
  const filterTransactions = useMemo(() => {
    return (filters: FilterOptions = {}): Transaction[] => {
      let filtered = [...transactions];

      // Requirement 6.1: Filter by search term (case-insensitive)
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        filtered = filtered.filter((transaction) =>
          transaction.description.toLowerCase().includes(searchLower)
        );
      }

      // Requirement 6.2: Filter by date range
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate;
        });
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate <= endDate;
        });
      }

      // Filter by category
      if (filters.category && filters.category.trim() !== '') {
        filtered = filtered.filter((transaction) =>
          transaction.category === filters.category
        );
      }

      // Filter by account
      if (filters.accountId && filters.accountId.trim() !== '') {
        filtered = filtered.filter((transaction) =>
          transaction.accountId === filters.accountId
        );
      }

      // Filter by type (income/expense)
      if (filters.type) {
        filtered = filtered.filter((transaction) =>
          transaction.type === filters.type
        );
      }

      // Requirement 6.5: Sort by date (most recent first)
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      return filtered;
    };
  }, [transactions]);

  /**
   * Get transactions for a specific account
   */
  const getTransactionsByAccount = useMemo(() => {
    return (accountId: string): Transaction[] => {
      return filterTransactions({ accountId });
    };
  }, [filterTransactions]);

  /**
   * Get transactions within a date range
   */
  const getTransactionsByDateRange = useMemo(() => {
    return (startDate: string, endDate: string): Transaction[] => {
      return filterTransactions({ startDate, endDate });
    };
  }, [filterTransactions]);

  /**
   * Get the most recent transactions
   * 
   * Requirement 4.5: Display most recent transactions
   */
  const getRecentTransactions = useMemo(() => {
    return (limit: number = 10): Transaction[] => {
      const sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      return sorted.slice(0, limit);
    };
  }, [transactions]);

  /**
   * Get transactions by category
   */
  const getTransactionsByCategory = useMemo(() => {
    return (category: string): Transaction[] => {
      return filterTransactions({ category });
    };
  }, [filterTransactions]);

  /**
   * Get transactions by type (income or expense)
   */
  const getTransactionsByType = useMemo(() => {
    return (type: 'income' | 'expense'): Transaction[] => {
      return filterTransactions({ type });
    };
  }, [filterTransactions]);

  /**
   * Get all income transactions
   */
  const getIncomeTransactions = useMemo(() => {
    return (): Transaction[] => {
      return transactions.filter((t) => t.type === 'income');
    };
  }, [transactions]);

  /**
   * Get all expense transactions
   */
  const getExpenseTransactions = useMemo(() => {
    return (): Transaction[] => {
      return transactions.filter((t) => t.type === 'expense');
    };
  }, [transactions]);

  /**
   * Get total count of transactions
   */
  const getTransactionCount = useMemo(() => {
    return (filters?: FilterOptions): number => {
      if (filters) {
        return filterTransactions(filters).length;
      }
      return transactions.length;
    };
  }, [transactions, filterTransactions]);

  /**
   * Check if a transaction exists
   */
  const transactionExists = useMemo(() => {
    return (transactionId: string): boolean => {
      return transactions.some((transaction) => transaction.id === transactionId);
    };
  }, [transactions]);

  /**
   * Get a single transaction by ID
   */
  const getTransactionById = useMemo(() => {
    return (transactionId: string): Transaction | undefined => {
      return transactions.find((transaction) => transaction.id === transactionId);
    };
  }, [transactions]);

  return {
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
  };
}
