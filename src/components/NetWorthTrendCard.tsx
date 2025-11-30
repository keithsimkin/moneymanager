import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { NetWorthTrend } from '@/hooks/useAdvancedAnalytics';
import { ArrowTrendingUpIcon as TrendingUp } from '@heroicons/react/24/outline';

interface NetWorthTrendCardProps {
  data: NetWorthTrend[];
}

export function NetWorthTrendCard({ data }: NetWorthTrendCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const latestNetWorth = data[data.length - 1]?.netWorth || 0;
  const previousNetWorth = data[data.length - 2]?.netWorth || 0;
  const change = latestNetWorth - previousNetWorth;
  const percentageChange = previousNetWorth !== 0 
    ? ((change / Math.abs(previousNetWorth)) * 100).toFixed(1)
    : '0.0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Net Worth Trend
        </CardTitle>
        <CardDescription>Assets minus liabilities over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Current Net Worth</p>
          <p className="text-3xl font-bold">{formatCurrency(latestNetWorth)}</p>
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{formatCurrency(change)} ({change >= 0 ? '+' : ''}{percentageChange}%) from last month
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Line type="monotone" dataKey="assets" stroke="#10b981" name="Assets" strokeWidth={2} />
            <Line type="monotone" dataKey="liabilities" stroke="#ef4444" name="Liabilities" strokeWidth={2} />
            <Line type="monotone" dataKey="netWorth" stroke="#3b82f6" name="Net Worth" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
