import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Budget, BudgetProgress, BudgetAlert } from '../types';

/**
 * Custom hook for budget operations and progress calculations
 * 
 * Provides:
 * - Budget progress calculation
 * - Budget alert detection (80% warning, 100% alert)
 * - Active budgets query
 * 
 * Requirements: 7.2, 7.3, 7.4, 7.5
 */
export function useBudgets() {
  const { budgets, transactions } = useFinance();

  /**
   * Calculate spending for a specific budget based on its period
   * 
   * Helper function to get transactions within the budget period
   */
  const calculateBudgetSpending = useMemo(() => {
    return (budget: Budget): number => {
      const budgetStartDate = new Date(budget.startDate);
      const now = new Date();

      // Calculate the current period's start and end dates
      let periodStart: Date;
      let periodEnd: Date;

      if (budget.period === 'weekly') {
        // Calculate weeks since budget start
        const weeksSinceStart = Math.floor(
          (now.getTime() - budgetStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        periodStart = new Date(budgetStartDate);
        periodStart.setDate(budgetStartDate.getDate() + weeksSinceStart * 7);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 7);
      } else if (budget.period === 'monthly') {
        // Get current month
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      } else {
        // yearly
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      }

      // Filter expense transactions for this category within the period
      const categoryTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'expense' &&
          transaction.category === budget.category &&
          transactionDate >= periodStart &&
          transactionDate <= periodEnd
        );
      });

      // Sum up the spending
      return categoryTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
    };
  }, [transactions]);

  /**
   * Get budget progress for a specific budget
   * 
   * Requirement 7.2: Calculate spending against budget and display percentage used
   */
  const getBudgetProgress = useMemo(() => {
    return (budgetId: string): BudgetProgress | null => {
      const budget = budgets.find((b) => b.id === budgetId);
      if (!budget) {
        return null;
      }

      const spent = calculateBudgetSpending(budget);
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      // Determine status based on percentage
      // Requirement 7.3: Display warning when spending exceeds 80%
      // Requirement 7.4: Display alert when spending exceeds 100%
      let status: 'safe' | 'warning' | 'exceeded';
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 80) {
        status = 'warning';
      } else {
        status = 'safe';
      }

      return {
        budget,
        spent,
        remaining,
        percentage,
        status,
      };
    };
  }, [budgets, calculateBudgetSpending]);

  /**
   * Get all active budgets
   * A budget is considered active if it has been created
   */
  const getActiveBudgets = useMemo(() => {
    return (): Budget[] => {
      return budgets;
    };
  }, [budgets]);

  /**
   * Get all budget progress data
   */
  const getAllBudgetProgress = useMemo(() => {
    return (): BudgetProgress[] => {
      return budgets
        .map((budget) => getBudgetProgress(budget.id))
        .filter((progress): progress is BudgetProgress => progress !== null);
    };
  }, [budgets, getBudgetProgress]);

  /**
   * Check for budget alerts
   * Returns alerts for budgets that have exceeded thresholds
   * 
   * Requirements:
   * - 7.3: Display warning indicator when spending exceeds 80%
   * - 7.4: Display alert indicator when spending exceeds 100%
   */
  const checkBudgetAlerts = useMemo(() => {
    return (): BudgetAlert[] => {
      const alerts: BudgetAlert[] = [];

      for (const budget of budgets) {
        const progress = getBudgetProgress(budget.id);
        if (!progress) continue;

        // Add alert if percentage >= 80%
        if (progress.percentage >= 100) {
          alerts.push({
            budgetId: budget.id,
            category: budget.category,
            percentage: progress.percentage,
            type: 'exceeded',
          });
        } else if (progress.percentage >= 80) {
          alerts.push({
            budgetId: budget.id,
            category: budget.category,
            percentage: progress.percentage,
            type: 'warning',
          });
        }
      }

      return alerts;
    };
  }, [budgets, getBudgetProgress]);

  /**
   * Get budget by category
   */
  const getBudgetByCategory = useMemo(() => {
    return (category: string): Budget | undefined => {
      return budgets.find((budget) => budget.category === category);
    };
  }, [budgets]);

  /**
   * Check if a budget exists for a category
   */
  const hasBudgetForCategory = useMemo(() => {
    return (category: string): boolean => {
      return budgets.some((budget) => budget.category === category);
    };
  }, [budgets]);

  return {
    getBudgetProgress,
    getActiveBudgets,
    getAllBudgetProgress,
    checkBudgetAlerts,
    getBudgetByCategory,
    hasBudgetForCategory,
  };
}
