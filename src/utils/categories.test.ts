import { describe, it, expect } from 'vitest';
import { CATEGORIES, isValidCategory } from './categories';

describe('Predefined Categories', () => {
  it('should include all required categories from Requirements 3.1', () => {
    // Requirements 3.1: The Finance Dashboard SHALL provide predefined spending categories
    // including groceries, utilities, entertainment, transportation, healthcare, and other
    const requiredCategories = [
      'Groceries',
      'Utilities',
      'Entertainment',
      'Transportation',
      'Healthcare',
      'Other',
    ];

    requiredCategories.forEach((category) => {
      expect(CATEGORIES).toContain(category);
    });
  });

  it('should export categories as a readonly array', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it('should validate correct category strings', () => {
    expect(isValidCategory('Groceries')).toBe(true);
    expect(isValidCategory('Utilities')).toBe(true);
    expect(isValidCategory('Entertainment')).toBe(true);
    expect(isValidCategory('Transportation')).toBe(true);
    expect(isValidCategory('Healthcare')).toBe(true);
    expect(isValidCategory('Other')).toBe(true);
  });

  it('should reject invalid category strings', () => {
    expect(isValidCategory('InvalidCategory')).toBe(false);
    expect(isValidCategory('groceries')).toBe(false); // case-sensitive
    expect(isValidCategory('')).toBe(false);
  });
});
