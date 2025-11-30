# Implementation Plan

- [ ] 1. Set up project structure and dependencies
  - Initialize Vite + React + TypeScript project
  - Install and configure Tailwind CSS
  - Install shadcn/ui CLI and initialize
  - Install dependencies: date-fns, recharts, lucide-react, fast-check
  - Set up project folder structure (components, hooks, contexts, types, utils)
  - Configure TypeScript with strict mode
  - _Requirements: All_

- [x] 2. Define TypeScript types and interfaces
  - Create types for Account, Transaction, Budget, Goal, RecurringPattern models
  - Define context types for FinanceContext and ThemeContext
  - Create utility types for filters, chart data, and analytics
  - _Requirements: 1.1, 2.1, 7.1, 8.1, 12.1_

- [x] 3. Implement storage layer

- [x] 3.1 Create storage utility functions
  - Write functions for saving/loading data from local storage
  - Implement data validation and error handling
  - Add JSON serialization/deserialization helpers
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 3.2 Write property test for storage round-trip
  - **Property 16: Storage round-trip consistency**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 3.3 Write property test for corrupted data handling






  - **Property 17: Corrupted data handling**
  - **Validates: Requirements 5.5**

- [-] 4. Install and configure shadcn/ui components



  - Install required shadcn/ui components: Button, Card, Dialog, Select, Input, Label, Table, Tabs, Badge, Progress, DropdownMenu, Popover, Tooltip, Alert, AlertDialog, Calendar
  - Configure component variants and styles
  - _Requirements: All UI requirements_

- [ ] 5. Add routing and navigation
  - Install and configure React Router
  - Set up routes for all pages (Dashboard, Accounts, Transactions, Budgets, Goals, Analytics)
  - Add 404 page
  - _Requirements: All_

- [ ] 6. Create theme context and provider
- [ ] 6.1 Implement ThemeContext with light/dark/system modes
  - Create ThemeProvider component
  - Add theme detection and persistence logic
  - Implement theme toggle functionality
  - _Requirements: 11.1, 11.2, 11.3_

- [ ]* 6.2 Write property test for theme persistence
  - **Property 38: Theme persistence**
  - **Validates: Requirements 11.3**

- [ ]* 6.3 Write unit test for system theme detection
  - Test that system preference is respected on initial load
  - _Requirements: 11.2_

- [ ] 7. Create layout components
- [ ] 7.1 Build AppLayout component
  - Create main layout structure with sidebar and content area
  - Add responsive design for mobile/desktop
  - Integrate theme toggle in header
  - _Requirements: 11.1_

- [ ] 7.2 Build Sidebar component
  - Create navigation menu with links to all pages
  - Add active state indicators
  - Implement collapsible sidebar for mobile
  - _Requirements: All_

- [ ] 7.3 Build Header component
  - Add app title and branding
  - Implement theme toggle button
  - Add user actions dropdown
  - _Requirements: 11.1_

- [ ] 8. Add predefined categories
- [ ] 8.1 Create categories constant
  - Define list of predefined categories
  - Export for use in forms and filters
  - _Requirements: 3.1_

- [ ]* 8.2 Write unit test for predefined categories
  - Verify all required categories exist
  - _Requirements: 3.1_

- [ ] 9. Create finance context and provider (minimal implementation)
- [ ] 9.1 Implement FinanceContext with state management
  - Create FinanceProvider component with all state (accounts, transactions, budgets, goals, recurring patterns)
  - Implement CRUD operations for all data types
  - Add data persistence on state changes
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.4, 2.5, 7.1, 7.5, 8.1, 12.1_

- [ ]* 9.2 Write property test for account creation
  - **Property 1: Account creation persistence**
  - **Validates: Requirements 1.1**

- [ ]* 9.3 Write property test for account deletion cascade
  - **Property 4: Account deletion cascade**
  - **Validates: Requirements 1.4**

- [ ]* 9.4 Write property test for transaction creation
  - **Property 6: Transaction creation and association**
  - **Validates: Requirements 2.1**

- [ ] 10. Create account components
- [ ] 10.1 Build AccountCard component
  - Display account name, type, and balance
  - Add edit and delete action buttons
  - Style with shadcn/ui Card component
  - _Requirements: 1.2_

- [ ]* 10.2 Write property test for account display
  - **Property 2: Account display completeness**
  - **Validates: Requirements 1.2**

