import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import type { CategoryInsight } from '@/hooks/useAdvancedAnalytics';

interface CategoryInsightsCardProps {
  data: CategoryInsight[];
}

export function CategoryInsightsCard({ data }: CategoryInsightsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'high') return <Badge variant="destructive">High Risk</Badge>;
    if (risk === 'medium') return <Badge variant="secondary">Medium Risk</Badge>;
    return <Badge variant="outline">Low Risk</Badge>;
  };

  const topCategories = data.slice(0, 5);
  const highestGrowth = [...data].sort((a, b) => b.growthRate - a.growthRate)[0];
  const highestRisk = data.find(c => c.riskLevel === 'high');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Insights</CardTitle>
        <CardDescription>Advanced spending analysis by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {highestRisk && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Budget Risk Alert</p>
              <p className="text-sm text-muted-foreground">
                {highestRisk.category} spending increased by {highestRisk.growthRate.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {highestGrowth && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium mb-1">Fastest Growing Category</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{highestGrowth.category}</span>
              <span className="text-lg font-bold text-red-600">
                +{highestGrowth.growthRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">Top Spending Categories</p>
          {topCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getTrendIcon(category.trend)}
                  <span className="font-medium">{category.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(category.amount)}</p>
                  <p className={`text-xs ${
                    category.growthRate > 0 ? 'text-red-600' : 
                    category.growthRate < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {category.growthRate > 0 ? '+' : ''}{category.growthRate.toFixed(1)}%
                  </p>
                </div>
                {getRiskBadge(category.riskLevel)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
