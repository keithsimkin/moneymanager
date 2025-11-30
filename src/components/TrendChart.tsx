import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-card p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {label}
                      </span>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: 'hsl(var(--chart-1))' }}
                          />
                          <span className="text-xs text-muted-foreground">Income:</span>
                          <span className="font-bold text-foreground">
                            ${payload[0].value?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: 'hsl(var(--chart-2))' }}
                          />
                          <span className="text-xs text-muted-foreground">Expenses:</span>
                          <span className="font-bold text-foreground">
                            ${payload[1].value?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t">
                          <span className="text-xs text-muted-foreground">Net:</span>
                          <span className="font-bold text-foreground">
                            ${((payload[0].value as number) - (payload[1].value as number)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-1))' }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-2))' }}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
