import { memo } from 'react';
import { 
  PencilIcon as Edit2,
  TrashIcon as Trash2,
  ExclamationTriangleIcon as AlertTriangle,
  ExclamationCircleIcon as AlertCircle
} from '@heroicons/react/24/outline';
import type { Budget } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export const BudgetCard = memo(function BudgetCard({ budget, spent, onEdit, onDelete }: BudgetCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPeriodLabel = (period: Budget['period']) => {
    const labels: Record<Budget['period'], string> = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    };
    return labels[period];
  };

  // Calculate progress percentage
  const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
  const remaining = budget.amount - spent;

  // Determine status for warning/alert indicators
  const getStatus = () => {
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  const status = getStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {budget.category}
          {status === 'exceeded' && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="size-3" />
              Exceeded
            </Badge>
          )}
          {status === 'warning' && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="size-3" />
              Warning
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{getPeriodLabel(budget.period)} Budget</CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(budget)}
              aria-label={`Edit ${budget.category} budget`}
            >
              <Edit2 />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(budget.id)}
              aria-label={`Delete ${budget.category} budget`}
            >
              <Trash2 />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium">{formatCurrency(spent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">{formatCurrency(budget.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className={`font-medium ${remaining < 0 ? 'text-destructive' : ''}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{percentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={percentage} 
              className={
                status === 'exceeded' 
                  ? 'bg-destructive/20 [&>div]:bg-destructive' 
                  : status === 'warning'
                  ? 'bg-yellow-500/20 [&>div]:bg-yellow-500'
                  : ''
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
