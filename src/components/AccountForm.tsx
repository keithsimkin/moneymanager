import { useState, useEffect } from 'react';
import type { Account } from '@/types';
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

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AccountFormData) => void;
  account?: Account;
}

export interface AccountFormData {
  name: string;
  type: Account['type'];
  initialBalance: number;
  currency: string;
}

const CURRENCY_REGEX = /^[A-Z]{3}$/;

export function AccountForm({ open, onOpenChange, onSubmit, account }: AccountFormProps) {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'checking',
    initialBalance: 0,
    currency: 'USD',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});

  // Reset form when dialog opens/closes or account changes
  useEffect(() => {
    if (open) {
      if (account) {
        // Edit mode - populate with existing account data
        setFormData({
          name: account.name,
          type: account.type,
          initialBalance: account.initialBalance,
          currency: account.currency,
        });
      } else {
        // Create mode - reset to defaults
        setFormData({
          name: '',
          type: 'checking',
          initialBalance: 0,
          currency: 'USD',
        });
      }
      setErrors({});
    }
  }, [open, account]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};

    // Validate account name
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Account name must be 100 characters or less';
    }

    // Validate initial balance
    if (isNaN(formData.initialBalance)) {
      newErrors.initialBalance = 'Initial balance must be a valid number';
    } else if (!isFinite(formData.initialBalance)) {
      newErrors.initialBalance = 'Initial balance must be a finite number';
    }

    // Validate currency
    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    } else if (!/^[A-Z]{3}$/.test(formData.currency.toUpperCase())) {
      newErrors.currency = 'Currency must be a 3-letter code (e.g., USD, EUR)';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Account' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {account
              ? 'Update your account information.'
              : 'Add a new bank account to track your finances.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Checking"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as Account['type'] })
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="initialBalance">Initial Balance</Label>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                value={formData.initialBalance}
                onChange={(e) =>
                  setFormData({ ...formData, initialBalance: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                aria-invalid={!!errors.initialBalance}
              />
              {errors.initialBalance && (
                <p className="text-sm text-destructive">{errors.initialBalance}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                placeholder="USD"
                maxLength={3}
                aria-invalid={!!errors.currency}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{account ? 'Save Changes' : 'Create Account'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
