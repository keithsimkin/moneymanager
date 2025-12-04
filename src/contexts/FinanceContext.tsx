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
  saveAccounts as saveAccountsLocal,
  saveTransactions as saveTransactionsLocal,
  saveBudgets as saveBudgetsLocal,
  saveGoals as saveGoalsLocal,
  saveRecurringPatterns as saveRecurringPatternsLocal,
  exportToJSON,
  importFromJSON,
  exportTransactionsToCSV,
  StorageError,
  ValidationError,
} from '../utils/storage';
import {
  fetchAllFromSupabase,
  createAccount as createAccountSupabase,
  updateAccount as updateAccountSupabase,
  deleteAccount as deleteAccountSupabase,
  createTransaction as createTransactionSupabase,
  updateTransaction as updateTransactionSupabase,
  deleteTransaction as deleteTransactionSupabase,
  createBudget as createBudgetSupabase,
  updateBudget as updateBudgetSupabase,
  deleteBudget as deleteBudgetSupabase,
  createGoal as createGoalSupabase,
  updateGoal as updateGoalSupabase,
  deleteGoal as deleteGoalSupabase,
  createRecurringPattern as createRecurringPatternSupabase,
  updateRecurringPattern as updateRecurringPatternSupabase,
  deleteRecurringPattern as deleteRecurringPatternSupabase,
} from '../utils/supabaseStorage';
import { useStorage } from './StorageContext';
import { useAuth } from './AuthContext';

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
  const { storageMode } = useStorage();
  const { user } = useAuth();
  
  // State for all data types
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<RecurringPattern[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount or when storage mode changes
  useEffect(() => {
    async function loadData() {
      try {
        if (storageMode === 'supabase' && user) {
          // Load from Supabase
          const data = await fetchAllFromSupabase();
          setAccounts(data.accounts);
          setTransactions(data.transactions);
          setBudgets(data.budgets);
          setGoals(data.goals);
          setRecurringPatterns(data.recurringPatterns);
        } else {
          // Load from localStorage
          const data = loadAllData();
          setAccounts(data.accounts);
          setTransactions(data.transactions);
          setBudgets(data.budgets);
          setGoals(data.goals);
          setRecurringPatterns(data.recurringPatterns);
        }
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
          console.error('Error loading data:', error);
          setIsLoaded(true);
        }
      }
    }
    loadData();
  }, [storageMode, user]);

  // Account operations
  const addAccount = useCallback(async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    if (storageMode === 'supabase' && user) {
      await createAccountSupabase(newAccount);
      setAccounts((prev) => [...prev, newAccount]);
    } else {
      setAccounts((prev) => {
        const updated = [...prev, newAccount];
        saveAccountsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const updateAccount = useCallback(async (id: string, updates: Partial<Account>) => {
    const updatedData = { ...updates, updatedAt: getCurrentTimestamp() };
    
    if (storageMode === 'supabase' && user) {
      await updateAccountSupabase(id, updatedData);
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === id ? { ...account, ...updatedData } : account
        )
      );
    } else {
      setAccounts((prev) => {
        const updated = prev.map((account) =>
          account.id === id ? { ...account, ...updatedData } : account
        );
        saveAccountsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const deleteAccount = useCallback(async (id: string) => {
    if (storageMode === 'supabase' && user) {
      await deleteAccountSupabase(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      setTransactions((prev) => prev.filter((transaction) => transaction.accountId !== id));
    } else {
      setAccounts((prev) => {
        const updated = prev.filter((account) => account.id !== id);
        saveAccountsLocal(updated);
        return updated;
      });
      setTransactions((prev) => {
        const updated = prev.filter((transaction) => transaction.accountId !== id);
        saveTransactionsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  // Transaction operations
  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    if (storageMode === 'supabase' && user) {
      await createTransactionSupabase(newTransaction);
      setTransactions((prev) => [...prev, newTransaction]);
    } else {
      setTransactions((prev) => {
        const updated = [...prev, newTransaction];
        saveTransactionsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    const updatedData = { ...updates, updatedAt: getCurrentTimestamp() };
    
    if (storageMode === 'supabase' && user) {
      await updateTransactionSupabase(id, updatedData);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { ...transaction, ...updatedData } : transaction
        )
      );
    } else {
      setTransactions((prev) => {
        const updated = prev.map((transaction) =>
          transaction.id === id ? { ...transaction, ...updatedData } : transaction
        );
        saveTransactionsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (storageMode === 'supabase' && user) {
      await deleteTransactionSupabase(id);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } else {
      setTransactions((prev) => {
        const updated = prev.filter((transaction) => transaction.id !== id);
        saveTransactionsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  // Budget operations
  const addBudget = useCallback(async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    if (storageMode === 'supabase' && user) {
      await createBudgetSupabase(newBudget);
      setBudgets((prev) => [...prev, newBudget]);
    } else {
      setBudgets((prev) => {
        const updated = [...prev, newBudget];
        saveBudgetsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const updateBudget = useCallback(async (id: string, updates: Partial<Budget>) => {
    const updatedData = { ...updates, updatedAt: getCurrentTimestamp() };
    
    if (storageMode === 'supabase' && user) {
      await updateBudgetSupabase(id, updatedData);
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.id === id ? { ...budget, ...updatedData } : budget
        )
      );
    } else {
      setBudgets((prev) => {
        const updated = prev.map((budget) =>
          budget.id === id ? { ...budget, ...updatedData } : budget
        );
        saveBudgetsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const deleteBudget = useCallback(async (id: string) => {
    if (storageMode === 'supabase' && user) {
      await deleteBudgetSupabase(id);
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    } else {
      setBudgets((prev) => {
        const updated = prev.filter((budget) => budget.id !== id);
        saveBudgetsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  // Goal operations
  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    if (storageMode === 'supabase' && user) {
      await createGoalSupabase(newGoal);
      setGoals((prev) => [...prev, newGoal]);
    } else {
      setGoals((prev) => {
        const updated = [...prev, newGoal];
        saveGoalsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const updatedData = { ...updates, updatedAt: getCurrentTimestamp() };
    
    if (storageMode === 'supabase' && user) {
      await updateGoalSupabase(id, updatedData);
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id ? { ...goal, ...updatedData } : goal
        )
      );
    } else {
      setGoals((prev) => {
        const updated = prev.map((goal) =>
          goal.id === id ? { ...goal, ...updatedData } : goal
        );
        saveGoalsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const deleteGoal = useCallback(async (id: string) => {
    if (storageMode === 'supabase' && user) {
      await deleteGoalSupabase(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } else {
      setGoals((prev) => {
        const updated = prev.filter((goal) => goal.id !== id);
        saveGoalsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  // Recurring pattern operations
  const addRecurringPattern = useCallback(async (patternData: Omit<RecurringPattern, 'id' | 'createdAt'>) => {
    const newPattern: RecurringPattern = {
      ...patternData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };

    if (storageMode === 'supabase' && user) {
      await createRecurringPatternSupabase(newPattern);
      setRecurringPatterns((prev) => [...prev, newPattern]);
    } else {
      setRecurringPatterns((prev) => {
        const updated = [...prev, newPattern];
        saveRecurringPatternsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const updateRecurringPattern = useCallback(async (id: string, updates: Partial<RecurringPattern>) => {
    if (storageMode === 'supabase' && user) {
      await updateRecurringPatternSupabase(id, updates);
      setRecurringPatterns((prev) =>
        prev.map((pattern) =>
          pattern.id === id ? { ...pattern, ...updates } : pattern
        )
      );
    } else {
      setRecurringPatterns((prev) => {
        const updated = prev.map((pattern) =>
          pattern.id === id ? { ...pattern, ...updates } : pattern
        );
        saveRecurringPatternsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

  const deleteRecurringPattern = useCallback(async (id: string) => {
    if (storageMode === 'supabase' && user) {
      await deleteRecurringPatternSupabase(id);
      setRecurringPatterns((prev) => prev.filter((pattern) => pattern.id !== id));
    } else {
      setRecurringPatterns((prev) => {
        const updated = prev.filter((pattern) => pattern.id !== id);
        saveRecurringPatternsLocal(updated);
        return updated;
      });
    }
  }, [storageMode, user]);

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

  const importData = useCallback(
    (data: string, strategy: 'merge' | 'replace') => {
      try {
        const importedData = importFromJSON(data);

        if (strategy === 'replace') {
          // Replace all data
          setAccounts(importedData.accounts);
          setTransactions(importedData.transactions);
          setBudgets(importedData.budgets);
          setGoals(importedData.goals);
          setRecurringPatterns(importedData.recurringPatterns);

          // Save to localStorage only (Supabase mode will reload from cloud)
          if (storageMode === 'local') {
            saveAccountsLocal(importedData.accounts);
            saveTransactionsLocal(importedData.transactions);
            saveBudgetsLocal(importedData.budgets);
            saveGoalsLocal(importedData.goals);
            saveRecurringPatternsLocal(importedData.recurringPatterns);
          }
        } else {
          // Merge data (add new items, keep existing)
          setAccounts((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newAccounts = importedData.accounts.filter((a) => !existingIds.has(a.id));
            const updated = [...prev, ...newAccounts];
            if (storageMode === 'local') {
              saveAccountsLocal(updated);
            }
            return updated;
          });

          setTransactions((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const newTransactions = importedData.transactions.filter(
              (t) => !existingIds.has(t.id)
            );
            const updated = [...prev, ...newTransactions];
            if (storageMode === 'local') {
              saveTransactionsLocal(updated);
            }
            return updated;
          });

          setBudgets((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const newBudgets = importedData.budgets.filter((b) => !existingIds.has(b.id));
            const updated = [...prev, ...newBudgets];
            if (storageMode === 'local') {
              saveBudgetsLocal(updated);
            }
            return updated;
          });

          setGoals((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const newGoals = importedData.goals.filter((g) => !existingIds.has(g.id));
            const updated = [...prev, ...newGoals];
            if (storageMode === 'local') {
              saveGoalsLocal(updated);
            }
            return updated;
          });

          setRecurringPatterns((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPatterns = importedData.recurringPatterns.filter(
              (p) => !existingIds.has(p.id)
            );
            const updated = [...prev, ...newPatterns];
            if (storageMode === 'local') {
              saveRecurringPatternsLocal(updated);
            }
            return updated;
          });
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new Error(`Import failed: ${error.message}`);
        }
        throw error;
      }
    },
    [storageMode]
  );

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
