# Implementation Plan

- [ ] 1. Extend data models and types
  - Add Bill interface and BillCategory type to src/types/index.ts
  - Add BillFilterOptions interface
  - Add bill-related methods to FinanceContextType
  - _Requirements: 1.1, 1.2, 1.3, 8.1, 8.2_

- [ ] 2. Extend storage layer for bills
  - Add BILLS storage key to storage.ts
  - Implement saveBills and loadBills functions with validation
  - Add Bill type guard (isBill) and validation function
  - Update loadAllData and saveAllData to include bills
  - Update ExportData interface to include bills
  - _Requirements: 1.4, 3.3, 4.3, 5.2_

- [ ]* 2.1 Write property test for bill storage persistence
  - **Property 4: Bill operations persist to storage**
  - **Validates: Requirements 1.4, 3.3, 4.3, 5.2**

- [ ] 3. Extend FinanceContext with bill operations
  - Add bills state to FinanceProvider
  - Implement addBill function with ID generation and timestamps
  - Implement updateBill function
  - Implement deleteBill function
  - Implement markBillAsPaid function (updates bill and creates transaction)
  - Load bills from storage on mount
  - _Requirements: 1.1, 1.5, 3.1, 3.2, 4.1, 5.1_

- [ ]* 3.1 Write property test for bill addition
  - **Property 1: Bill addition grows the list**
  - **Validates: Requirements 1.1**

- [ ]* 3.2 Write property test for unique ID assignment
  - **Property 5: Unique ID assignment**
  - **Validates: Requirements 1.5**

- [ ]* 3.3 Write property test for bill updates
  - **Property 14: Bill updates apply changes**
  - **Validates: Requirements 4.1**

- [ ]* 3.4 Write property test for bill deletion
  - **Property 15: Bill deletion removes from list**
  - **Validates: Requirements 5.1**

- [ ]* 3.5 Write property test for paid bills creating transactions
  - **Property 11: Paid bills create transactions**
  - **Validates: Requirements 3.2**

- [ ] 4. Create useBills custom hook
  - Implement useBills hook that consumes FinanceContext
  - Add filtering logic (search, status, category)
  - Calculate upcomingBills (due within 30 days)
  - Calculate overdueBills (past due and unpaid)
  - Implement getBillStatus helper function
  - Implement markBillAsPaid wrapper that selects account
  - _Requirements: 2.1, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1_

- [ ]* 4.1 Write property test for invalid bills rejection
  - **Property 2: Invalid bills are rejected**
  - **Validates: Requirements 1.2, 4.2**

- [ ]* 4.2 Write property test for recurring pattern preservation
  - **Property 3: Recurring pattern preservation**
  - **Validates: Requirements 1.3, 4.4**

- [ ]* 4.3 Write property test for bills sorting
  - **Property 6: Bills sorted by due date**
  - **Validates: Requirements 2.1, 7.3**

- [ ]* 4.4 Write property test for search filtering
  - **Property 16: Search filters bills correctly**
  - **Validates: Requirements 6.1**

- [ ]* 4.5 Write property test for status filtering
  - **Property 17: Status filter works correctly**
  - **Validates: Requirements 6.2**

- [ ]* 4.6 Write property test for category filtering
  - **Property 18: Category filter works correctly**
  - **Validates: Requirements 6.3**

- [ ]* 4.7 Write property test for multiple filters
  - **Property 19: Multiple filters combine with AND logic**
  - **Validates: Requirements 6.4**

- [ ]* 4.8 Write property test for clearing filters
  - **Property 20: Clearing filters shows all bills**
  - **Validates: Requirements 6.5**

- [ ]* 4.9 Write property test for dashboard upcoming bills
  - **Property 21: Dashboard shows upcoming bills**
  - **Validates: Requirements 7.1**

- [ ]* 4.10 Write unit tests for getBillStatus function
  - Test paid bill returns 'paid'
  - Test overdue bill returns 'overdue'
  - Test due-soon bill returns 'due-soon'
  - Test upcoming bill returns 'upcoming'
  - _Requirements: 2.3, 2.4_

- [ ] 5. Implement recurring bill generation logic
  - Create calculateNextDueDate helper function
  - Create generateNextBill helper function
  - Integrate into markBillAsPaid in FinanceContext
  - _Requirements: 3.4_

- [ ]* 5.1 Write property test for recurring bill generation
  - **Property 12: Recurring bill generation**
  - **Validates: Requirements 3.4**

