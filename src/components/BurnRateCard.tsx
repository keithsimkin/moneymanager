import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Calendar } from 'lucide-react';
import type { BurnRateData } from '@/hooks/useAdvancedAnalytics';
import { format } from 'date-fns';

interface BurnRateCardProps {
  data: BurnRateData;
}

export function BurnRateCard({ data }: BurnRateCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getRunwayColor = (days: number) => {
    if (days > 180) return 'text-green-600 dark:text-green-500';
    if (days > 90) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Burn Rate & Runway
        </CardTitle>
        <CardDescription>How long your money will last at current spending rate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Daily Burn Rate</p>
            <p className="text-2xl font-bold">{formatCurrency(data.dailyBurnRate)}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(data.currentBalance)}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Runway</p>
              <p className={`text-3xl font-bold ${getRunwayColor(data.runwayDays)}`}>
                {data.runwayDays > 365 ? '365+' : data.runwayDays} days
              </p>
            </div>
            {data.runwayDays < 90 && (
              <AlertTriangle className="h-8 w-8 text-red-600" />
            )}
          </div>

          {data.projectedZeroDate && data.runwayDays < 365 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Projected zero date: {format(new Date(data.projectedZeroDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        {data.runwayDays < 90 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              ⚠️ Warning: Your runway is less than 90 days. Consider reducing expenses or increasing income.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
