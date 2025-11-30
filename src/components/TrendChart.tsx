import { memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart = memo(function TrendChart({ data }: TrendChartProps) {
  const chartDescription = data.length > 0
    ? `Area chart showing income and expense trends over ${data.length} months. ${data.map(d => `${d.month}: Income ${d.income.toFixed(2)}, Expenses ${d.expenses.toFixed(2)}`).join('. ')}`
    : 'No trend data available';

  return (
    <div role="img" aria-label={chartDescription}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(147, 51, 234)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(147, 51, 234)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(251, 146, 60)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(251, 146, 60)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
            dx={-10}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white dark:bg-card p-3 shadow-lg" role="tooltip">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground">
                        {label}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-600" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Expenses</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${payload[1].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="rgb(147, 51, 234)"
            strokeWidth={2}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="rgb(251, 146, 60)"
            strokeWidth={2}
            fill="url(#colorExpenses)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
