import { useState, useMemo, useCallback } from 'react';
import { Plus, Receipt, Wallet } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import type { Transaction, FilterOptions } from '@/types';
import { TransactionList } from '@/components/TransactionList';
import { FilterBar } from '@/components/FilterBar';
import { TransactionForm, type TransactionFormData } from '@/components/TransactionForm';
import { EmptyState } from '@/components/EmptyState';
import { RecurringTransactionDialog } from '@/components/RecurringTransactionDialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Transactions() {
  const { 
    accounts, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    updateRecurringPattern,
    deleteRecurringPattern
  } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // State for recurring transaction prompts
  const [recurringEditDialog, setRecurringEditDialog] = useState<{
    open: boolean;
    transaction?: Transaction;
    formData?: TransactionFormData;
  }>({ open: false });
  const [recurringDeleteDialog, setRecurringDeleteDialog] = useState<{
    open: boolean;
    transactionId?: string;
  }>({ open: false });

  // Filter transactions based on active filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((t) => new Date(t.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter((t) => new Date(t.date) <= endDate);
    }

    // Sort by date (most recent first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [transactions, filters]);

  const handleCreateTransaction = useCallback(() => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }, []);

  const handleDeleteTransaction = useCallback((transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    // Check if this is a recurring transaction
    if (transaction?.isRecurring && transaction.recurringId) {
      setRecurringDeleteDialog({ open: true, transactionId });
    } else {
      setDeletingTransactionId(transactionId);
    }
  }, [transactions]);

  const confirmDelete = useCallback(() => {
    if (deletingTransactionId) {
      deleteTransaction(deletingTransactionId);
      setDeletingTransactionId(null);
    }
  }, [deletingTransactionId, deleteTransaction]);

  const handleDeleteThisInstance = useCallback(() => {
    if (recurringDeleteDialog.transactionId) {
      // Just delete this transaction instance
      deleteTransaction(recurringDeleteDialog.transactionId);
      setRecurringDeleteDialog({ open: false });
    }
  }, [recurringDeleteDialog.transactionId, deleteTransaction]);

  const handleDeleteAllInstances = useCallback(() => {
    if (recurringDeleteDialog.transactionId) {
      const transaction = transactions.find(t => t.id === recurringDeleteDialog.transactionId);
      
      if (transaction?.recurringId) {
        // Delete the recurring pattern
        deleteRecurringPattern(transaction.recurringId);
        
        // Delete all transactions with this recurringId
        transactions
          .filter(t => t.recurringId === transaction.recurringId)
          .forEach(t => deleteTransaction(t.id));
      }
      
      setRecurringDeleteDialog({ open: false });
    }
  }, [recurringDeleteDialog.transactionId, transactions, deleteRecurringPattern, deleteTransaction]);

  const handleFormSubmit = useCallback((data: TransactionFormData) => {
    if (editingTransaction) {
      // Check if this is a recurring transaction being edited
      if (editingTransaction.isRecurring && editingTransaction.recurringId) {
        // Show the recurring edit dialog
        setRecurringEditDialog({ 
          open: true, 
          transaction: editingTransaction,
          formData: data 
        });
        setIsFormOpen(false);
      } else {
        // Edit mode - non-recurring or new recurring
        updateTransaction(editingTransaction.id, {
          accountId: data.accountId,
          amount: data.type === 'income' ? data.amount : -data.amount,
          description: data.description,
          category: data.category,
          date: data.date,
          type: data.type,
          isRecurring: data.isRecurring,
          recurringId: data.recurringId,
        });
      }
    } else {
      // Create mode
      addTransaction({
        accountId: data.accountId,
        amount: data.type === 'income' ? data.amount : -data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        type: data.type,
        isRecurring: data.isRecurring,
        recurringId: data.recurringId,
      });
    }
  }, [editingTransaction, updateTransaction, addTransaction]);

  const handleEditThisInstance = useCallback(() => {
    if (recurringEditDialog.transaction && recurringEditDialog.formData) {
      const data = recurringEditDialog.formData;
      
      // Update only this transaction instance, remove recurring link
      updateTransaction(recurringEditDialog.transaction.id, {
        accountId: data.accountId,
        amount: data.type === 'income' ? data.amount : -data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        type: data.type,
        isRecurring: false, // Mark as non-recurring
        recurringId: undefined, // Remove recurring link
      });
      
      setRecurringEditDialog({ open: false });
    }
  }, [recurringEditDialog.transaction, recurringEditDialog.formData, updateTransaction]);

  const handleEditAllInstances = useCallback(() => {
    if (recurringEditDialog.transaction && recurringEditDialog.formData) {
      const data = recurringEditDialog.formData;
      const transaction = recurringEditDialog.transaction;
      
      if (transaction.recurringId) {
        // Update the recurring pattern
        updateRecurringPattern(transaction.recurringId, {
          accountId: data.accountId,
          amount: data.type === 'income' ? data.amount : -data.amount,
          description: data.description,
          category: data.category,
          type: data.type,
        });
        
        // Update all future transactions with this recurringId
        const currentDate = new Date(transaction.date);
        transactions
          .filter(t => 
            t.recurringId === transaction.recurringId && 
            new Date(t.date) >= currentDate
          )
          .forEach(t => {
            updateTransaction(t.id, {
              accountId: data.accountId,
              amount: data.type === 'income' ? data.amount : -data.amount,
              description: data.description,
              category: data.category,
              type: data.type,
            });
          });
      }
      
      setRecurringEditDialog({ open: false });
    }
  }, [recurringEditDialog.transaction, recurringEditDialog.formData, transactions, updateRecurringPattern, updateTransaction]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your transactions.
          </p>
        </div>
        <Button onClick={handleCreateTransaction} disabled={accounts.length === 0}>
          <Plus />
          Create Transaction
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Filtered Transaction Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
      </div>

      {/* Transaction List */}
      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No accounts yet"
          description="Create an account first to start tracking your transactions."
        />
      ) : filteredTransactions.length === 0 && transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Start tracking your income and expenses by creating your first transaction."
          actionLabel="Create Your First Transaction"
          onAction={handleCreateTransaction}
        />
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          accounts={accounts}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        accounts={accounts}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog (for non-recurring transactions) */}
      <AlertDialog open={!!deletingTransactionId} onOpenChange={() => setDeletingTransactionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recurring Transaction Edit Dialog */}
      <RecurringTransactionDialog
        open={recurringEditDialog.open}
        onOpenChange={(open) => setRecurringEditDialog({ open })}
        action="edit"
        onThisInstance={handleEditThisInstance}
        onAllInstances={handleEditAllInstances}
      />

      {/* Recurring Transaction Delete Dialog */}
      <RecurringTransactionDialog
        open={recurringDeleteDialog.open}
        onOpenChange={(open) => setRecurringDeleteDialog({ open })}
        action="delete"
        onThisInstance={handleDeleteThisInstance}
        onAllInstances={handleDeleteAllInstances}
      />
    </div>
  );
}
