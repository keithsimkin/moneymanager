import type { Account, Transaction, Budget, Goal, RecurringPattern, ExportData } from '../types';

// Storage keys
const STORAGE_KEYS = {
  ACCOUNTS: 'finance-dashboard-accounts',
  TRANSACTIONS: 'finance-dashboard-transactions',
  BUDGETS: 'finance-dashboard-budgets',
  GOALS: 'finance-dashboard-goals',
  RECURRING_PATTERNS: 'finance-dashboard-recurring-patterns',
};

// Storage version for future migrations
const STORAGE_VERSION = '1.0.0';

// Error types
export class StorageError extends Error {
  public readonly cause?: unknown;
  
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

export class ValidationError extends Error {
  public readonly details?: unknown;
  
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

// Type guards for validation
function isAccount(obj: unknown): obj is Account {
  if (typeof obj !== 'object' || obj === null) return false;
  const account = obj as Record<string, unknown>;
  
  return (
    typeof account.id === 'string' &&
    typeof account.name === 'string' &&
    typeof account.type === 'string' &&
    ['checking', 'savings', 'credit', 'investment'].includes(account.type) &&
    typeof account.initialBalance === 'number' &&
    typeof account.currency === 'string' &&
    typeof account.createdAt === 'string' &&
    typeof account.updatedAt === 'string'
  );
}

function isTransaction(obj: unknown): obj is Transaction {
  if (typeof obj !== 'object' || obj === null) return false;
  const transaction = obj as Record<string, unknown>;
  
  return (
    typeof transaction.id === 'string' &&
    typeof transaction.accountId === 'string' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.description === 'string' &&
    typeof transaction.category === 'string' &&
    typeof transaction.date === 'string' &&
    typeof transaction.type === 'string' &&
    ['income', 'expense'].includes(transaction.type) &&
    typeof transaction.isRecurring === 'boolean' &&
    (transaction.recurringId === undefined || typeof transaction.recurringId === 'string') &&
    typeof transaction.createdAt === 'string' &&
    typeof transaction.updatedAt === 'string'
  );
}

function isBudget(obj: unknown): obj is Budget {
  if (typeof obj !== 'object' || obj === null) return false;
  const budget = obj as Record<string, unknown>;
  
  return (
    typeof budget.id === 'string' &&
    typeof budget.category === 'string' &&
    typeof budget.amount === 'number' &&
    typeof budget.period === 'string' &&
    ['weekly', 'monthly', 'yearly'].includes(budget.period) &&
    typeof budget.startDate === 'string' &&
    typeof budget.createdAt === 'string' &&
    typeof budget.updatedAt === 'string'
  );
}

function isGoal(obj: unknown): obj is Goal {
  if (typeof obj !== 'object' || obj === null) return false;
  const goal = obj as Record<string, unknown>;
  
  return (
    typeof goal.id === 'string' &&
    typeof goal.name === 'string' &&
    typeof goal.targetAmount === 'number' &&
    typeof goal.currentAmount === 'number' &&
    typeof goal.deadline === 'string' &&
    typeof goal.status === 'string' &&
    ['active', 'achieved', 'overdue'].includes(goal.status) &&
    typeof goal.createdAt === 'string' &&
    typeof goal.updatedAt === 'string'
  );
}

function isRecurringPattern(obj: unknown): obj is RecurringPattern {
  if (typeof obj !== 'object' || obj === null) return false;
  const pattern = obj as Record<string, unknown>;
  
  return (
    typeof pattern.id === 'string' &&
    typeof pattern.accountId === 'string' &&
    typeof pattern.amount === 'number' &&
    typeof pattern.description === 'string' &&
    typeof pattern.category === 'string' &&
    typeof pattern.type === 'string' &&
    ['income', 'expense'].includes(pattern.type) &&
    typeof pattern.frequency === 'string' &&
    ['daily', 'weekly', 'monthly', 'yearly'].includes(pattern.frequency) &&
    typeof pattern.startDate === 'string' &&
    (pattern.lastOccurrence === undefined || typeof pattern.lastOccurrence === 'string') &&
    typeof pattern.isActive === 'boolean' &&
    typeof pattern.createdAt === 'string'
  );
}

// Validation functions
function validateAccounts(data: unknown): Account[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Accounts data must be an array');
  }
  
  const accounts: Account[] = [];
  for (let i = 0; i < data.length; i++) {
    if (!isAccount(data[i])) {
      throw new ValidationError(`Invalid account at index ${i}`, data[i]);
    }
    accounts.push(data[i]);
  }
  
  return accounts;
}

function validateTransactions(data: unknown): Transaction[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Transactions data must be an array');
  }
  
  const transactions: Transaction[] = [];
  for (let i = 0; i < data.length; i++) {
    if (!isTransaction(data[i])) {
      throw new ValidationError(`Invalid transaction at index ${i}`, data[i]);
    }
    transactions.push(data[i]);
  }
  
  return transactions;
}

function validateBudgets(data: unknown): Budget[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Budgets data must be an array');
  }
  
  const budgets: Budget[] = [];
  for (let i = 0; i < data.length; i++) {
    if (!isBudget(data[i])) {
      throw new ValidationError(`Invalid budget at index ${i}`, data[i]);
    }
    budgets.push(data[i]);
  }
  
  return budgets;
}

