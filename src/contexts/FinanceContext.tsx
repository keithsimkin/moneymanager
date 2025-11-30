import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  Account,
  Transaction,
  Budget,
  Goal,
  RecurringPattern,
  FinanceContextType,
} from '../types';
import {
  loadAllData,
  saveAccounts,
  saveTransactions,
  saveBudgets,
  saveGoals,
  saveRecurringPatterns,
  exportToJSON,
  importFromJSON,
  exportTransactionsToCSV,
  StorageError,
  ValidationError,
} from '../utils/storage';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: ReactNode;
}

// Helper function to generate UUID
function generateId(): string {
  return crypto.randomUUID();
}

// Helper function to get current ISO timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  // State for all data types
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<RecurringPattern[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    try {
      const data = loadAllData();
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      setBudgets(data.budgets);
      setGoals(data.goals);
      setRecurringPatterns(data.recurringPatterns);
      setIsLoaded(true);
    } catch (error) {
      if (error instanceof StorageError || error instanceof ValidationError) {
        console.error('Failed to load data from storage:', error);
        // Initialize with empty state on error
        setAccounts([]);
        setTransactions([]);
        setBudgets([]);
        setGoals([]);
        setRecurringPatterns([]);
        setIsLoaded(true);
      } else {
        throw error;
      }
    }
  }, []);

  // Account operations
  const addAccount = useCallback((accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    setAccounts((prev) => {
      const updated = [...prev, newAccount];
      saveAccounts(updated);
      return updated;
    });
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setAccounts((prev) => {
      const updated = prev.map((account) =>
        account.id === id
          ? { ...account, ...updates, updatedAt: getCurrentTimestamp() }
          : account
      );
      saveAccounts(updated);
      return updated;
    });
  }, []);

  const deleteAccount = useCallback((id: string) => {
    // Delete account and all associated transactions
    setAccounts((prev) => {
      const updated = prev.filter((account) => account.id !== id);
      saveAccounts(updated);
      return updated;
    });

    setTransactions((prev) => {
      const updated = prev.filter((transaction) => transaction.accountId !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  // Transaction operations
  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    setTransactions((prev) => {
      const updated = [...prev, newTransaction];
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => {
      const updated = prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates, updatedAt: getCurrentTimestamp() }
          : transaction
      );
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((transaction) => transaction.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  // Budget operations
  const addBudget = useCallback((budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    setBudgets((prev) => {
      const updated = [...prev, newBudget];
      saveBudgets(updated);
      return updated;
    });
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setBudgets((prev) => {
      const updated = prev.map((budget) =>
        budget.id === id
          ? { ...budget, ...updates, updatedAt: getCurrentTimestamp() }
          : budget
      );
      saveBudgets(updated);
      return updated;
    });
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => {
      const updated = prev.filter((budget) => budget.id !== id);
      saveBudgets(updated);
      return updated;
    });
  }, []);

  // Goal operations
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    setGoals((prev) => {
      const updated = [...prev, newGoal];
      saveGoals(updated);
      return updated;
    });
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => {
      const updated = prev.map((goal) =>
        goal.id === id
          ? { ...goal, ...updates, updatedAt: getCurrentTimestamp() }
          : goal
      );
      saveGoals(updated);
      return updated;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => {
      const updated = prev.filter((goal) => goal.id !== id);
      saveGoals(updated);
      return updated;
    });
  }, []);

  // Recurring pattern operations
  const addRecurringPattern = useCallback((patternData: Omit<RecurringPattern, 'id' | 'createdAt'>) => {
    const newPattern: RecurringPattern = {
      ...patternData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };

    setRecurringPatterns((prev) => {
      const updated = [...prev, newPattern];
      saveRecurringPatterns(updated);
      return updated;
    });
  }, []);

  const updateRecurringPattern = useCallback((id: string, updates: Partial<RecurringPattern>) => {
    setRecurringPatterns((prev) => {
      const updated = prev.map((pattern) =>
        pattern.id === id ? { ...pattern, ...updates } : pattern
      );
      saveRecurringPatterns(updated);
      return updated;
    });
  }, []);

  const deleteRecurringPattern = useCallback((id: string) => {
    setRecurringPatterns((prev) => {
      const updated = prev.filter((pattern) => pattern.id !== id);
      saveRecurringPatterns(updated);
      return updated;
    });
  }, []);

  // Export/Import operations
  const exportData = useCallback((): string => {
    return exportToJSON({
      accounts,
      transactions,
      budgets,
      goals,
      recurringPatterns,
    });
  }, [accounts, transactions, budgets, goals, recurringPatterns]);

  const exportTransactionsCSV = useCallback((): string => {
    return exportTransactionsToCSV(transactions, accounts);
  }, [transactions, accounts]);

  const importData = useCallback((data: string, strategy: 'merge' | 'replace') => {
    try {
      const importedData = importFromJSON(data);

      if (strategy === 'replace') {
        // Replace all data
        setAccounts(importedData.accounts);
        setTransactions(importedData.transactions);
        setBudgets(importedData.budgets);
        setGoals(importedData.goals);
        setRecurringPatterns(importedData.recurringPatterns);

        // Save to storage
        saveAccounts(importedData.accounts);
        saveTransactions(importedData.transactions);
        saveBudgets(importedData.budgets);
        saveGoals(importedData.goals);
        saveRecurringPatterns(importedData.recurringPatterns);
      } else {
        // Merge data (add new items, keep existing)
        setAccounts((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newAccounts = importedData.accounts.filter((a) => !existingIds.has(a.id));
          const updated = [...prev, ...newAccounts];
          saveAccounts(updated);
          return updated;
        });

        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newTransactions = importedData.transactions.filter((t) => !existingIds.has(t.id));
          const updated = [...prev, ...newTransactions];
          saveTransactions(updated);
          return updated;
        });

        setBudgets((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const newBudgets = importedData.budgets.filter((b) => !existingIds.has(b.id));
          const updated = [...prev, ...newBudgets];
          saveBudgets(updated);
          return updated;
        });

        setGoals((prev) => {
          const existingIds = new Set(prev.map((g) => g.id));
          const newGoals = importedData.goals.filter((g) => !existingIds.has(g.id));
          const updated = [...prev, ...newGoals];
          saveGoals(updated);
          return updated;
        });

        setRecurringPatterns((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPatterns = importedData.recurringPatterns.filter((p) => !existingIds.has(p.id));
          const updated = [...prev, ...newPatterns];
          saveRecurringPatterns(updated);
          return updated;
        });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Error(`Import failed: ${error.message}`);
      }
      throw error;
    }
  }, []);

  const value: FinanceContextType = {
    accounts,
    transactions,
    budgets,
    goals,
    recurringPatterns,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    addRecurringPattern,
    updateRecurringPattern,
    deleteRecurringPattern,
    exportData,
    exportTransactionsCSV,
    importData,
  };

  // Don't render children until data is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
