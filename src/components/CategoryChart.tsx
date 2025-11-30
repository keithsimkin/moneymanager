import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategorySpending } from '@/types';

interface CategoryChartProps {
  data: CategorySpending[];
}

// Theme-appropriate colors using CSS variables
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--accent))',
];

export const CategoryChart = memo(function CategoryChart({ data }: CategoryChartProps) {
  // Create accessible description of the data
  const chartDescription = data.length > 0
    ? `Pie chart showing spending distribution across ${data.length} categories. ${data.map(d => `${d.category}: $${d.amount.toFixed(2)} (${d.percentage.toFixed(1)}%)`).join(', ')}`
    : 'No spending data available';

  return (
    <div role="img" aria-label={chartDescription}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => {
              const item = entry as unknown as CategorySpending;
              return `${item.category}: ${item.percentage.toFixed(1)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CategorySpending;
                return (
                  <div className="rounded-lg border bg-card p-2 shadow-sm" role="tooltip">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {item.category}
                        </span>
                        <span className="font-bold text-foreground">
                          ${item.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.percentage.toFixed(1)}% of total
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});
