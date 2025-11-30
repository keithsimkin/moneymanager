import { Edit2, Trash2, Search } from 'lucide-react';
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

export function TransactionList({
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
  );
}
