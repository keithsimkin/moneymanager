import { useState, useMemo, useEffect, useCallback } from 'react';
import { PlusIcon as Plus, ArrowTrendingUpIcon as TrendingUp } from '@heroicons/react/24/outline';
import { useFinance } from '@/contexts/FinanceContext';
import type { Goal } from '@/types';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm, type GoalFormData } from '@/components/GoalForm';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'contribute'>('create');
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  // Update goal statuses based on deadline and progress
  useEffect(() => {
    const now = new Date();
    goals.forEach((goal) => {
      const deadline = new Date(goal.deadline);
      const percentage = goal.targetAmount > 0 
        ? (goal.currentAmount / goal.targetAmount) * 100 
        : 0;

      let newStatus: Goal['status'] = goal.status;

      if (percentage >= 100) {
        newStatus = 'achieved';
      } else if (deadline < now) {
        newStatus = 'overdue';
      } else {
        newStatus = 'active';
      }

      // Update if status changed
      if (newStatus !== goal.status) {
        updateGoal(goal.id, { status: newStatus });
      }
    });
  }, [goals, updateGoal]);

  // Calculate goals summary
  const goalsSummary = useMemo(() => {
    const active = goals.filter((g) => g.status === 'active').length;
    const achieved = goals.filter((g) => g.status === 'achieved').length;
    const overdue = goals.filter((g) => g.status === 'overdue').length;

    return { active, achieved, overdue };
  }, [goals]);

  const handleCreateGoal = useCallback(() => {
    setFormMode('create');
    setEditingGoal(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditGoal = useCallback((goal: Goal) => {
    setFormMode('edit');
    setEditingGoal(goal);
    setIsFormOpen(true);
  }, []);

  const handleContributeToGoal = useCallback((goal: Goal) => {
    setFormMode('contribute');
    setEditingGoal(goal);
    setIsFormOpen(true);
  }, []);

  const handleDeleteGoal = useCallback((goalId: string) => {
    setDeletingGoalId(goalId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingGoalId) {
      deleteGoal(deletingGoalId);
      setDeletingGoalId(null);
    }
  }, [deletingGoalId, deleteGoal]);

  const handleFormSubmit = useCallback((data: GoalFormData) => {
    if (formMode === 'edit' && editingGoal) {
      // Edit mode
      updateGoal(editingGoal.id, {
        name: data.name,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
      });
    } else if (formMode === 'contribute' && editingGoal) {
      // Contribute mode
      updateGoal(editingGoal.id, {
        currentAmount: data.currentAmount,
      });
    } else {
      // Create mode
      addGoal(data);
    }
  }, [formMode, editingGoal, updateGoal, addGoal]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Goals</h1>
          <p className="text-muted-foreground">
            Set financial goals and track your progress towards achieving them.
          </p>
        </div>
        <Button onClick={handleCreateGoal}>
          <Plus />
          Create Goal
        </Button>
      </div>

      {/* Goals Summary */}
      {goals.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active:</span>
            <Badge variant="secondary">{goalsSummary.active}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Achieved:</span>
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
              {goalsSummary.achieved}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overdue:</span>
            <Badge variant="destructive">{goalsSummary.overdue}</Badge>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No goals yet"
          description="Set financial goals with target amounts and deadlines to stay motivated and track your progress."
          actionLabel="Create Your First Goal"
          onAction={handleCreateGoal}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={handleContributeToGoal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Goal Form Dialog */}
      <GoalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        goal={editingGoal}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingGoalId} onOpenChange={() => setDeletingGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
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
