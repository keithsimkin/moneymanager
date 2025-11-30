import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LightBulbIcon as Lightbulb, ArrowTrendingDownIcon as TrendingDown } from '@heroicons/react/24/outline';
import type { SavingsOpportunity } from '@/hooks/useAdvancedAnalytics';

interface SavingsOpportunitiesCardProps {
  data: SavingsOpportunity[];
}

export function SavingsOpportunitiesCard({ data }: SavingsOpportunitiesCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const totalPotentialSavings = data.reduce((sum, opp) => sum + opp.potentialSavings, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Savings Opportunities
        </CardTitle>
        <CardDescription>AI-identified ways to save money</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-900/20 dark:to-green-900/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Potential Savings</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPotentialSavings)}</p>
          <p className="text-sm text-muted-foreground mt-1">per month</p>
        </div>

        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{opportunity.category}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(opportunity.potentialSavings)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{opportunity.recommendation}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, opportunity.impact)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{opportunity.impact}% impact</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Great job! No major savings opportunities detected.</p>
            <p className="text-sm mt-2">You're managing your budget well.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
