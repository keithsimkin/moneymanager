import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { BalanceChart } from '@/components/BalanceChart';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';

// Mock data for different time periods
const mockDataByPeriod = {
  '1m': {
    trend: [
      { month: 'Nov', income: 5200, expenses: 3900 },
    ],
    category: [
      { category: 'Groceries', amount: 450, percentage: 25 },
      { category: 'Utilities', amount: 300, percentage: 16.7 },
      { category: 'Entertainment', amount: 200, percentage: 11.1 },
      { category: 'Transportation', amount: 350, percentage: 19.4 },
      { category: 'Healthcare', amount: 150, percentage: 8.3 },
      { category: 'Dining', amount: 250, percentage: 13.9 },
      { category: 'Other', amount: 100, percentage: 5.6 },
    ],
    totalIncome: 5200,
    totalExpenses: 3900,
  },
  '3m': {
    trend: [
      { month: 'Sep', income: 5000, expenses: 3800 },
      { month: 'Oct', income: 4700, expenses: 3400 },
      { month: 'Nov', income: 5200, expenses: 3900 },
    ],
    category: [
      { category: 'Groceries', amount: 1350, percentage: 25 },
      { category: 'Utilities', amount: 900, percentage: 16.7 },
      { category: 'Entertainment', amount: 600, percentage: 11.1 },
      { category: 'Transportation', amount: 1050, percentage: 19.4 },
      { category: 'Healthcare', amount: 450, percentage: 8.3 },
      { category: 'Dining', amount: 750, percentage: 13.9 },
      { category: 'Other', amount: 300, percentage: 5.6 },
    ],
    totalIncome: 14900,
    totalExpenses: 11100,
  },
  '6m': {
    trend: [
      { month: 'Jun', income: 4500, expenses: 3200 },
      { month: 'Jul', income: 4800, expenses: 3500 },
      { month: 'Aug', income: 4500, expenses: 3100 },
      { month: 'Sep', income: 5000, expenses: 3800 },
      { month: 'Oct', income: 4700, expenses: 3400 },
      { month: 'Nov', income: 5200, expenses: 3900 },
    ],
    category: [
      { category: 'Groceries', amount: 2700, percentage: 25 },
      { category: 'Utilities', amount: 1800, percentage: 16.7 },
      { category: 'Entertainment', amount: 1200, percentage: 11.1 },
      { category: 'Transportation', amount: 2100, percentage: 19.4 },
      { category: 'Healthcare', amount: 900, percentage: 8.3 },
      { category: 'Dining', amount: 1500, percentage: 13.9 },
      { category: 'Other', amount: 600, percentage: 5.6 },
    ],
    totalIncome: 28700,
    totalExpenses: 20900,
  },
  '1y': {
    trend: [
      { month: 'Dec', income: 4300, expenses: 3000 },
      { month: 'Jan', income: 4500, expenses: 3200 },
      { month: 'Feb', income: 4400, expenses: 3100 },
      { month: 'Mar', income: 4600, expenses: 3300 },
      { month: 'Apr', income: 4700, expenses: 3400 },
      { month: 'May', income: 4500, expenses: 3200 },
      { month: 'Jun', income: 4500, expenses: 3200 },
      { month: 'Jul', income: 4800, expenses: 3500 },
      { month: 'Aug', income: 4500, expenses: 3100 },
      { month: 'Sep', income: 5000, expenses: 3800 },
      { month: 'Oct', income: 4700, expenses: 3400 },
      { month: 'Nov', income: 5200, expenses: 3900 },
    ],
    category: [
      { category: 'Groceries', amount: 5400, percentage: 25 },
      { category: 'Utilities', amount: 3600, percentage: 16.7 },
      { category: 'Entertainment', amount: 2400, percentage: 11.1 },
      { category: 'Transportation', amount: 4200, percentage: 19.4 },
      { category: 'Healthcare', amount: 1800, percentage: 8.3 },
      { category: 'Dining', amount: 3000, percentage: 13.9 },
      { category: 'Other', amount: 1200, percentage: 5.6 },
    ],
    totalIncome: 55700,
    totalExpenses: 40100,
  },
};

const balanceData = [
  { name: 'Main Checking', balance: 5420, type: 'checking' },
  { name: 'Savings', balance: 12500, type: 'savings' },
  { name: 'Credit Card', balance: -850, type: 'credit' },
  { name: 'Investment', balance: 8300, type: 'investment' },
];

type TimePeriod = '1m' | '3m' | '6m' | '1y';

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('6m');
  
  const currentData = mockDataByPeriod[timePeriod];
  const netCashFlow = currentData.totalIncome - currentData.totalExpenses;
  const savingsRate = ((netCashFlow / currentData.totalIncome) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed financial insights and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Period:</span>
          <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl">${currentData.totalIncome.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span>Income for selected period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl">${currentData.totalExpenses.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
              <span>Expenses for selected period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Cash Flow</CardDescription>
            <CardTitle className="text-2xl">
              ${netCashFlow.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUpIcon className="h-4 w-4 text-blue-500" />
              <span>Income minus expenses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Savings Rate</CardDescription>
            <CardTitle className="text-2xl">{savingsRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
              <span>Percentage of income saved</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Expense Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
          <CardDescription>
            Track your income and expense patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart data={currentData.trend} />
        </CardContent>
      </Card>

      {/* Two Column Layout for Category and Balance Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Breakdown of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={currentData.category} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription>
              Current balance across all accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BalanceChart data={balanceData} />
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Detailed spending breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentData.category.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">{cat.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {cat.percentage.toFixed(1)}%
                  </span>
                  <span className="font-semibold min-w-[100px] text-right">
                    ${cat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
