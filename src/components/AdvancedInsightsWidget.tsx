import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  SparklesIcon as Sparkles,
  ArrowTrendingUpIcon as TrendingUp,
  ExclamationTriangleIcon as AlertTriangle,
  LightBulbIcon as Lightbulb,
  ArrowRightIcon as ArrowRight
} from '@heroicons/react/24/outline';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useNavigate } from 'react-router-dom';

export function AdvancedInsightsWidget() {
  const navigate = useNavigate();
  const {
    financialHealthScore,
    burnRateData,
    anomalies,
    savingsOpportunities,
  } = useAdvancedAnalytics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-500';
    if (score >= 60) return 'text-blue-600 dark:text-blue-500';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  const totalSavingsOpportunity = savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>Advanced analytics and predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/60 dark:bg-gray-900/40 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-muted-foreground">Health Score</p>
            </div>
            <p className={`text-2xl font-bold ${getHealthColor(financialHealthScore.score)}`}>
              {financialHealthScore.score}
            </p>
          </div>

          <div className="p-3 bg-white/60 dark:bg-gray-900/40 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-muted-foreground">Runway</p>
            </div>
            <p className="text-2xl font-bold">
              {burnRateData.runwayDays > 365 ? '365+' : burnRateData.runwayDays}
              <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
            </p>
          </div>
        </div>

        {anomalies.length > 0 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">
                  {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'} detected
                </span>
              </div>
              <Badge variant="secondary">{anomalies.filter(a => a.severity === 'high').length} high</Badge>
            </div>
          </div>
        )}

        {totalSavingsOpportunity > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Savings Opportunity</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalSavingsOpportunity)}/mo
            </p>
          </div>
        )}

        <Button 
          onClick={() => navigate('/advanced-analytics')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          View Full AI Analytics
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
