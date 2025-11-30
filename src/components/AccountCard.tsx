import { memo } from 'react';
import { PencilIcon as Edit2, TrashIcon as Trash2 } from '@heroicons/react/24/outline';
import type { Account } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccountCardProps {
  account: Account;
  balance: number;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

export const AccountCard = memo(function AccountCard({ account, balance, onEdit, onDelete }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    }).format(amount);
  };

  const getAccountTypeLabel = (type: Account['type']) => {
    const labels: Record<Account['type'], string> = {
      checking: 'Checking',
      savings: 'Savings',
      credit: 'Credit',
      investment: 'Investment',
    };
    return labels[type];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>{getAccountTypeLabel(account.type)}</CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(account)}
              aria-label={`Edit ${account.name}`}
            >
              <Edit2 />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(account.id)}
              aria-label={`Delete ${account.name}`}
            >
              <Trash2 />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
      </CardContent>
    </Card>
  );
});
