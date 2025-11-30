import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Transaction, CategorySpending, TrendData } from '../types';

/**
 * Custom hook for analytics calculations and data aggregation
 * 
 * Provides:
 * - Monthly income/expense calculations
 * - Net cash flow calculation
 * - Spending by category aggregation
 * - Trend data generation for charts
 * - Recent transactions query
 * 
 * Requirements: 4.2, 4.3, 4.4, 4.5, 3.3, 3.4, 9.1
 */
export function useAnalytics() {
  const { transactions } = useFinance();

  /**
   * Get monthly income for a specific month and year
   * 
   * Requirement 4.2: Display total income for the current month
   */
  const getMonthlyIncome = useMemo(() => {
    return (month: number, year: number): number => {
      return transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transaction.type === 'income' &&
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);
    };
  }, [transactions]);

  /**
   * Get monthly expenses for a specific month and year
   * 
   * Requirement 4.2: Display total expenses for the current month
   */
  const getMonthlyExpenses = useMemo(() => {
    return (month: number, year: number): number => {
      return transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transaction.type === 'expense' &&
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);
    };
  }, [transactions]);

  /**
   * Get net cash flow for a specific month and year
   * Net cash flow = income - expenses
   * 
   * Requirement 4.3: Calculate and display net cash flow (income minus expenses)
   */
  const getNetCashFlow = useMemo(() => {
    return (month: number, year: number): number => {
      const income = getMonthlyIncome(month, year);
      const expenses = getMonthlyExpenses(month, year);
      return income - expenses;
    };
  }, [getMonthlyIncome, getMonthlyExpenses]);

  /**
   * Get spending by category for a date range
   * Only includes expense transactions
   * 
   * Requirements:
   * - 3.3: Calculate and display total spending for each category
   * - 3.4: Include only expense transactions and exclude income transactions
   * - 4.4: Display spending distribution by category
   */
  const getSpendingByCategory = useMemo(() => {
    return (startDate: string, endDate: string): CategorySpending[] => {
      // Filter expense transactions within date range
      const expenseTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return (
          transaction.type === 'expense' &&
          transactionDate >= start &&
          transactionDate <= end
        );
      });

      // Calculate total spending
      const totalSpending = expenseTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Group by category
      const categoryMap = new Map<string, { amount: number; count: number }>();
      
      for (const transaction of expenseTransactions) {
        const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
        categoryMap.set(transaction.category, {
          amount: existing.amount + transaction.amount,
          count: existing.count + 1,
        });
      }

      // Convert to CategorySpending array with percentages
      const categorySpending: CategorySpending[] = Array.from(categoryMap.entries()).map(
        ([category, data]) => ({
          category,
          amount: data.amount,
          percentage: totalSpending > 0 ? (data.amount / totalSpending) * 100 : 0,
          transactionCount: data.count,
        })
      );

      // Sort by amount (highest first)
      categorySpending.sort((a, b) => b.amount - a.amount);

      return categorySpending;
    };
  }, [transactions]);

  /**
   * Get trend data for the past N months
   * Returns income, expenses, and net cash flow for each month
   * 
   * Requirement 9.1: Display line chart showing income and expense trends
   */
  const getTrendData = useMemo(() => {
    return (months: number = 6): TrendData[] => {
      const trendData: TrendData[] = [];
      const currentDate = new Date();

      // Generate data for the past N months
      for (let i = months - 1; i >= 0; i--) {
        const targetDate = new Date(currentDate);
        targetDate.setMonth(currentDate.getMonth() - i);
        
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        
        const income = getMonthlyIncome(month, year);
        const expenses = getMonthlyExpenses(month, year);
        
        trendData.push({
          month: `${year}-${String(month + 1).padStart(2, '0')}`,
          income,
          expenses,
          netCashFlow: income - expenses,
        });
      }

      return trendData;
    };
  }, [getMonthlyIncome, getMonthlyExpenses]);

  /**
   * Get the most recent transactions
   * 
   * Requirement 4.5: Display the most recent transactions across all accounts
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
   * Get current month's income
   */
  const getCurrentMonthIncome = useMemo(() => {
    return (): number => {
      const now = new Date();
      return getMonthlyIncome(now.getMonth(), now.getFullYear());
    };
  }, [getMonthlyIncome]);

  /**
   * Get current month's expenses
   */
  const getCurrentMonthExpenses = useMemo(() => {
    return (): number => {
      const now = new Date();
      return getMonthlyExpenses(now.getMonth(), now.getFullYear());
    };
  }, [getMonthlyExpenses]);

  /**
   * Get current month's net cash flow
   */
  const getCurrentMonthNetCashFlow = useMemo(() => {
    return (): number => {
      const now = new Date();
      return getNetCashFlow(now.getMonth(), now.getFullYear());
    };
  }, [getNetCashFlow]);

  /**
   * Get spending by category for current month
   */
  const getCurrentMonthSpendingByCategory = useMemo(() => {
    return (): CategorySpending[] => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      return getSpendingByCategory(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      );
    };
  }, [getSpendingByCategory]);

  /**
   * Get total income for a date range
   */
  const getTotalIncome = useMemo(() => {
    return (startDate: string, endDate: string): number => {
      return transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          return (
            transaction.type === 'income' &&
            transactionDate >= start &&
            transactionDate <= end
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);
    };
  }, [transactions]);

  /**
   * Get total expenses for a date range
   */
  const getTotalExpenses = useMemo(() => {
    return (startDate: string, endDate: string): number => {
      return transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          return (
            transaction.type === 'expense' &&
            transactionDate >= start &&
            transactionDate <= end
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);
    };
  }, [transactions]);

  return {
    getMonthlyIncome,
    getMonthlyExpenses,
    getNetCashFlow,
    getSpendingByCategory,
    getTrendData,
    getRecentTransactions,
    getCurrentMonthIncome,
    getCurrentMonthExpenses,
    getCurrentMonthNetCashFlow,
    getCurrentMonthSpendingByCategory,
    getTotalIncome,
    getTotalExpenses,
  };
}
