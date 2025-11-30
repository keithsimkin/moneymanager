# Bills Management Feature Design

## Overview

The Bills Management feature extends the MoneyManager application with dedicated functionality for tracking and managing recurring payment obligations. This feature integrates with the existing transaction system while providing specialized UI and workflows for bill management. The design follows the established patterns in the codebase, using React Context for state management, localStorage for persistence, and the existing component architecture.

## Architecture

### High-Level Architecture

The Bills feature follows the existing application architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  Pages Layer                                             │
│  └─ Bills.tsx (new)                                      │
├─────────────────────────────────────────────────────────┤
│  Components Layer                                        │
│  ├─ BillCard.tsx (new)                                   │
│  ├─ BillForm.tsx (new)                                   │
│  ├─ BillList.tsx (new)                                   │
│  └─ UpcomingBills.tsx (new - for Dashboard)             │
├─────────────────────────────────────────────────────────┤
│  Hooks Layer                                             │
│  └─ useBills.ts (new)                                    │
├─────────────────────────────────────────────────────────┤
│  Context Layer (State Management)                        │
│  └─ FinanceContext (extended)                            │
├─────────────────────────────────────────────────────────┤
│  Storage Layer                                           │
│  └─ storage.ts (extended)                                │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  └─ localStorage (Browser API)                           │
└─────────────────────────────────────────────────────────┘
```

### Integration Points

1. **Navigation**: Add "Bills" tab to existing navigation (Sidebar and Navigation components)
2. **Dashboard**: Display upcoming bills widget on Dashboard page
3. **Transactions**: Create transactions when bills are marked as paid
4. **Routing**: Add `/bills` route to App.tsx router configuration
5. **Context**: Extend FinanceContext with bill operations
6. **Storage**: Add bill storage functions to storage.ts utility

## Components and Interfaces

### Data Models

#### Bill Interface

```typescript
export interface Bill {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Bill name (e.g., "Electric Bill")
  amount: number;                // Bill amount
  dueDate: string;               // ISO timestamp for due date
  payee: string;                 // Who the bill is paid to
  category: BillCategory;        // Bill category
  status: 'unpaid' | 'paid';     // Payment status
  paidDate?: string;             // ISO timestamp when marked as paid
  accountId?: string;            // Account used for payment (when paid)
  isRecurring: boolean;          // Whether this is a recurring bill
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';  // Recurrence pattern
  notes?: string;                // Optional notes
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

export type BillCategory = 
  | 'utilities'
  | 'rent'
  | 'insurance'
  | 'subscriptions'
  | 'loans'
  | 'other';

export interface BillFilterOptions {
  searchTerm?: string;
  status?: 'all' | 'unpaid' | 'paid' | 'overdue';
  category?: BillCategory;
}
```

### Context Extension

Extend `FinanceContextType` with bill operations:

```typescript
export interface FinanceContextType {
  // ... existing properties
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (id: string, accountId: string, paidDate: string) => void;
}
```

### Custom Hook

```typescript
// useBills.ts
export interface UseBillsReturn {
  bills: Bill[];
  filteredBills: Bill[];
  upcomingBills: Bill[];      // Bills due within 30 days
  overdueBills: Bill[];       // Bills past due date and unpaid
  filters: BillFilterOptions;
  setFilters: (filters: BillFilterOptions) => void;
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (id: string, accountId: string) => void;
  getBillStatus: (bill: Bill) => 'paid' | 'overdue' | 'due-soon' | 'upcoming';
}
```

### Component Specifications

#### BillCard Component

Displays a single bill with status indicators and action buttons.

**Props:**
```typescript
interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
}
```

**Features:**
- Visual status indicators (color-coded badges)
- Due date display with relative time (e.g., "Due in 3 days")
- Action buttons (Edit, Delete, Mark as Paid)
- Category badge
- Recurring indicator icon

#### BillForm Component

Form for creating and editing bills.

**Props:**
```typescript
interface BillFormProps {
  bill?: Bill;                  // Undefined for new bills
  onSubmit: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}