function validateGoals(data: unknown): Goal[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Goals data must be an array');
  }
  
  const goals: Goal[] = [];
  for (let i = 0; i < data.length; i++) {
    if (!isGoal(data[i])) {
      throw new ValidationError(`Invalid goal at index ${i}`, data[i]);
    }
    goals.push(data[i]);
  }
  
  return goals;
}

function validateRecurringPatterns(data: unknown): RecurringPattern[] {
  if (!Array.isArray(data)) {
    throw new ValidationError('Recurring patterns data must be an array');
  }
  
  const patterns: RecurringPattern[] = [];
  for (let i = 0; i < data.length; i++) {
    if (!isRecurringPattern(data[i])) {
      throw new ValidationError(`Invalid recurring pattern at index ${i}`, data[i]);
    }
    patterns.push(data[i]);
  }
  
  return patterns;
}

// JSON serialization/deserialization helpers
function serialize<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new StorageError('Failed to serialize data', error);
  }
}

function deserialize<T>(json: string): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    throw new StorageError('Failed to deserialize data', error);
  }
}

// Storage operations
export function saveAccounts(accounts: Account[]): void {
  try {
    const json = serialize(accounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, json);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError('Failed to save accounts', error);
  }
}

export function loadAccounts(): Account[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!json) return [];
    
    const data = deserialize<unknown>(json);
    return validateAccounts(data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load accounts', error);
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    const json = serialize(transactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, json);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError('Failed to save transactions', error);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!json) return [];
    
    const data = deserialize<unknown>(json);
    return validateTransactions(data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load transactions', error);
  }
}

export function saveBudgets(budgets: Budget[]): void {
  try {
    const json = serialize(budgets);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, json);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError('Failed to save budgets', error);
  }
}

export function loadBudgets(): Budget[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!json) return [];
    
    const data = deserialize<unknown>(json);
    return validateBudgets(data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load budgets', error);
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    const json = serialize(goals);
    localStorage.setItem(STORAGE_KEYS.GOALS, json);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError('Failed to save goals', error);
  }
}

export function loadGoals(): Goal[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!json) return [];
    
    const data = deserialize<unknown>(json);
    return validateGoals(data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load goals', error);
  }
}

export function saveRecurringPatterns(patterns: RecurringPattern[]): void {
  try {
    const json = serialize(patterns);
    localStorage.setItem(STORAGE_KEYS.RECURRING_PATTERNS, json);
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError('Failed to save recurring patterns', error);
  }
}

export function loadRecurringPatterns(): RecurringPattern[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.RECURRING_PATTERNS);
    if (!json) return [];
    
    const data = deserialize<unknown>(json);
    return validateRecurringPatterns(data);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load recurring patterns', error);
  }
}

// Load all data at once
export interface StorageData {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
}

export function loadAllData(): StorageData {
  return {
    accounts: loadAccounts(),
    transactions: loadTransactions(),
    budgets: loadBudgets(),
    goals: loadGoals(),
    recurringPatterns: loadRecurringPatterns(),
  };
}

// Save all data at once
export function saveAllData(data: StorageData): void {
  saveAccounts(data.accounts);
  saveTransactions(data.transactions);
  saveBudgets(data.budgets);
  saveGoals(data.goals);
  saveRecurringPatterns(data.recurringPatterns);
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.RECURRING_PATTERNS);
}

// Export data to JSON string
export function exportToJSON(data: StorageData): string {
  const exportData: ExportData = {
    ...data,
    exportDate: new Date().toISOString(),
    version: STORAGE_VERSION,
  };
  
  return serialize(exportData);
}

// Import data from JSON string
export function importFromJSON(json: string): StorageData {
  const data = deserialize<ExportData>(json);
  
  // Validate the structure
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid export data format');
  }
  
  return {
    accounts: validateAccounts(data.accounts),
    transactions: validateTransactions(data.transactions),
    budgets: validateBudgets(data.budgets),
    goals: validateGoals(data.goals),
    recurringPatterns: validateRecurringPatterns(data.recurringPatterns),
  };
}

// CSV export helper - escape CSV field values
function escapeCSVField(value: string | number | boolean): string {
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

// Export transactions to CSV format
export function exportTransactionsToCSV(transactions: Transaction[], accounts: Account[]): string {
  // Create a map of account IDs to account names for lookup
  const accountMap = new Map(accounts.map(acc => [acc.id, acc.name]));
  
  // CSV headers
  const headers = [
    'ID',
    'Date',
    'Account',
    'Description',
    'Category',
    'Type',
    'Amount',
    'Is Recurring',
    'Recurring ID',
    'Created At',
    'Updated At'
  ];
  
  // Build CSV rows
  const rows = transactions.map(transaction => {
    const accountName = accountMap.get(transaction.accountId) || 'Unknown Account';
    
    return [
      escapeCSVField(transaction.id),
      escapeCSVField(transaction.date),
      escapeCSVField(accountName),
      escapeCSVField(transaction.description),
      escapeCSVField(transaction.category),
      escapeCSVField(transaction.type),
      escapeCSVField(transaction.amount),
      escapeCSVField(transaction.isRecurring),
      escapeCSVField(transaction.recurringId || ''),
      escapeCSVField(transaction.createdAt),
      escapeCSVField(transaction.updatedAt)
    ].join(',');
  });
  
  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}
