import { useCallback, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { RecurringPattern, Transaction } from '../types';

/**
 * Custom hook for recurring transaction operations
 * 
 * Provides:
 * - Transaction generation logic based on frequency
 * - Due transaction detection
 * - Pattern management functions
 * 
 * Requirements: 12.2, 12.3
 */
export function useRecurring() {
  const {
    recurringPatterns,
    transactions,
    addTransaction,
    updateRecurringPattern,
  } = useFinance();

  /**
   * Calculate the next occurrence date based on frequency
   */
  const getNextOccurrence = useCallback((date: Date, frequency: RecurringPattern['frequency']): Date => {
    const next = new Date(date);
    
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next;
  }, []);

  /**
   * Get all active recurring patterns
   */
  const getActivePatterns = useCallback((): RecurringPattern[] => {
    return recurringPatterns.filter((pattern) => pattern.isActive);
  }, [recurringPatterns]);

  /**
   * Check if a pattern has due transactions
   */
  const isDue = useCallback((pattern: RecurringPattern, currentDate: Date = new Date()): boolean => {
    if (!pattern.isActive) {
      return false;
    }

    // If no lastOccurrence, check if startDate is due
    if (!pattern.lastOccurrence) {
      return new Date(pattern.startDate) <= currentDate;
    }
    
    // Otherwise, check if next occurrence after lastOccurrence is due
    const lastOccurrence = new Date(pattern.lastOccurrence);
    const nextDue = getNextOccurrence(lastOccurrence, pattern.frequency);
    
    return nextDue <= currentDate;
  }, [getNextOccurrence]);

  /**
   * Generate a single transaction from a recurring pattern
   */
  const generateTransaction = useCallback((
    pattern: RecurringPattern,
    date: Date
  ): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      accountId: pattern.accountId,
      amount: pattern.amount,
      description: pattern.description,
      category: pattern.category,
      date: date.toISOString(),
      type: pattern.type,
      isRecurring: true,
      recurringId: pattern.id,
    };
  }, []);

  /**
   * Generate all due transactions for a pattern
   * 
   * Requirement 12.2: Generate due recurring transactions based on last occurrence
   * Requirement 12.3: Create new transaction instances automatically
   */
  const generateDueTransactionsForPattern = useCallback((
    pattern: RecurringPattern,
    currentDate: Date = new Date()
  ): void => {
    if (!pattern.isActive) {
      return;
    }

    // If no lastOccurrence, start from the startDate itself
    // Otherwise, start from the next occurrence after lastOccurrence
    let nextDue: Date;
    if (!pattern.lastOccurrence) {
      nextDue = new Date(pattern.startDate);
    } else {
      const lastOccurrence = new Date(pattern.lastOccurrence);
      nextDue = getNextOccurrence(lastOccurrence, pattern.frequency);
    }
    
    let latestOccurrence: Date | null = null;

    // Generate all due transactions up to current date
    while (nextDue <= currentDate) {
      const transactionData = generateTransaction(pattern, nextDue);
      addTransaction(transactionData);
      
      latestOccurrence = nextDue;
      nextDue = getNextOccurrence(nextDue, pattern.frequency);
    }

    // Update the pattern's lastOccurrence if we generated any transactions
    if (latestOccurrence) {
      updateRecurringPattern(pattern.id, {
        lastOccurrence: latestOccurrence.toISOString(),
      });
    }
  }, [getNextOccurrence, generateTransaction, addTransaction, updateRecurringPattern]);

  /**
   * Generate all due transactions for all active patterns
   * 
   * Requirement 12.2: When application loads, generate due recurring transactions
   */
  const generateDueTransactions = useCallback((currentDate: Date = new Date()): void => {
    const activePatterns = getActivePatterns();
    
    activePatterns.forEach((pattern) => {
      if (isDue(pattern, currentDate)) {
        generateDueTransactionsForPattern(pattern, currentDate);
      }
    });
  }, [getActivePatterns, isDue, generateDueTransactionsForPattern]);

  /**
   * Get all transactions for a specific recurring pattern
   */
  const getTransactionsForPattern = useCallback((patternId: string): Transaction[] => {
    return transactions.filter((transaction) => transaction.recurringId === patternId);
  }, [transactions]);

  /**
   * Get the next scheduled date for a pattern
   */
  const getNextScheduledDate = useCallback((pattern: RecurringPattern): Date | null => {
    if (!pattern.isActive) {
      return null;
    }

    const lastOccurrence = pattern.lastOccurrence 
      ? new Date(pattern.lastOccurrence)
      : new Date(pattern.startDate);
    
    return getNextOccurrence(lastOccurrence, pattern.frequency);
  }, [getNextOccurrence]);

  /**
   * Get all patterns that are due
   */
  const getDuePatterns = useMemo(() => {
    return (currentDate: Date = new Date()): RecurringPattern[] => {
      return getActivePatterns().filter((pattern) => isDue(pattern, currentDate));
    };
  }, [getActivePatterns, isDue]);

  /**
   * Get count of due patterns
   */
  const getDuePatternCount = useMemo(() => {
    return (currentDate: Date = new Date()): number => {
      return getDuePatterns(currentDate).length;
    };
  }, [getDuePatterns]);

  return {
    generateDueTransactions,
    generateDueTransactionsForPattern,
    getActivePatterns,
    getTransactionsForPattern,
    getNextScheduledDate,
    getDuePatterns,
    getDuePatternCount,
    isDue,
  };
}