- [ ]* 5.2 Write unit tests for calculateNextDueDate
  - Test weekly adds 7 days
  - Test monthly adds 1 month (handle month-end)
  - Test yearly adds 1 year (handle leap years)
  - _Requirements: 3.4_

- [ ] 6. Create BillCard component
  - Implement BillCard with bill display
  - Add status badge with color coding (paid=green, overdue=red, due-soon=yellow)
  - Add category badge
  - Add recurring indicator icon
  - Add action buttons (Edit, Delete, Mark as Paid)
  - Format due date with relative time
  - _Requirements: 2.2, 2.3, 2.4, 3.5, 8.3_

- [ ]* 6.1 Write property test for bill display fields
  - **Property 7: Bill display contains required fields**
  - **Validates: Requirements 2.2, 7.2, 8.3**

- [ ]* 6.2 Write property test for overdue indicator
  - **Property 8: Overdue bills show indicator**
  - **Validates: Requirements 2.3**

- [ ]* 6.3 Write property test for due-soon indicator
  - **Property 9: Due-soon bills show indicator**
  - **Validates: Requirements 2.4**

- [ ]* 6.4 Write property test for paid indicator
  - **Property 13: Paid bills show indicator**
  - **Validates: Requirements 3.5**

- [ ] 7. Create BillForm component
  - Implement form with inputs for name, amount, due date, payee, category
  - Add recurring frequency selector (checkbox + dropdown)
  - Add notes textarea
  - Add account selector (for marking as paid)
  - Implement form validation (required fields, positive amount)
  - Add submit and cancel buttons
  - Support both create and edit modes
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 8.1_

- [ ]* 7.1 Write unit tests for BillForm validation
  - Test required field validation
  - Test amount validation (positive numbers)
  - Test form submission with valid data
  - _Requirements: 1.2, 4.2_

- [ ] 8. Create BillList component
  - Implement grid layout for bills
  - Render BillCard for each bill
  - Sort bills by due date
  - Handle empty state with EmptyState component
  - Pass through event handlers to BillCard
  - _Requirements: 2.1, 2.2, 2.5_

- [ ]* 8.1 Write unit test for empty state
  - Test empty state displays when no bills
  - _Requirements: 2.5_

- [ ] 9. Create Bills page
  - Implement Bills page component at src/pages/Bills.tsx
  - Add filter bar with search, status filter, category filter
  - Add "Add Bill" button that opens BillForm dialog
  - Integrate useBills hook
  - Implement edit dialog with BillForm
  - Implement delete confirmation dialog
  - Implement mark as paid dialog with account selector
  - Display BillList with filtered bills
  - _Requirements: 1.1, 2.1, 2.2, 4.1, 5.1, 5.3, 6.1, 6.2, 6.3_

- [ ]* 9.1 Write property test for mark as paid status update
  - **Property 10: Mark as paid updates status**
  - **Validates: Requirements 3.1**

- [ ] 10. Create UpcomingBills dashboard widget
  - Implement UpcomingBills component
  - Display next 5 upcoming bills in compact format
  - Show bill name, amount, and due date
  - Add "View All Bills" link to /bills page
  - Handle empty state
  - _Requirements: 7.1, 7.2, 7.4_

- [ ]* 10.1 Write unit test for dashboard empty state
  - Test empty state message when no upcoming bills
  - _Requirements: 7.4_

- [ ]* 10.2 Write property test for category association
  - **Property 22: Category association preserved**
  - **Validates: Requirements 8.2**

- [ ] 11. Integrate bills into navigation
  - Add "Bills" link to Sidebar component
  - Add "Bills" link to Navigation component (mobile)
  - Add bills icon (use Receipt icon from lucide-react)
  - _Requirements: 2.1_

- [ ] 12. Add bills route to App.tsx
  - Import Bills page component
  - Add /bills route to router configuration
  - _Requirements: 2.1_

- [ ] 13. Integrate UpcomingBills into Dashboard
  - Import UpcomingBills component in Dashboard page
  - Add UpcomingBills widget after existing widgets
  - Pass upcoming bills from useBills hook
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 14. Update keyboard shortcuts
  - Add 'b' shortcut for navigating to bills page
  - Update KeyboardShortcutsDialog to document bills shortcut
  - Update useKeyboardShortcuts hook
  - _Requirements: 2.1_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