- [ ] 10.3 Build AccountForm component
  - Create form with name, type, and initial balance fields
  - Add form validation
  - Implement create and edit modes
  - Use shadcn/ui Dialog and Form components
  - _Requirements: 1.1, 1.3_

- [ ]* 10.4 Write property test for account updates
  - **Property 3: Account update persistence**
  - **Validates: Requirements 1.3**

- [ ] 10.5 Build AccountsPage component
  - Display list of all accounts using AccountCard
  - Add "Create Account" button
  - Show total balance summary
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 11. Create transaction components
- [ ] 11.1 Build TransactionList component
  - Create table with all transaction fields
  - Add edit and delete actions
  - Implement pagination or virtual scrolling
  - Use shadcn/ui Table component
  - _Requirements: 2.3_

- [ ]* 11.2 Write property test for transaction display
  - **Property 8: Transaction display completeness**
  - **Validates: Requirements 2.3**

- [ ] 11.3 Build TransactionForm component
  - Create form with all transaction fields
  - Add category selection dropdown
  - Implement date picker
  - Add recurring transaction option
  - Use shadcn/ui Dialog and Form components
  - _Requirements: 2.1, 3.2, 12.1_

- [ ]* 11.4 Write property test for category assignment
  - **Property 9: Category assignment persistence**
  - **Validates: Requirements 3.2**

- [ ]* 11.5 Write property test for recurring pattern creation
  - **Property 40: Recurring pattern creation**
  - **Validates: Requirements 12.1**

- [ ] 11.6 Build FilterBar component
  - Add search input with debouncing
  - Create date range picker
  - Add category filter dropdown
  - Implement clear filters button
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 11.7 Build TransactionsPage component
  - Integrate TransactionList and FilterBar
  - Add "Create Transaction" button
  - Show filtered transaction count
  - _Requirements: 2.1, 2.3, 6.1, 6.2, 6.3, 6.4_

- [ ] 12. Create budget components
- [ ] 12.1 Build BudgetCard component
  - Display budget category, amount, and period
  - Show progress bar with percentage
  - Add warning/alert indicators
  - Include edit and delete actions
  - Use shadcn/ui Card and Progress components
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 12.2 Build BudgetForm component
  - Create form with category, amount, and period fields
  - Add form validation
  - Use shadcn/ui Dialog and Form components
  - _Requirements: 7.1_

- [ ]* 12.3 Write property test for budget creation
  - **Property 23: Budget creation and association**
  - **Validates: Requirements 7.1**

- [ ] 12.4 Build BudgetsPage component
  - Display list of all budgets using BudgetCard
  - Add "Create Budget" button
  - Show budget alerts summary
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 13. Create goal components
- [ ] 13.1 Build GoalCard component
  - Display goal name, target, current amount, and deadline
  - Show progress bar with percentage
  - Display time remaining or completion status
  - Add contribute, edit, and delete actions
  - Use shadcn/ui Card and Progress components
  - _Requirements: 8.3, 8.4, 8.5_

- [ ]* 13.2 Write property test for goal display
  - **Property 28: Goal display completeness**
  - **Validates: Requirements 8.3**

- [ ] 13.3 Build GoalForm component
  - Create form with name, target amount, and deadline fields
  - Add form validation
  - Use shadcn/ui Dialog and Form components
  - _Requirements: 8.1_

- [ ]* 13.4 Write property test for goal creation
  - **Property 26: Goal creation persistence**
  - **Validates: Requirements 8.1**

- [ ] 13.5 Build GoalsPage component
  - Display list of all goals using GoalCard
  - Add "Create Goal" button
  - Show goals summary (active, achieved, overdue)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Create chart components (with mock data)
- [ ] 14.1 Build CategoryChart component
  - Implement pie chart using Recharts
  - Display spending distribution by category
  - Add tooltips with detailed information
  - Apply theme-appropriate colors
  - _Requirements: 4.4, 9.2, 9.4, 11.4_

- [ ]* 14.2 Write property test for chart tooltip data
  - **Property 32: Chart tooltip data completeness**
  - **Validates: Requirements 9.4**

- [ ]* 14.3 Write property test for chart theme colors
  - **Property 39: Chart theme adaptation**
  - **Validates: Requirements 11.4**

- [ ] 14.4 Build TrendChart component
  - Implement line chart using Recharts
  - Display income and expense trends over time
  - Add tooltips and legend
  - Apply theme-appropriate colors
  - _Requirements: 9.1, 9.4, 11.4_

