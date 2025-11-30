import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BalanceData {
  name: string;
  balance: number;
  type: string;
}

interface BalanceChartProps {
  data: BalanceData[];
}

export const BalanceChart = memo(function BalanceChart({ data }: BalanceChartProps) {
  // Create accessible description of the data
  const chartDescription = data.length > 0
    ? `Bar chart showing account balances. ${data.map(d => `${d.name} (${d.type}): $${d.balance.toFixed(2)}`).join(', ')}`
    : 'No account balance data available';

  return (
    <div role="img" aria-label={chartDescription}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as BalanceData;
              return (
                <div className="rounded-lg border bg-card p-2 shadow-sm" role="tooltip">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.name}
                      </span>
                      <span className="font-bold text-foreground">
                        ${data.balance.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {data.type} account
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="balance"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
});
