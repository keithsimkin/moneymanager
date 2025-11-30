import { useState, useMemo } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import type { Account } from '@/types';
import { AccountCard } from '@/components/AccountCard';
import { AccountForm, type AccountFormData } from '@/components/AccountForm';
import { EmptyState } from '@/components/EmptyState';
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

export default function Accounts() {
  const { accounts, transactions, addAccount, updateAccount, deleteAccount } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  // Calculate balance for each account
  const calculateBalance = (accountId: string): number => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return 0;

    const accountTransactions = transactions.filter((t) => t.accountId === accountId);
    const transactionTotal = accountTransactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    return account.initialBalance + transactionTotal;
  };

  // Calculate total balance across all accounts
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => {
      return sum + calculateBalance(account.id);
    }, 0);
  }, [accounts, transactions]);

  const handleCreateAccount = () => {
    setEditingAccount(undefined);
    setIsFormOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    setDeletingAccountId(accountId);
  };

  const confirmDelete = () => {
    if (deletingAccountId) {
      deleteAccount(deletingAccountId);
      setDeletingAccountId(null);
    }
  };

  const handleFormSubmit = (data: AccountFormData) => {
    if (editingAccount) {
      // Edit mode
      updateAccount(editingAccount.id, {
        name: data.name,
        type: data.type,
        currency: data.currency,
      });
    } else {
      // Create mode
      addAccount(data);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts and track your balances.
          </p>
        </div>
        <Button onClick={handleCreateAccount}>
          <Plus />
          Create Account
        </Button>
      </div>

      {/* Total Balance Summary */}
      <div className="mb-6 p-6 bg-primary/5 rounded-lg border">
        <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
        <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
      </div>

      {/* Account List */}
      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No accounts yet"
          description="Get started by creating your first account to track your finances."
          actionLabel="Create Your First Account"
          onAction={handleCreateAccount}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              balance={calculateBalance(account.id)}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
            />
          ))}
        </div>
      )}

      {/* Account Form Dialog */}
      <AccountForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        account={editingAccount}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAccountId} onOpenChange={() => setDeletingAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? This will also delete all associated
              transactions. This action cannot be undone.
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
