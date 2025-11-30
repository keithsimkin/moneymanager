import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { FinanceProvider } from '../contexts/FinanceContext';
import type { ReactNode } from 'react';

// Wrapper component for testing hooks that use FinanceContext
function wrapper({ children }: { children: ReactNode }) {
  return <FinanceProvider>{children}</FinanceProvider>;
}

describe('useAnalytics', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Monthly calculations', () => {
    it('should calculate monthly income correctly', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      // Test with current month (should be 0 for empty state)
      const now = new Date();
      const income = result.current.getMonthlyIncome(now.getMonth(), now.getFullYear());
      
      expect(income).toBe(0);
    });

    it('should calculate monthly expenses correctly', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      // Test with current month (should be 0 for empty state)
      const now = new Date();
      const expenses = result.current.getMonthlyExpenses(now.getMonth(), now.getFullYear());
      
      expect(expenses).toBe(0);
    });

    it('should calculate net cash flow correctly', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      // Test with current month (should be 0 for empty state)
      const now = new Date();
      const netCashFlow = result.current.getNetCashFlow(now.getMonth(), now.getFullYear());
      
      expect(netCashFlow).toBe(0);
    });
  });

  describe('Category spending', () => {
    it('should return empty array for no transactions', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const startDate = new Date(2024, 0, 1).toISOString();
      const endDate = new Date(2024, 11, 31).toISOString();
      const spending = result.current.getSpendingByCategory(startDate, endDate);
      
      expect(spending).toEqual([]);
    });

    it('should calculate spending by category with correct structure', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const startDate = new Date(2024, 0, 1).toISOString();
      const endDate = new Date(2024, 11, 31).toISOString();
      const spending = result.current.getSpendingByCategory(startDate, endDate);
      
      // Should be an array
      expect(Array.isArray(spending)).toBe(true);
      
      // Each item should have the correct structure
      spending.forEach((item) => {
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('amount');
        expect(item).toHaveProperty('percentage');
        expect(item).toHaveProperty('transactionCount');
      });
    });
  });

  describe('Trend data', () => {
    it('should generate trend data for specified months', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const trendData = result.current.getTrendData(6);
      
      // Should return 6 months of data
      expect(trendData).toHaveLength(6);
      
      // Each item should have the correct structure
      trendData.forEach((item) => {
        expect(item).toHaveProperty('month');
        expect(item).toHaveProperty('income');
        expect(item).toHaveProperty('expenses');
        expect(item).toHaveProperty('netCashFlow');
        
        // Month should be in YYYY-MM format
        expect(item.month).toMatch(/^\d{4}-\d{2}$/);
      });
    });

    it('should generate trend data in chronological order', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const trendData = result.current.getTrendData(3);
      
      // Verify months are in ascending order
      for (let i = 1; i < trendData.length; i++) {
        const prevMonth = new Date(trendData[i - 1].month);
        const currMonth = new Date(trendData[i].month);
        expect(currMonth.getTime()).toBeGreaterThan(prevMonth.getTime());
      }
    });
  });

  describe('Recent transactions', () => {
    it('should return empty array for no transactions', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const recent = result.current.getRecentTransactions(10);
      
      expect(recent).toEqual([]);
    });

    it('should respect the limit parameter', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const recent = result.current.getRecentTransactions(5);
      
      // Should not exceed the limit
      expect(recent.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Current month helpers', () => {
    it('should get current month income', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const income = result.current.getCurrentMonthIncome();
      
      expect(typeof income).toBe('number');
      expect(income).toBeGreaterThanOrEqual(0);
    });

    it('should get current month expenses', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const expenses = result.current.getCurrentMonthExpenses();
      
      expect(typeof expenses).toBe('number');
      expect(expenses).toBeGreaterThanOrEqual(0);
    });

    it('should get current month net cash flow', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const netCashFlow = result.current.getCurrentMonthNetCashFlow();
      
      expect(typeof netCashFlow).toBe('number');
    });

    it('should get current month spending by category', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const spending = result.current.getCurrentMonthSpendingByCategory();
      
      expect(Array.isArray(spending)).toBe(true);
    });
  });

  describe('Date range calculations', () => {
    it('should calculate total income for date range', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const startDate = new Date(2024, 0, 1).toISOString();
      const endDate = new Date(2024, 11, 31).toISOString();
      const income = result.current.getTotalIncome(startDate, endDate);
      
      expect(typeof income).toBe('number');
      expect(income).toBeGreaterThanOrEqual(0);
    });

    it('should calculate total expenses for date range', () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper });
      
      const startDate = new Date(2024, 0, 1).toISOString();
      const endDate = new Date(2024, 11, 31).toISOString();
      const expenses = result.current.getTotalExpenses(startDate, endDate);
      
      expect(typeof expenses).toBe('number');
      expect(expenses).toBeGreaterThanOrEqual(0);
    });
  });
});
