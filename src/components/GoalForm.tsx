import { useState, useEffect } from 'react';
import type { Goal } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GoalFormData) => void;
  goal?: Goal;
  mode?: 'create' | 'edit' | 'contribute';
}

export interface GoalFormData {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: Goal['status'];
}

export function GoalForm({ open, onOpenChange, onSubmit, goal, mode = 'create' }: GoalFormProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    status: 'active',
  });

  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof GoalFormData | 'contribution', string>>>({});

  // Reset form when dialog opens/closes or goal changes
  useEffect(() => {
    if (open) {
      if (goal && mode === 'edit') {
        // Edit mode - populate with existing goal data
        setFormData({
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          deadline: goal.deadline.split('T')[0], // Convert ISO to YYYY-MM-DD
          status: goal.status,
        });
      } else if (goal && mode === 'contribute') {
        // Contribute mode - just need the contribution amount
        setContributionAmount(0);
      } else {
        // Create mode - reset to defaults
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData({
          name: '',
          targetAmount: 0,
          currentAmount: 0,
          deadline: tomorrow.toISOString().split('T')[0],
          status: 'active',
        });
      }
      setErrors({});
    }
  }, [open, goal, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GoalFormData | 'contribution', string>> = {};

    if (mode === 'contribute') {
      if (isNaN(contributionAmount) || contributionAmount <= 0) {
        newErrors.contribution = 'Contribution must be a positive number';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (isNaN(formData.targetAmount) || formData.targetAmount <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }

    if (mode === 'create' && (isNaN(formData.currentAmount) || formData.currentAmount < 0)) {
      newErrors.currentAmount = 'Current amount must be zero or positive';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (mode === 'contribute' && goal) {
        // For contribution, update the current amount
        const submitData: GoalFormData = {
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount + contributionAmount,
          deadline: goal.deadline,
          status: goal.status,
        };
        onSubmit(submitData);
      } else {
        // Convert date to ISO timestamp
        const submitData = {
          ...formData,
          deadline: new Date(formData.deadline).toISOString(),
        };
        onSubmit(submitData);
      }
      onOpenChange(false);
    }
  };

  // Render contribution form
  if (mode === 'contribute' && goal) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
            <DialogDescription>
              Add funds to your <strong>{goal.name}</strong> goal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="contribution">Contribution Amount</Label>
                <Input
                  id="contribution"
                  type="number"
                  step="0.01"
                  min="0"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  aria-invalid={!!errors.contribution}
                  autoFocus
                />
                {errors.contribution && (
                  <p className="text-sm text-destructive">{errors.contribution}</p>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Current:</span>
                  <span>${goal.currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>After contribution:</span>
                  <span className="font-medium">
                    ${(goal.currentAmount + contributionAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span>${goal.targetAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Contribution</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Render create/edit form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Goal' : 'Create Goal'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update your goal information.'
              : 'Set a financial goal to track your progress towards a target amount.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                aria-invalid={!!errors.targetAmount}
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">{errors.targetAmount}</p>
              )}
            </div>

            {mode === 'create' && (
              <div className="grid gap-2">
                <Label htmlFor="currentAmount">Starting Amount (Optional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  aria-invalid={!!errors.currentAmount}
                />
                {errors.currentAmount && (
                  <p className="text-sm text-destructive">{errors.currentAmount}</p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                aria-invalid={!!errors.deadline}
              />
              {errors.deadline && (
                <p className="text-sm text-destructive">{errors.deadline}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'edit' ? 'Save Changes' : 'Create Goal'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
