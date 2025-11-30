import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CurrencyDollarIcon as DollarSign, ArrowTrendingUpIcon as TrendingUp } from '@heroicons/react/24/outline';
import type { IncomeStability } from '@/hooks/useAdvancedAnalytics';

interface IncomeStabilityCardProps {
  data: IncomeStability;
}

export function IncomeStabilityCard({ data }: IncomeStabilityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-500';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  const getReliabilityColor = (reliability: string) => {
    if (reliability === 'high') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (reliability === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Income Stability Score
        </CardTitle>
        <CardDescription>Measures consistency and reliability of income</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className={`text-5xl font-bold ${getScoreColor(data.score)}`}>
            {data.score}
          </div>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
          <div className="mt-3">
            <Progress value={data.score} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Income Sources</p>
            <p className="text-2xl font-bold">{data.sourceCount}</p>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Payment Frequency</p>
            <p className="text-lg font-bold capitalize">{data.paymentFrequency}</p>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Reliability</p>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getReliabilityColor(data.reliability)}`}>
              {data.reliability}
            </span>
            <span className="text-sm text-muted-foreground">
              Variance: ${data.variance.toLocaleString()}
            </span>
          </div>
        </div>

        {data.reliability === 'low' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Consider diversifying income sources or establishing more regular payment schedules.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