```

**Features:**
- Form validation (required fields)
- Date picker for due date
- Account selector (for marking as paid)
- Category dropdown
- Recurring frequency selector
- Notes textarea

#### BillList Component

Displays filtered list of bills.

**Props:**
```typescript
interface BillListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
}
```

**Features:**
- Sorted by due date (ascending)
- Empty state when no bills
- Responsive grid layout

#### UpcomingBills Component

Dashboard widget showing upcoming bills.

**Props:**
```typescript
interface UpcomingBillsProps {
  bills: Bill[];
  maxDisplay?: number;          // Default: 5
}
```

**Features:**
- Shows next N upcoming bills
- Link to full bills page
- Compact display format

## Data Models

### Bill Categories

```typescript
export const BILL_CATEGORIES = [
  'utilities',
  'rent',
  'insurance',
  'subscriptions',
  'loans',
  'other',
] as const;
```

### Bill Status Calculation

```typescript
function getBillStatus(bill: Bill): 'paid' | 'overdue' | 'due-soon' | 'upcoming' {
  if (bill.status === 'paid') return 'paid';
  
  const now = new Date();
  const dueDate = new Date(bill.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 7) return 'due-soon';
  return 'upcoming';
}
```

### Recurring Bill Generation

When a recurring bill is marked as paid, generate the next instance:

```typescript
function generateNextBill(paidBill: Bill): Bill {
  const nextDueDate = calculateNextDueDate(paidBill.dueDate, paidBill.recurringFrequency);
  
  return {
    ...paidBill,
    id: crypto.randomUUID(),
    dueDate: nextDueDate,
    status: 'unpaid',
    paidDate: undefined,
    accountId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Bill addition grows the list
*For any* valid bill data (with name, amount, and due date), adding it to the bills list should result in the list length growing by one and the bill appearing in the list with correct data.
**Validates: Requirements 1.1**

### Property 2: Invalid bills are rejected
*For any* bill data missing required fields (name, amount, or due date), attempting to add it should be rejected and the bills list should remain unchanged.
**Validates: Requirements 1.2, 4.2**

### Property 3: Recurring pattern preservation
*For any* bill with a recurring frequency (weekly, monthly, or yearly), adding or updating the bill should preserve the recurrence pattern in storage.
**Validates: Requirements 1.3, 4.4**

### Property 4: Bill operations persist to storage
*For any* bill operation (add, update, delete, mark as paid), the change should be immediately reflected in localStorage.
**Validates: Requirements 1.4, 3.3, 4.3, 5.2**

### Property 5: Unique ID assignment
*For any* set of bills added to the system, all bill IDs should be unique.
**Validates: Requirements 1.5**

### Property 6: Bills sorted by due date
*For any* collection of bills, when displayed in the list or dashboard, they should be sorted by due date in ascending order.
**Validates: Requirements 2.1, 7.3**

### Property 7: Bill display contains required fields
*For any* bill rendered in the UI, the display should contain the bill name, amount, due date, payee, category, and payment status.
**Validates: Requirements 2.2, 7.2, 8.3**

### Property 8: Overdue bills show indicator
*For any* bill with a due date in the past and status 'unpaid', the bill should display an overdue visual indicator.
**Validates: Requirements 2.3**

### Property 9: Due-soon bills show indicator
*For any* bill with a due date within 7 days and status 'unpaid', the bill should display a due-soon visual indicator.
**Validates: Requirements 2.4**

### Property 10: Mark as paid updates status
*For any* bill marked as paid, the bill status should be updated to 'paid' and the payment date should be recorded.
**Validates: Requirements 3.1**

### Property 11: Paid bills create transactions
*For any* bill marked as paid with an account ID, a corresponding transaction should be created in the transactions list with matching amount, description, category, and date.
**Validates: Requirements 3.2**

### Property 12: Recurring bill generation
*For any* recurring bill marked as paid, a new bill instance should be generated with the next due date calculated based on the recurrence pattern (weekly = +7 days, monthly = +1 month, yearly = +1 year).
**Validates: Requirements 3.4**

### Property 13: Paid bills show indicator
*For any* bill with status 'paid', the bill should display a paid visual indicator.
**Validates: Requirements 3.5**

### Property 14: Bill updates apply changes
*For any* bill and any valid updates, updating the bill should result in the bill reflecting the new values.
**Validates: Requirements 4.1**

### Property 15: Bill deletion removes from list
*For any* bill in the list, deleting it should result in the bill no longer appearing in the bills list.
**Validates: Requirements 5.1**

### Property 16: Search filters bills correctly
*For any* search term and collection of bills, the filtered results should only include bills where the search term appears in the name, payee, or category (case-insensitive).
**Validates: Requirements 6.1**

### Property 17: Status filter works correctly
*For any* status filter selection and collection of bills, the filtered results should only include bills matching the selected status.
**Validates: Requirements 6.2**

### Property 18: Category filter works correctly
*For any* category filter selection and collection of bills, the filtered results should only include bills in the selected category.
**Validates: Requirements 6.3**

### Property 19: Multiple filters combine with AND logic
*For any* combination of filters (search, status, category), the filtered results should only include bills matching all applied filter criteria.
**Validates: Requirements 6.4**

### Property 20: Clearing filters shows all bills
*For any* bills list with filters applied, clearing all filters should result in all bills being displayed.
**Validates: Requirements 6.5**

### Property 21: Dashboard shows upcoming bills
*For any* collection of bills, the dashboard should display only bills with due dates within the next 30 days and status 'unpaid'.
**Validates: Requirements 7.1**

### Property 22: Category association preserved
*For any* bill created or updated with a category, the category should be stored and retrievable with the bill.
**Validates: Requirements 8.2**

## Error Handling

### Validation Errors

1. **Missing Required Fields**: Display field-level validation errors when name, amount, or due date is missing
2. **Invalid Amount**: Reject negative or zero amounts with clear error message
3. **Invalid Date**: Reject invalid or past dates for new bills
4. **Invalid Account**: When marking as paid, validate that the selected account exists

### Storage Errors

1. **localStorage Full**: Catch QuotaExceededError and display user-friendly message
2. **Corrupted Data**: Validate data structure on load, fall back to empty state if corrupted
3. **Concurrent Modifications**: Use optimistic updates with error recovery

### User Feedback

1. **Success Messages**: Show toast notifications for successful operations (add, update, delete, mark as paid)
2. **Error Messages**: Display clear, actionable error messages for failures
3. **Loading States**: Show loading indicators during async operations
4. **Confirmation Dialogs**: Require confirmation for destructive actions (delete)

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

1. **Bill Status Calculation**: Test `getBillStatus` function with specific dates
   - Paid bill returns 'paid'
   - Bill due yesterday returns 'overdue'
   - Bill due in 3 days returns 'due-soon'
   - Bill due in 20 days returns 'upcoming'

2. **Next Due Date Calculation**: Test `calculateNextDueDate` function
   - Weekly: adds 7 days
   - Monthly: adds 1 month (handles month-end correctly)
   - Yearly: adds 1 year (handles leap years)

3. **Empty States**: Test UI renders correctly with no bills

4. **Integration**: Test bill-to-transaction creation flow

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (already configured in the project):

**Configuration**: Each property test should run a minimum of 100 iterations to ensure thorough coverage.

**Test Tagging**: Each property-based test must include a comment tag in this exact format:
```typescript
// Feature: bills-management, Property {number}: {property_text}
```

**Property Implementation**: Each correctness property listed above must be implemented as a single property-based test.

**Test Organization**:
- Bill operations tests: `src/hooks/useBills.test.ts`
- Storage tests: `src/utils/storage.test.ts` (extend existing)
- Component tests: Colocated with components (e.g., `src/components/BillCard.test.tsx`)

**Key Properties to Test**:

1. **Bill CRUD Operations** (Properties 1, 2, 14, 15)
   - Generate random valid/invalid bill data
   - Verify list operations maintain consistency

2. **Persistence** (Property 4)
   - Generate random bill operations
   - Verify localStorage always reflects current state

3. **Filtering and Search** (Properties 16-20)
   - Generate random bills and filter criteria
   - Verify filtered results match criteria

4. **Status Calculation** (Properties 8, 9, 13)
   - Generate bills with random due dates
   - Verify status indicators match calculated status

5. **Recurring Bill Generation** (Property 12)
   - Generate recurring bills with different frequencies
   - Verify next instance has correct due date

6. **Transaction Creation** (Property 11)
   - Generate random bills and mark as paid
   - Verify transaction data matches bill data

### Test Coverage Goals

- Unit test coverage: Focus on edge cases and specific examples
- Property test coverage: All 22 correctness properties must have corresponding property-based tests
- Component test coverage: User interactions and accessibility
- Integration test coverage: Bill-to-transaction flow, dashboard integration

## Implementation Notes

### Date Handling

Use `date-fns` library (already in project) for date calculations:
- `addDays`, `addMonths`, `addYears` for recurring bill generation
- `differenceInDays` for status calculation
- `format` for date display

### Storage Keys

Add new storage key to existing pattern:
```typescript
const STORAGE_KEYS = {
  // ... existing keys
  BILLS: 'finance-dashboard-bills',
};
```

### Navigation Updates

1. Add "Bills" to Sidebar navigation
2. Add "Bills" to mobile Navigation component
3. Update keyboard shortcuts to include bills navigation

### Dashboard Integration

Add `UpcomingBills` component to Dashboard page, positioned after existing widgets.

### Accessibility

- All form inputs must have labels
- Status indicators must have aria-labels
- Confirmation dialogs must trap focus
- Keyboard navigation for all interactive elements
- Color indicators must be supplemented with icons/text

### Performance Considerations

- Memoize filtered bills calculation
- Use React.memo for BillCard components
- Debounce search input
- Lazy load bills page route

## Future Enhancements

Potential future improvements (out of scope for initial implementation):

1. **Bill Reminders**: Email/push notifications for upcoming bills
2. **Bill History**: Track payment history for recurring bills
3. **Auto-Pay Integration**: Connect to bank accounts for automatic payments
4. **Bill Splitting**: Split bills between multiple accounts or people
5. **Bill Analytics**: Visualize bill spending trends over time
6. **Bill Templates**: Save common bills as templates for quick entry
