import { useState, useMemo } from 'react';
import { Plus, AlertTriangle, AlertCircle, Target } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
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
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  // Calculate spending for a budget
  const calculateSpent = (budget: Budget): number => {
    const startDate = new Date(budget.startDate);
    
    // Calculate the end date based on period
    let endDate = new Date(startDate);
    switch (budget.period) {
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    // Filter transactions for this category within the budget period
    const categoryTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.category === budget.category &&
        t.type === 'expense' &&
        transactionDate >= startDate &&
        transactionDate < endDate
      );
    });

    // Sum up the absolute values of expense amounts
    return categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  // Calculate budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts: Array<{ budget: Budget; percentage: number; type: 'warning' | 'exceeded' }> = [];
    
    budgets.forEach((budget) => {
      const spent = calculateSpent(budget);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      if (percentage >= 100) {
        alerts.push({ budget, percentage, type: 'exceeded' });
      } else if (percentage >= 80) {
        alerts.push({ budget, percentage, type: 'warning' });
      }
    });

    return alerts;
  }, [budgets, transactions]);

  const handleCreateBudget = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    setDeletingBudgetId(budgetId);
  };

  const confirmDelete = () => {
    if (deletingBudgetId) {
      deleteBudget(deletingBudgetId);
      setDeletingBudgetId(null);
    }
  };

  const handleFormSubmit = (data: BudgetFormData) => {
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
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Budgets</h1>
          <p className="text-muted-foreground">
            Set spending limits and track your budget progress.
          </p>
        </div>
        <Button onClick={handleCreateBudget}>
          <Plus />
          Create Budget
        </Button>
      </div>

      {/* Budget Alerts Summary */}
      {budgetAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {budgetAlerts.map((alert) => (
            <Alert
              key={alert.budget.id}
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
                Your <strong>{alert.budget.category}</strong> budget is at{' '}
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={calculateSpent(budget)}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
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
