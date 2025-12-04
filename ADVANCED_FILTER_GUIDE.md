# Advanced Filter Guide

## Overview

The Advanced Filter feature provides comprehensive filtering capabilities for transactions in cashflow.pilot. It extends the basic filtering with additional options for more precise data analysis.

## Features

### Basic Filters (Always Visible)

1. **Search** - Full-text search across transaction descriptions
2. **Category** - Filter by spending category
3. **Type** - Filter by income or expense
4. **Start Date** - Filter transactions from a specific date

### Advanced Filters (Collapsible)

5. **End Date** - Filter transactions up to a specific date
6. **Amount Range** - Filter by transaction amount using a dual-thumb slider
   - Minimum amount input
   - Maximum amount input
   - Visual slider for quick adjustments
7. **Account Selection** - Filter by one or multiple accounts using badge toggles
8. **Recurring Transactions** - Toggle to show only recurring transactions

## Usage

### In Transactions Page

The Advanced Filter Bar is integrated into the Transactions page, replacing the basic FilterBar.

```tsx
import { AdvancedFilterBar } from '@/components/AdvancedFilterBar';
import { applyAdvancedFilters, type AdvancedFilterOptions } from '@/utils/advancedFilters';

// In your component
const [filters, setFilters] = useState<AdvancedFilterOptions>({});

const filteredTransactions = useMemo(() => {
  return applyAdvancedFilters(transactions, filters);
}, [transactions, filters]);

<AdvancedFilterBar onFilterChange={setFilters} />
```

### Filter Options Interface

```typescript
interface AdvancedFilterOptions {
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
```

## Components Created

### UI Components

- **`src/components/ui/switch.tsx`** - Toggle switch for boolean filters
- **`src/components/ui/slider.tsx`** - Range slider with dual thumbs
- **`src/components/ui/collapsible.tsx`** - Collapsible container for advanced options

### Feature Components

- **`src/components/AdvancedFilterBar.tsx`** - Main filter component with all filtering UI

### Utilities

- **`src/utils/advancedFilters.ts`** - Filter logic and type definitions

## Features

### Active Filter Indicators

- Badge counter showing number of active filters
- Collapsible summary showing all active filters when advanced section is closed
- Visual feedback with colored badges

### User Experience

- Debounced search (300ms) for performance
- Immediate updates for all other filters
- Clear All button to reset all filters
- Responsive design for mobile and desktop
- Accessible keyboard navigation

### Filter Persistence

Filters are maintained in component state and can be:
- Cleared individually
- Cleared all at once
- Persisted across component re-renders

## Customization

### Disable Advanced Filters

```tsx
<AdvancedFilterBar 
  onFilterChange={handleFilterChange} 
  showAdvanced={false} 
/>
```

### Adjust Amount Range

Edit the slider max value in `AdvancedFilterBar.tsx`:

```tsx
const [maxAmount, setMaxAmount] = useState<number>(10000); // Change default max
```

## Integration with Other Pages

The AdvancedFilterBar can be integrated into any page that displays transactions:

1. Import the component and utility
2. Add filter state
3. Apply filters using `applyAdvancedFilters()`
4. Render the filter bar

Example for Analytics page:

```tsx
import { AdvancedFilterBar } from '@/components/AdvancedFilterBar';
import { applyAdvancedFilters, type AdvancedFilterOptions } from '@/utils/advancedFilters';

const [filters, setFilters] = useState<AdvancedFilterOptions>({});
const filteredData = useMemo(() => 
  applyAdvancedFilters(transactions, filters), 
  [transactions, filters]
);

<AdvancedFilterBar onFilterChange={setFilters} />
```

## Performance Considerations

- Search is debounced to prevent excessive filtering
- Filters use memoization to avoid unnecessary recalculations
- Large transaction lists are efficiently filtered using native array methods

## Accessibility

- All form controls have proper labels
- Keyboard navigation supported
- Focus management for popover calendars
- ARIA attributes for screen readers
- Color contrast meets WCAG standards

## Future Enhancements

Potential additions:
- Save filter presets
- Export filtered results
- Filter by tags or custom fields
- Date range presets (Last 7 days, This month, etc.)
- Advanced search with operators (AND, OR, NOT)