- [ ] 14.5 Build BalanceChart component
  - Implement bar chart using Recharts
  - Display account balances comparison
  - Add tooltips with account details
  - Apply theme-appropriate colors
  - _Requirements: 9.3, 9.4, 11.4_

- [ ]* 14.6 Write property test for balance chart data
  - **Property 31: Balance chart data accuracy**
  - **Validates: Requirements 9.3**

- [ ] 15. Create dashboard page (with mock data)
- [ ] 15.1 Build Dashboard component
  - Display summary cards (total balance, monthly income, monthly expenses, net cash flow)
  - Integrate CategoryChart, TrendChart, and BalanceChart
  - Show recent transactions list
  - Add budget alerts section
  - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3_

- [ ] 16. Create analytics page (with mock data)
- [ ] 16.1 Build AnalyticsPage component
  - Display detailed charts and visualizations
  - Add time period selector
  - Show spending breakdown by category
  - Include income vs expense comparison
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 17. Add empty state components
- [ ] 17.1 Create empty state UI
  - Build EmptyState component for no data scenarios
  - Add helpful guidance messages
  - Include call-to-action buttons
  - _Requirements: 5.4_

- [ ]* 17.2 Write unit test for empty state
  - Verify empty state displays with no data
  - _Requirements: 5.4_

- [ ] 18. Implement recurring transaction UI prompts
- [ ] 18.1 Add edit/delete prompts for recurring transactions
  - Create dialog for "this instance" vs "all instances" choice
  - Integrate with TransactionForm
  - Use shadcn/ui AlertDialog component
  - _Requirements: 12.4, 12.5_

- [ ] 19. UI Checkpoint - Review and iterate on UI
  - Test all pages and components with mock data
  - Verify responsive design on mobile and desktop
  - Check theme switching works correctly
  - Ensure all forms and interactions work as expected
  - Ask the user for feedback on UI/UX

- [ ] 20. Implement custom hooks for accounts
- [ ] 20.1 Create useAccounts hook
  - Implement balance calculation logic
  - Add total balance aggregation
  - Create helper functions for account operations
  - _Requirements: 1.2, 1.5, 2.2_

- [ ]* 20.2 Write property test for balance calculation invariant
  - **Property 7: Balance calculation invariant**
  - **Validates: Requirements 2.2, 2.4, 2.5**

- [ ]* 20.3 Write property test for total balance aggregation
  - **Property 5: Total balance aggregation**
  - **Validates: Requirements 1.5, 4.1**

- [ ] 21. Implement custom hooks for transactions
- [ ] 21.1 Create useTransactions hook
  - Implement filtering logic (search, date range, category)
  - Add sorting by date
  - Create helper functions for transaction queries
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 21.2 Write property test for search filtering
  - **Property 18: Search term filtering**
  - **Validates: Requirements 6.1**

- [ ]* 21.3 Write property test for date range filtering
  - **Property 19: Date range filtering**
  - **Validates: Requirements 6.2**

- [ ]* 21.4 Write property test for compound filters
  - **Property 20: Compound filter conjunction**
  - **Validates: Requirements 6.3**

- [ ]* 21.5 Write property test for filter reset
  - **Property 21: Filter reset completeness**
  - **Validates: Requirements 6.4**

- [ ]* 21.6 Write property test for sort stability
  - **Property 22: Sort stability under filtering**
  - **Validates: Requirements 6.5**

- [ ] 22. Implement category filtering
- [ ] 22.1 Add category filter to TransactionsPage
  - Create category dropdown filter
  - Integrate with useTransactions hook
  - _Requirements: 3.5_

- [ ]* 22.2 Write property test for category filtering
  - **Property 11: Category filtering accuracy**
  - **Validates: Requirements 3.5**

- [ ] 23. Implement analytics hook
- [ ] 23.1 Create useAnalytics hook
  - Implement monthly income/expense calculations
  - Add net cash flow calculation
  - Create spending by category aggregation
  - Implement trend data generation for charts
  - Add recent transactions query
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 3.3, 3.4, 9.1_

- [ ]* 23.2 Write property test for monthly aggregation
  - **Property 12: Monthly income and expense aggregation**
  - **Validates: Requirements 4.2**

- [ ]* 23.3 Write property test for net cash flow
  - **Property 13: Net cash flow calculation**
  - **Validates: Requirements 4.3**

