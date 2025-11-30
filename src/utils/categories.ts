/**
 * Predefined spending categories for transactions
 * Requirements: 3.1
 */
export const CATEGORIES = [
  'Groceries',
  'Utilities',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Shopping',
  'Dining',
  'Other',
] as const;

/**
 * Type for valid category values
 */
export type Category = typeof CATEGORIES[number];

/**
 * Check if a string is a valid category
 */
export function isValidCategory(category: string): category is Category {
  return CATEGORIES.includes(category as Category);
}
