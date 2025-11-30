import { useState, useCallback } from 'react';
import { 
  PlusIcon as Plus,
  ExclamationTriangleIcon as AlertTriangle,
  ExclamationCircleIcon as AlertCircle,
  FlagIcon as Target
} from '@heroicons/react/24/outline';
import { useFinance } from '@/contexts/FinanceContext';
import { useBudgets } from '@/hooks/useBudgets';
import type { Budget } from '@/types';
import { BudgetCard } from '@/components/BudgetCard';
import { BudgetForm, type BudgetFormData } from '@/components/BudgetForm';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

export default function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinance();
  const { getBudgetProgress, checkBudgetAlerts } = useBudgets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  // Get budget alerts using the hook
  const budgetAlerts = checkBudgetAlerts();

  const handleCreateBudget = useCallback(() => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditBudget = useCallback((budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  }, []);

  const handleDeleteBudget = useCallback((budgetId: string) => {
    setDeletingBudgetId(budgetId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingBudgetId) {
      deleteBudget(deletingBudgetId);
      setDeletingBudgetId(null);
    }
  }, [deletingBudgetId, deleteBudget]);

  const handleFormSubmit = useCallback((data: BudgetFormData) => {
    if (editingBudget) {
      // Edit mode
      updateBudget(editingBudget.id, {
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: data.startDate,
      });
    } else {
      // Create mode
      addBudget(data);
    }
  }, [editingBudget, updateBudget, addBudget]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Budgets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Set spending limits and track your budget progress.
          </p>
        </div>
        <Button onClick={handleCreateBudget} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Budget Alerts Summary */}
      {budgetAlerts.length > 0 && (
        <div className="mb-6 space-y-2 sm:space-y-3">
          {budgetAlerts.map((alert) => (
            <Alert
              key={alert.budgetId}
              variant={alert.type === 'exceeded' ? 'destructive' : 'default'}
              className={alert.type === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}
            >
              {alert.type === 'exceeded' ? (
                <AlertCircle className="size-4" />
              ) : (
                <AlertTriangle className="size-4" />
              )}
              <AlertTitle>
                {alert.type === 'exceeded' ? 'Budget Exceeded' : 'Budget Warning'}
              </AlertTitle>
              <AlertDescription>
                Your <strong>{alert.category}</strong> budget is at{' '}
                <strong>{alert.percentage.toFixed(1)}%</strong>.
                {alert.type === 'exceeded'
                  ? ' You have exceeded your budget limit.'
                  : ' You are approaching your budget limit.'}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Budget List */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No budgets yet"
          description="Set spending limits for different categories to help control your expenses and reach your financial goals."
          actionLabel="Create Your First Budget"
          onAction={handleCreateBudget}
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget.id);
            return (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={progress?.spent ?? 0}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            );
          })}
        </div>
      )}

      {/* Budget Form Dialog */}
      <BudgetForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        budget={editingBudget}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBudgetId} onOpenChange={() => setDeletingBudgetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
