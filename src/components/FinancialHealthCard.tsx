import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { FinancialHealthScore } from '@/hooks/useAdvancedAnalytics';

interface FinancialHealthCardProps {
  data: FinancialHealthScore;
}

export function FinancialHealthCard({ data }: FinancialHealthCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-500';
    if (score >= 60) return 'text-blue-600 dark:text-blue-500';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-blue-600';
    if (score >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const TrendIcon = data.trend === 'improving' ? TrendingUp : 
                    data.trend === 'declining' ? TrendingDown : Minus;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Financial Health Score</span>
          <TrendIcon className={`h-5 w-5 ${
            data.trend === 'improving' ? 'text-green-600' :
            data.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </CardTitle>
        <CardDescription>AI-powered assessment of your financial wellness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-5xl font-bold ${getScoreColor(data.score)}`}>
            {data.score}
          </div>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Spending Patterns</span>
              <span className="font-medium">{data.breakdown.spendingPatterns}/20</span>
            </div>
            <Progress value={(data.breakdown.spendingPatterns / 20) * 100} className={getProgressColor(data.breakdown.spendingPatterns)} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Savings Habits</span>
              <span className="font-medium">{data.breakdown.savingsHabits}/20</span>
            </div>
            <Progress value={(data.breakdown.savingsHabits / 20) * 100} className={getProgressColor(data.breakdown.savingsHabits)} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Debt Ratio</span>
              <span className="font-medium">{data.breakdown.debtRatio}/20</span>
            </div>
            <Progress value={(data.breakdown.debtRatio / 20) * 100} className={getProgressColor(data.breakdown.debtRatio)} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bill Timeliness</span>
              <span className="font-medium">{data.breakdown.billTimeliness}/20</span>
            </div>
            <Progress value={(data.breakdown.billTimeliness / 20) * 100} className={getProgressColor(data.breakdown.billTimeliness)} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Income Stability</span>
              <span className="font-medium">{data.breakdown.incomeStability}/20</span>
            </div>
            <Progress value={(data.breakdown.incomeStability / 20) * 100} className={getProgressColor(data.breakdown.incomeStability)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
