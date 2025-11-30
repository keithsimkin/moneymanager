# Advanced Analytics Features

MoneyManager now includes AI-powered advanced analytics that provide deep insights into your financial health and behavior.

## Features Overview

### 1. Financial Health Score (0-100)
A comprehensive score based on:
- **Spending Patterns** (20 points): How well you stay within budgets
- **Savings Habits** (20 points): Your savings rate and consistency
- **Debt Ratio** (20 points): Credit account balances and debt levels
- **Bill Timeliness** (20 points): Payment punctuality
- **Income Stability** (20 points): Consistency and reliability of income

**Trend Indicator**: Shows if your financial health is improving, stable, or declining.

### 2. Monthly Cashflow Forecast
Predicts the next 3 months of financial activity based on your last 3 months:
- Expected income
- Expected spending
- Expected savings
- Projected balance at month end

Uses historical averages to provide realistic projections.

### 3. Burn Rate & Runway
Critical metrics for financial sustainability:
- **Daily Burn Rate**: Average daily spending
- **Runway**: Number of days until funds run out at current spending rate
- **Projected Zero Date**: When your balance will reach zero (if applicable)
- **Warning Alerts**: Notifications when runway drops below 90 days

### 4. Net Worth Trendline (12 months)
Tracks your financial growth over time:
- **Assets**: All non-credit accounts
- **Liabilities**: Credit account balances
- **Net Worth**: Assets minus liabilities
- **Percentage Change**: Month-over-month growth

### 5. Category Insights
Advanced spending analysis by category:
- **Trend Detection**: Identifies increasing, decreasing, or stable spending
- **Growth Rate**: Percentage change from previous months
- **Risk Level**: Flags categories with high growth (potential budget risks)
- **Budget Risk Alerts**: Highlights categories exceeding normal patterns

### 6. Savings Velocity
For users with active goals:
- **Weekly Savings Rate**: Average weekly savings
- **Monthly Savings Rate**: Average monthly savings
- **Projected Completion**: When you'll reach your goal at current rate
- **Acceleration Needed**: How much to increase savings to meet deadline

### 7. Income Stability Score
Measures income reliability:
- **Score (0-100)**: Based on income variance
- **Income Sources**: Number of different income streams
- **Payment Frequency**: Weekly, bi-weekly, monthly, or irregular
- **Reliability Rating**: High, medium, or low
- **Variance**: Standard deviation of income amounts

### 8. Disposable Income Projection
Money available after commitments:
- **Current Month**: Available discretionary funds
- **Percentage of Income**: How much of income is disposable
- **Next Month Projection**: Forecast based on averages
- **Warning Alerts**: Flags negative disposable income

### 9. Time-Based Spending Heatmap
Behavioral spending patterns:
- **By Day of Week**: Which days you spend the most
- **By Time of Day**: Morning, afternoon, evening, or night spending
- **Peak Spending Identification**: Your highest spending times
- **Visual Heatmap**: Color-coded spending intensity

### 10. Anomaly Detection
AI-powered transaction monitoring:
- **Spike Detection**: Transactions 3x+ above average
- **Duplicate Detection**: Same amount/category within 24 hours
- **Suspicious Patterns**: Unusual transaction behavior
- **Severity Levels**: High, medium, or low risk
- **Detailed Descriptions**: Explanation of each anomaly

### 11. Savings Opportunities
AI-identified ways to save money:
- **Category Analysis**: Finds high-growth spending categories
- **Budget Overruns**: Identifies categories exceeding budgets
- **Potential Savings**: Dollar amount you could save
- **Recommendations**: Specific actions to reduce spending
- **Impact Percentage**: How much each opportunity affects your budget

## Accessing Advanced Analytics

1. **From Dashboard**: Click the "AI Analytics" widget or navigate via sidebar
2. **From Sidebar**: Click "AI Analytics" in the main menu
3. **Direct URL**: `/advanced-analytics`

## Dashboard Widget

The main dashboard includes an "AI-Powered Insights" widget showing:
- Financial Health Score
- Runway (days)
- Anomaly count
- Total savings opportunities

Click "View Full AI Analytics" to see all features.

## Technical Implementation

### Hook: `useAdvancedAnalytics`
Located at `src/hooks/useAdvancedAnalytics.ts`

Returns all analytics data:
```typescript
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
```

### Components
All analytics components are in `src/components/`:
- `FinancialHealthCard.tsx`
- `CashflowForecastCard.tsx`
- `BurnRateCard.tsx`
- `NetWorthTrendCard.tsx`
- `CategoryInsightsCard.tsx`
- `SavingsOpportunitiesCard.tsx`
- `SpendingHeatmapCard.tsx`
- `AnomalyDetectionCard.tsx`
- `IncomeStabilityCard.tsx`
- `DisposableIncomeCard.tsx`
- `AdvancedInsightsWidget.tsx` (dashboard widget)

### Page
Main analytics page: `src/pages/AdvancedAnalytics.tsx`

## Data Requirements

For best results:
- **Minimum**: 1 month of transaction data
- **Recommended**: 3-6 months of transaction data
- **Optimal**: 12+ months of transaction data

More data = more accurate predictions and insights.

## Performance

All calculations are memoized using React's `useMemo` hook, ensuring:
- Efficient re-computation only when data changes
- No unnecessary re-renders
- Smooth user experience even with large datasets

## Future Enhancements

Potential additions:
- Investment portfolio analysis (alpha, Sharpe ratio, volatility)
- Debt optimization recommendations
- Bill payment predictions
- Subscription detection and management
- Tax optimization insights
- Retirement planning projections
