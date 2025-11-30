import { memo } from 'react';
import { PencilIcon as Edit2, TrashIcon as Trash2, MagnifyingGlassIcon as Search } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { Transaction, Account } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export const TransactionList = memo(function TransactionList({
  transactions,
  accounts,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const formatCurrency = (amount: number, accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    const currency = account?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No transactions found"
        description="Try adjusting your filters or add a new transaction to get started."
      />
    );
  }

  return (
    <div role="region" aria-label="Transactions table">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.accountId)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(transaction)}
                      aria-label={`Edit ${transaction.description}`}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(transaction.id)}
                      aria-label={`Delete ${transaction.description}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {transaction.description}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(transaction)}
                  aria-label={`Edit ${transaction.description}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(transaction.id)}
                  aria-label={`Delete ${transaction.description}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-gray-900 dark:text-white">{transaction.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="text-gray-900 dark:text-white">{getAccountName(transaction.accountId)}</span>
                </div>
              </div>
              <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                {transaction.type}
              </Badge>
            </div>
            
            <div className="pt-2 border-t border-gray-200 dark:border-border">
              <div
                className={`text-lg font-semibold text-right ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, transaction.accountId)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
