import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { Transaction, Account } from '@/types';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
  accounts: Account[];
  transaction?: Transaction;
}

export interface TransactionFormData {
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
  recurringId?: string;
}

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  accounts,
  transaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    accountId: '',
    amount: 0,
    description: '',
    category: CATEGORIES[0],
    date: new Date().toISOString(),
    type: 'expense',
    isRecurring: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (transaction) {
        // Edit mode - populate with existing transaction data
        setFormData({
          accountId: transaction.accountId,
          amount: Math.abs(transaction.amount),
          description: transaction.description,
          category: transaction.category,
          date: transaction.date,
          type: transaction.type,
          isRecurring: transaction.isRecurring,
          recurringId: transaction.recurringId,
        });
      } else {
        // Create mode - reset to defaults
        setFormData({
          accountId: accounts.length > 0 ? accounts[0].id : '',
          amount: 0,
          description: '',
          category: CATEGORIES[0],
          date: new Date().toISOString(),
          type: 'expense',
          isRecurring: false,
        });
      }
      setErrors({});
    }
  }, [open, transaction, accounts]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

    // Validate account selection
    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    // Validate amount
    if (isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (!isFinite(formData.amount)) {
      newErrors.amount = 'Amount must be a finite number';
    } else if (formData.amount > 999999999.99) {
      newErrors.amount = 'Amount is too large';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const transactionDate = new Date(formData.date);
      const now = new Date();
      // Allow transactions up to 1 day in the future to account for timezone differences
      const maxFutureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      if (isNaN(transactionDate.getTime())) {
        newErrors.date = 'Invalid date';
      } else if (transactionDate > maxFutureDate) {
        newErrors.date = 'Transaction date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      onOpenChange(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date: date.toISOString() });
      setCalendarOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Create Transaction'}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? 'Update your transaction details.'
              : 'Add a new transaction to track your finances.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => setFormData({ ...formData, accountId: value })}
                >
                  <SelectTrigger id="account" className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accountId && (
                  <p className="text-sm text-destructive">{errors.accountId}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as 'income' | 'expense' })
                  }
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Grocery shopping"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.date && 'text-muted-foreground',
                      errors.date && 'border-destructive'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(new Date(formData.date), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.date)}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                This is a recurring transaction
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {transaction ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
