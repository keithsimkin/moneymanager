import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, AlertTriangle, TrendingUp } from 'lucide-react';
import type { DisposableIncome } from '@/hooks/useAdvancedAnalytics';

interface DisposableIncomeCardProps {
  data: DisposableIncome;
}

export function DisposableIncomeCard({ data }: DisposableIncomeCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Disposable Income
        </CardTitle>
        <CardDescription>Money available after bills and commitments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${
          data.warning 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
            : 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20'
        }`}>
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className={`text-4xl font-bold ${
            data.warning ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {data.percentage.toFixed(1)}% of income
          </p>
        </div>

        {data.warning && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-red-800 dark:text-red-200">
                Negative Disposable Income
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Your expenses exceed your income this month. Consider reducing spending or increasing income.
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Next Month Projection</p>
            <TrendingUp className={`h-4 w-4 ${
              data.projectedNextMonth >= data.amount ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(data.projectedNextMonth)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on average income and recurring expenses
          </p>
        </div>

        {!data.warning && data.amount > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 You have {formatCurrency(data.amount)} available for discretionary spending or savings this month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
