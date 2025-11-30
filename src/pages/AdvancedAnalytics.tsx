import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { FinancialHealthCard } from '@/components/FinancialHealthCard';
import { CashflowForecastCard } from '@/components/CashflowForecastCard';
import { BurnRateCard } from '@/components/BurnRateCard';
import { NetWorthTrendCard } from '@/components/NetWorthTrendCard';
import { CategoryInsightsCard } from '@/components/CategoryInsightsCard';
import { SavingsOpportunitiesCard } from '@/components/SavingsOpportunitiesCard';
import { SpendingHeatmapCard } from '@/components/SpendingHeatmapCard';
import { AnomalyDetectionCard } from '@/components/AnomalyDetectionCard';
import { IncomeStabilityCard } from '@/components/IncomeStabilityCard';
import { DisposableIncomeCard } from '@/components/DisposableIncomeCard';
import { SparklesIcon as Sparkles } from '@heroicons/react/24/outline';

export default function AdvancedAnalytics() {
  const {
    financialHealthScore,
    cashflowForecast,
    burnRateData,
    netWorthTrend,
    categoryInsights,
    savingsVelocity,
    incomeStability,
    disposableIncome,
    spendingHeatmap,
    anomalies,
    savingsOpportunities,
  } = useAdvancedAnalytics();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            AI-Powered Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced insights and predictions powered by artificial intelligence
          </p>
        </div>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FinancialHealthCard data={financialHealthScore} />
        <BurnRateCard data={burnRateData} />
        <IncomeStabilityCard data={incomeStability} />
      </div>

      {/* Forecasting & Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CashflowForecastCard data={cashflowForecast} />
        <DisposableIncomeCard data={disposableIncome} />
      </div>

      {/* Net Worth Trend - Full Width */}
      <NetWorthTrendCard data={netWorthTrend} />

      {/* Insights & Opportunities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryInsightsCard data={categoryInsights} />
        <SavingsOpportunitiesCard data={savingsOpportunities} />
      </div>

      {/* Behavioral Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingHeatmapCard data={spendingHeatmap} />
        <AnomalyDetectionCard data={anomalies} />
      </div>

      {/* Savings Velocity (if available) */}
      {savingsVelocity && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Savings Velocity</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Rate</p>
              <p className="text-2xl font-bold">
                ${savingsVelocity.weeklyRate.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rate</p>
              <p className="text-2xl font-bold">
                ${savingsVelocity.monthlyRate.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Acceleration Needed</p>
              <p className="text-2xl font-bold">
                {savingsVelocity.accelerationNeeded > 0 ? '+' : ''}{savingsVelocity.accelerationNeeded}%
              </p>
            </div>
          </div>
          {savingsVelocity.projectedCompletion && (
            <p className="text-sm text-muted-foreground mt-4">
              Projected goal completion: {new Date(savingsVelocity.projectedCompletion).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
