import { useState, useEffect } from 'react';
import type { Budget } from '@/types';
import { CATEGORIES } from '@/utils/categories';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BudgetFormData) => void;
  budget?: Budget;
}

export interface BudgetFormData {
  category: string;
  amount: number;
  period: Budget['period'];
  startDate: string;
}

export function BudgetForm({ open, onOpenChange, onSubmit, budget }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: CATEGORIES[0],
    amount: 0,
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BudgetFormData, string>>>({});

  // Reset form when dialog opens/closes or budget changes
  useEffect(() => {
    if (open) {
      if (budget) {
        // Edit mode - populate with existing budget data
        setFormData({
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
          startDate: budget.startDate.split('T')[0], // Convert ISO to YYYY-MM-DD
        });
      } else {
        // Create mode - reset to defaults
        setFormData({
          category: CATEGORIES[0],
          amount: 0,
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({});
    }
  }, [open, budget]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BudgetFormData, string>> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert date to ISO timestamp
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
      };
      onSubmit(submitData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
          <DialogDescription>
            {budget
              ? 'Update your budget information.'
              : 'Set a spending limit for a category to track your expenses.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                aria-invalid={!!errors.amount}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) =>
                  setFormData({ ...formData, period: value as Budget['period'] })
                }
              >
                <SelectTrigger id="period" className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                aria-invalid={!!errors.startDate}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{budget ? 'Save Changes' : 'Create Budget'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
