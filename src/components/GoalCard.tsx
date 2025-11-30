import { memo } from 'react';
import { Edit2, Trash2, Plus, CheckCircle2, Clock } from 'lucide-react';
import type { Goal } from '@/types';
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

interface GoalCardProps {
  goal: Goal;
  onContribute: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export const GoalCard = memo(function GoalCard({ goal, onContribute, onEdit, onDelete }: GoalCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate progress percentage
  const percentage = goal.targetAmount > 0 
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
    : 0;
  const remaining = goal.targetAmount - goal.currentAmount;

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day remaining';
    } else if (diffDays < 30) {
      return `${diffDays} days remaining`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} remaining`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} remaining`;
    }
  };

  const timeRemaining = getTimeRemaining();

  // Get status badge
  const getStatusBadge = () => {
    if (goal.status === 'achieved') {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-3" />
          Achieved
        </Badge>
      );
    }
    if (goal.status === 'overdue') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="size-3" />
          Overdue
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {goal.name}
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Target: {formatCurrency(goal.targetAmount)} by{' '}
          {new Date(goal.deadline).toLocaleDateString()}
        </CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onContribute(goal)}
              aria-label={`Contribute to ${goal.name}`}
              disabled={goal.status === 'achieved'}
            >
              <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(goal)}
              aria-label={`Edit ${goal.name}`}
            >
              <Edit2 />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(goal.id)}
              aria-label={`Delete ${goal.name}`}
            >
              <Trash2 />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Amount</span>
            <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Amount</span>
            <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className={`font-medium ${remaining <= 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
              {formatCurrency(Math.max(remaining, 0))}
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
                goal.status === 'achieved'
                  ? 'bg-green-500/20 [&>div]:bg-green-500'
                  : ''
              }
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
