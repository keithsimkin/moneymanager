// Core Data Models

export interface Account {
  id: string;              // Unique identifier (UUID)
  name: string;            // Account name
  type: 'checking' | 'savings' | 'credit' | 'investment';
  initialBalance: number;  // Starting balance
  currency: string;        // Currency code (default: USD)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export interface Transaction {
  id: string;              // Unique identifier (UUID)
  accountId: string;       // Reference to account
  amount: number;          // Transaction amount (positive for income, negative for expense)
  description: string;     // Transaction description
  category: string;        // Spending category
  date: string;            // ISO timestamp
  type: 'income' | 'expense';
  isRecurring: boolean;    // Whether this is a recurring transaction
  recurringId?: string;    // Reference to recurring pattern if applicable
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export interface Budget {
  id: string;              // Unique identifier (UUID)
  category: string;        // Category to budget
  amount: number;          // Budget limit
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;       // ISO timestamp
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export interface Goal {
  id: string;              // Unique identifier (UUID)
  name: string;            // Goal name
  targetAmount: number;    // Target amount to reach
  currentAmount: number;   // Current progress
  deadline: string;        // ISO timestamp
  status: 'active' | 'achieved' | 'overdue';
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export interface RecurringPattern {
  id: string;              // Unique identifier (UUID)
  accountId: string;       // Reference to account
  amount: number;          // Transaction amount
  description: string;     // Transaction description
  category: string;        // Spending category
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;       // ISO timestamp
  lastOccurrence?: string; // ISO timestamp of last generated transaction
  isActive: boolean;       // Whether pattern is active
  createdAt: string;       // ISO timestamp
}

// Context Types

export interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addRecurringPattern: (pattern: Omit<RecurringPattern, 'id' | 'createdAt'>) => void;
  updateRecurringPattern: (id: string, updates: Partial<RecurringPattern>) => void;
  deleteRecurringPattern: (id: string) => void;
  exportData: () => string;
  importData: (data: string, strategy: 'merge' | 'replace') => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Utility Types for Filters

export interface FilterOptions {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  accountId?: string;
  type?: 'income' | 'expense';
}

// Utility Types for Analytics

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface TrendData {
  month: string;          // Format: "YYYY-MM"
  income: number;
  expenses: number;
  netCashFlow: number;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
}

export interface BudgetAlert {
  budgetId: string;
  category: string;
  percentage: number;
  type: 'warning' | 'exceeded';
}

export interface GoalProgress {
  goal: Goal;
  percentage: number;
  remaining: number;
  daysRemaining: number;
}

// Utility Types for Charts

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BalanceChartData {
  accountName: string;
  balance: number;
  type: Account['type'];
}

export interface CategoryChartData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// Account with calculated balance
export interface AccountWithBalance extends Account {
  balance: number;
}

// Export/Import data structure
export interface ExportData {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
  exportDate: string;
  version: string;
}
