import { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { BalanceChart } from '@/components/BalanceChart';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';
import { format } from 'date-fns';

type TimePeriod = '1m' | '3m' | '6m' | '1y';

export default function Analytics() {
  const { accounts, transactions } = useFinance();
  const { getSpendingByCategory, getTrendData } = useAnalytics();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('6m');
  
  // Calculate months based on time period
  const monthsCount = useMemo(() => {
    switch (timePeriod) {
      case '1m': return 1;
      case '3m': return 3;
      case '6m': return 6;
      case '1y': return 12;
      default: return 6;
    }
  }, [timePeriod]);

  // Get trend data for the selected period
  const trendData = useMemo(() => {
    const rawData = getTrendData(monthsCount);
    // Format month from "YYYY-MM" to short month name like "Jun"
    return rawData.map(item => ({
      ...item,
      month: format(new Date(item.month + '-01'), 'MMM'),
    }));
  }, [monthsCount, getTrendData]);

  // Calculate date range for category data
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);
    return {
      startDate: start.toISOString(),
      endDate: now.toISOString(),
    };
  }, [monthsCount]);

  // Get category spending data
  const categoryData = useMemo(() => getSpendingByCategory(startDate, endDate), [startDate, endDate, getSpendingByCategory]);

  // Calculate totals from trend data
  const totalIncome = useMemo(() => {
    return trendData.reduce((sum, month) => sum + month.income, 0);
  }, [trendData]);

  const totalExpenses = useMemo(() => {
    return trendData.reduce((sum, month) => sum + month.expenses, 0);
  }, [trendData]);

  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(1) : '0.0';

  // Calculate account balances
  const balanceData = useMemo(() => {
    return accounts.map(account => {
      const accountTransactions = transactions.filter(t => t.accountId === account.id);
      const balance = account.initialBalance + accountTransactions.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
      return {
        name: account.name,
        balance,
        type: account.type,
      };
    });
  }, [accounts, transactions]);

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
            <CardTitle className="text-2xl">${totalIncome.toLocaleString()}</CardTitle>
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
            <CardTitle className="text-2xl">${totalExpenses.toLocaleString()}</CardTitle>
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
          {trendData.length > 0 ? (
            <TrendChart data={trendData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No transaction data available for the selected period
            </div>
          )}
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
            {categoryData.length > 0 ? (
              <CategoryChart data={categoryData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expense data available for the selected period
              </div>
            )}
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
            {balanceData.length > 0 ? (
              <BalanceChart data={balanceData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No accounts available
              </div>
            )}
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
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {categoryData.map((cat) => (
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expense data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
