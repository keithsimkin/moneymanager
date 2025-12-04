import type { Transaction } from '@/types';

export interface AdvancedFilterOptions {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  accountId?: string;
  accountIds?: string[];
  type?: 'income' | 'expense';
  minAmount?: number;
  maxAmount?: number;
  isRecurring?: boolean;
}

export function applyAdvancedFilters(
  transactions: Transaction[],
  filters: AdvancedFilterOptions
): Transaction[] {
  return transactions.filter((transaction) => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    // Type filter
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }

    // Date range filter
    if (filters.startDate) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.startDate);
      if (transactionDate < startDate) return false;
    }

    if (filters.endDate) {
      const transactionDate = new Date(transaction.date);
      const endDate = new Date(filters.endDate);
      if (transactionDate > endDate) return false;
    }

    // Amount range filter
    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
      return false;
    }

    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
      return false;
    }

    // Account filter (single or multiple)
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false;
    }

    if (filters.accountIds && filters.accountIds.length > 0) {
      if (!filters.accountIds.includes(transaction.accountId)) {
        return false;
      }
    }

    // Recurring filter
    if (filters.isRecurring !== undefined && transaction.isRecurring !== filters.isRecurring) {
      return false;
    }

    return true;
  });
}
