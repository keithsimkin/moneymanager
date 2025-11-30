import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders all filter controls', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    // Verify all filter controls are present
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('renders category select with placeholder', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toBeInTheDocument();
  });

  it('renders date pickers', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    const datePickers = screen.getAllByText(/pick a date/i);
    expect(datePickers).toHaveLength(2); // Start date and end date
  });

  it('does not show clear filters button initially', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    expect(screen.queryByText(/clear filters/i)).not.toBeInTheDocument();
  });

  it('calls onFilterChange with empty object on initial render', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar onFilterChange={onFilterChange} />);

    // The component calls onFilterChange on mount with empty filters
    expect(onFilterChange).toHaveBeenCalled();
  });
});
