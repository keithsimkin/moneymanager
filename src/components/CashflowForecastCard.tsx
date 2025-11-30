import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CashflowForecast } from '@/hooks/useAdvancedAnalytics';

interface CashflowForecastCardProps {
  data: CashflowForecast[];
}

export function CashflowForecastCard({ data }: CashflowForecastCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cashflow Forecast</CardTitle>
        <CardDescription>Predicted income, spending, and savings based on last 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="expectedIncome" fill="#10b981" name="Expected Income" />
            <Bar dataKey="expectedSpending" fill="#ef4444" name="Expected Spending" />
            <Bar dataKey="expectedSavings" fill="#3b82f6" name="Expected Savings" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {data.map((forecast, index) => (
            <div key={index} className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">{forecast.month}</p>
              <p className="text-lg font-bold">{formatCurrency(forecast.projectedBalance)}</p>
              <p className="text-xs text-muted-foreground">Projected Balance</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