- [ ]* 23.4 Write property test for category spending
  - **Property 10: Category spending calculation**
  - **Validates: Requirements 3.3, 3.4**

- [ ]* 23.5 Write property test for category distribution
  - **Property 14: Category distribution data accuracy**
  - **Validates: Requirements 4.4, 9.2**

- [ ]* 23.6 Write property test for recent transactions ordering
  - **Property 15: Recent transactions ordering**
  - **Validates: Requirements 4.5**

- [ ]* 23.7 Write property test for trend chart data
  - **Property 30: Trend chart data accuracy**
  - **Validates: Requirements 9.1**

- [ ] 24. Implement budgets hook
- [ ] 24.1 Create useBudgets hook
  - Implement budget progress calculation
  - Add budget alert detection (80% warning, 100% alert)
  - Create active budgets query
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ]* 24.2 Write property test for budget progress
  - **Property 24: Budget progress calculation**
  - **Validates: Requirements 7.2**

- [ ]* 24.3 Write unit tests for budget alerts
  - Test 80% warning threshold
  - Test 100% alert threshold
  - _Requirements: 7.3, 7.4_

- [ ]* 24.4 Write property test for budget recalculation
  - **Property 25: Budget update recalculation**
  - **Validates: Requirements 7.5**

- [ ] 25. Implement goals hook
- [ ] 25.1 Create useGoals hook
  - Implement goal progress calculation
  - Add contribution functionality
  - Create status update logic (achieved, overdue)
  - Add time remaining calculation
  - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ]* 25.2 Write property test for goal contribution
  - **Property 27: Goal contribution calculation**
  - **Validates: Requirements 8.2**

- [ ]* 25.3 Write unit test for goal completion
  - Test that 100% completion marks goal as achieved
  - _Requirements: 8.4_

- [ ]* 25.4 Write property test for goal status updates
  - **Property 29: Goal status updates**
  - **Validates: Requirements 8.5**

- [ ] 26. Implement recurring transactions hook
- [ ] 26.1 Create useRecurring hook
  - Implement transaction generation logic based on frequency
  - Add due transaction detection
  - Create pattern management functions
  - _Requirements: 12.2, 12.3_

- [ ]* 26.2 Write property test for recurring generation
  - **Property 41: Recurring transaction generation**
  - **Validates: Requirements 12.2, 12.3**

- [ ] 27. Implement export/import functionality
- [ ] 27.1 Create export/import utilities
  - Implement JSON export with all data
  - Add CSV export for transactions
  - Create import with merge/replace strategies
  - Add import validation and error handling
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ]* 27.2 Write property test for export completeness
  - **Property 33: Export data completeness**
  - **Validates: Requirements 10.1**

- [ ]* 27.3 Write property test for import integrity
  - **Property 34: Import data integrity**
  - **Validates: Requirements 10.2**

- [ ]* 27.4 Write property test for CSV format
  - **Property 35: CSV export format correctness**
  - **Validates: Requirements 10.3**

- [ ]* 27.5 Write property test for import error handling
  - **Property 36: Import error preservation**
  - **Validates: Requirements 10.5**

- [ ] 28. Implement export/import UI
- [ ] 28.1 Build ExportImportDialog component
  - Add export to JSON button
  - Add export to CSV button
  - Create file import input
  - Implement merge/replace strategy selector
  - Show import validation errors
  - Use shadcn/ui Dialog and Alert components
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 29. Connect UI to real data
  - Remove mock data from all components
  - Wire up all hooks to components
  - Test data flow from context through hooks to UI
  - Verify all CRUD operations work end-to-end
  - _Requirements: All_

- [ ] 30. Add form validation and error handling
  - Implement validation for all forms (accounts, transactions, budgets, goals)
  - Add error messages for invalid inputs
  - Handle edge cases (negative amounts, past dates, etc.)
  - _Requirements: All form-related requirements_

- [ ] 31. Optimize performance
  - Add React.memo to expensive components
  - Implement useMemo for calculations
  - Add useCallback for event handlers
  - Test with large datasets (1000+ transactions)
  - _Requirements: All_

- [ ] 32. Ensure accessibility
  - Add ARIA labels to all interactive elements
  - Test keyboard navigation
  - Verify color contrast in both themes
  - Add focus indicators
  - Test with screen reader
  - _Requirements: All UI requirements_

- [ ] 33. Final checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Fix any failing tests
  - Verify all requirements are met
  - Ask the user if questions arise
