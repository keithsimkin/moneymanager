import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  [key: string]: string | number;
}

interface CategoryChartProps {
  data?: CategoryData[];
}

// Mock data for development
const mockData: CategoryData[] = [
  { category: 'Groceries', amount: 450, percentage: 25 },
  { category: 'Utilities', amount: 300, percentage: 16.7 },
  { category: 'Entertainment', amount: 200, percentage: 11.1 },
  { category: 'Transportation', amount: 350, percentage: 19.4 },
  { category: 'Healthcare', amount: 150, percentage: 8.3 },
  { category: 'Dining', amount: 250, percentage: 13.9 },
  { category: 'Other', amount: 100, percentage: 5.6 },
];

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

export function CategoryChart({ data = mockData }: CategoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => {
            const data = entry as unknown as CategoryData;
            return `${data.category}: ${data.percentage.toFixed(1)}%`;
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
              const data = payload[0].payload as CategoryData;
              return (
                <div className="rounded-lg border bg-card p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.category}
                      </span>
                      <span className="font-bold text-foreground">
                        ${data.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {data.percentage.toFixed(1)}% of total
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
  );
}
