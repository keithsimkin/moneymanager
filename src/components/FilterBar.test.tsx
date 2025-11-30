import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';
import type { FilterOptions } from '@/types';

describe('FilterBar', () => {
  let onFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilterChange = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders all filter controls', () => {
    render(<FilterBar onFilterChange={onFilterChange} />);

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    const user = userEvent.setup({ delay: null });
    render(<FilterBar onFilterChange={onFilterChange} />);

    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'test');

    // Should not call immediately
    expect(onFilterChange).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ searchTerm: 'test' });
    });
  });

  it('applies category filter immediately', async () => {
    const user = userEvent.setup();
    render(<FilterBar onFilterChange={onFilterChange} />);

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);

    const groceriesOption = await screen.findByText('Groceries');
    await user.click(groceriesOption);

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ category: 'Groceries' });
    });
  });

  it('shows clear filters button when filters are active', async () => {
    const user = userEvent.setup({ delay: null });
    render(<FilterBar onFilterChange={onFilterChange} />);

    // Initially no clear button
    expect(screen.queryByText(/clear filters/i)).not.toBeInTheDocument();

    // Add search term
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'test');

    // Clear button should appear
    expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<FilterBar onFilterChange={onFilterChange} />);

    // Add search term
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'test');

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ searchTerm: 'test' });
    });

    // Click clear button
    const clearButton = screen.getByText(/clear filters/i);
    await user.click(clearButton);

    // Should call with empty filters
    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({});
    });

    // Search input should be cleared
    expect(searchInput).toHaveValue('');
  });

  it('applies multiple filters together', async () => {
    const user = userEvent.setup({ delay: null });
    render(<FilterBar onFilterChange={onFilterChange} />);

    // Add search term
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'grocery');

    // Add category
    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const groceriesOption = await screen.findByText('Groceries');
    await user.click(groceriesOption);

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({
        searchTerm: 'grocery',
        category: 'Groceries',
      });
    });
  });
});
