import { supabase } from '@/lib/supabase';
import type { Account, Transaction, Budget, Goal, RecurringPattern } from '@/types';

// Helper to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Helper to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Get current user ID
async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// ============= ACCOUNTS =============

export async function fetchAccounts(): Promise<Account[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data || []);
}

export async function createAccount(account: Account): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('accounts')
    .insert(toSnakeCase({ ...account, userId }));

  if (error) throw error;
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('accounts')
    .update(toSnakeCase(updates))
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteAccount(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============= TRANSACTIONS =============

export async function fetchTransactions(): Promise<Transaction[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return toCamelCase(data || []);
}

export async function createTransaction(transaction: Transaction): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('transactions')
    .insert(toSnakeCase({ ...transaction, userId }));

  if (error) throw error;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('transactions')
    .update(toSnakeCase(updates))
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteTransaction(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============= BUDGETS =============

export async function fetchBudgets(): Promise<Budget[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data || []);
}

export async function createBudget(budget: Budget): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('budgets')
    .insert(toSnakeCase({ ...budget, userId }));

  if (error) throw error;
}

export async function updateBudget(id: string, updates: Partial<Budget>): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('budgets')
    .update(toSnakeCase(updates))
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteBudget(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============= GOALS =============

export async function fetchGoals(): Promise<Goal[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data || []);
}

export async function createGoal(goal: Goal): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('goals')
    .insert(toSnakeCase({ ...goal, userId }));

  if (error) throw error;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('goals')
    .update(toSnakeCase(updates))
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteGoal(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============= RECURRING PATTERNS =============

export async function fetchRecurringPatterns(): Promise<RecurringPattern[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('recurring_patterns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data || []);
}

export async function createRecurringPattern(pattern: RecurringPattern): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('recurring_patterns')
    .insert(toSnakeCase({ ...pattern, userId }));

  if (error) throw error;
}

export async function updateRecurringPattern(id: string, updates: Partial<RecurringPattern>): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('recurring_patterns')
    .update(toSnakeCase(updates))
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteRecurringPattern(id: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('recurring_patterns')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============= BULK OPERATIONS =============

export async function syncAllToSupabase(data: {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
}): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  // Delete all existing data for this user
  await Promise.all([
    supabase.from('transactions').delete().eq('user_id', userId),
    supabase.from('recurring_patterns').delete().eq('user_id', userId),
    supabase.from('budgets').delete().eq('user_id', userId),
    supabase.from('goals').delete().eq('user_id', userId),
    supabase.from('accounts').delete().eq('user_id', userId),
  ]);

  // Insert new data
  if (data.accounts.length > 0) {
    const { error } = await supabase
      .from('accounts')
      .insert(toSnakeCase(data.accounts.map(a => ({ ...a, userId }))));
    if (error) throw error;
  }

  if (data.transactions.length > 0) {
    const { error } = await supabase
      .from('transactions')
      .insert(toSnakeCase(data.transactions.map(t => ({ ...t, userId }))));
    if (error) throw error;
  }

  if (data.budgets.length > 0) {
    const { error } = await supabase
      .from('budgets')
      .insert(toSnakeCase(data.budgets.map(b => ({ ...b, userId }))));
    if (error) throw error;
  }

  if (data.goals.length > 0) {
    const { error } = await supabase
      .from('goals')
      .insert(toSnakeCase(data.goals.map(g => ({ ...g, userId }))));
    if (error) throw error;
  }

  if (data.recurringPatterns.length > 0) {
    const { error } = await supabase
      .from('recurring_patterns')
      .insert(toSnakeCase(data.recurringPatterns.map(p => ({ ...p, userId }))));
    if (error) throw error;
  }
}

export async function fetchAllFromSupabase(): Promise<{
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPatterns: RecurringPattern[];
}> {
  const [accounts, transactions, budgets, goals, recurringPatterns] = await Promise.all([
    fetchAccounts(),
    fetchTransactions(),
    fetchBudgets(),
    fetchGoals(),
    fetchRecurringPatterns(),
  ]);

  return { accounts, transactions, budgets, goals, recurringPatterns };
}
