import { useMemo, useCallback } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useBudgets } from '@/hooks/useBudgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryChart } from '@/components/CategoryChart';
import { TrendChart } from '@/components/TrendChart';
import { BalanceChart } from '@/components/BalanceChart';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertTriangle,
  AlertCircle,
  LayoutDashboard,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const { accounts, transactions } = useFinance();
  const { checkBudgetAlerts, getBudgetProgress } = useBudgets();
  const navigate = useNavigate();

  // Calculate account balances
  const accountBalances = useMemo(() => {
    return accounts.map(account => {
      const accountTransactions = transactions.filter(t => t.accountId === account.id);
      const balance = account.initialBalance + accountTransactions.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
      return { ...account, balance };
    });
  }, [accounts, transactions]);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return accountBalances.reduce((sum, account) => sum + account.balance, 0);
  }, [accountBalances]);

  // Get current month transactions
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  }, [transactions]);

  // Calculate monthly income and expenses
  const monthlyIncome = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const monthlyExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  // Calculate net cash flow
  const netCashFlow = monthlyIncome - monthlyExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  // Prepare category chart data
  const categoryChartData = useMemo(() => {
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      const existing = acc[t.category] || { amount: 0, count: 0 };
      acc[t.category] = {
        amount: existing.amount + t.amount,
        count: existing.count + 1,
      };
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const total = Object.values(categoryTotals).reduce((sum, data) => sum + data.amount, 0);
    
    return Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      transactionCount: data.count,
    }));
  }, [currentMonthTransactions]);

  // Prepare trend chart data (last 6 months)
  const trendChartData = useMemo(() => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = format(date, 'MMM');
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({ month, income, expenses });
    }
    
    return months;
  }, [transactions]);

  // Prepare balance chart data
  const balanceChartData = useMemo(() => {
    return accountBalances.map(account => ({
      name: account.name,
      balance: account.balance,
      type: account.type,
    }));
  }, [accountBalances]);

  // Get budget alerts using the hook
  const budgetAlerts = useMemo(() => checkBudgetAlerts(), [checkBudgetAlerts]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }, []);

  const getAccountName = useCallback((accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown Account';
  }, [accounts]);

  // Show empty state if no accounts exist
  if (accounts.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your financial overview at a glance
          </p>
        </div>
        <EmptyState
          icon={LayoutDashboard}
          title="Welcome to MoneyManager"
          description="Get started by creating your first account to begin tracking your finances. Once you add accounts and transactions, you'll see your financial overview here."
          actionLabel="Create Your First Account"
          onAction={() => navigate('/accounts')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <span className="text-sm">Monthly</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button size="sm" className="h-9 bg-purple-600 hover:bg-purple-700 text-white">
            Download
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase">Total Balance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  10.8%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">+{formatCurrency(Math.abs(netCashFlow))}</span>
              <span>from last month</span>
              <svg className="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase">Monthly Income</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(monthlyIncome)}</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  0.4%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">+{formatCurrency(monthlyIncome * 0.004)}</span>
              <span>from last month</span>
              <svg className="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase">Total Expenses</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(monthlyExpenses)}</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  0.5%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">+{formatCurrency(monthlyExpenses * 0.005)}</span>
              <span>from last month</span>
              <svg className="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase">Savings Rate</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {monthlyIncome > 0 ? ((netCashFlow / monthlyIncome) * 100).toFixed(0) : 0}%
                </span>
                <span className="text-xs font-medium text-red-600 dark:text-red-500 flex items-center gap-0.5">
                  <TrendingDown className="h-3 w-3" />
                  10.2%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">-10.2%</span>
              <span>from last month</span>
              <svg className="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="col-span-full lg:col-span-2 bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Cash Flow</CardTitle>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(netCashFlow)}</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  7.7%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-muted rounded-lg transition-colors">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-muted text-gray-900 dark:text-white">
                All Products
              </button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-muted">
                All Categories
              </button>
              <div className="ml-auto flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">This period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-gray-600 dark:text-gray-400">Last period</span>
                </div>
              </div>
            </div>
            <TrendChart data={trendChartData} />
          </CardContent>
        </Card>

        {/* Side Panel - Conversion Metrics */}
        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Budget Status</CardTitle>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {budgetAlerts.length === 0 ? '100%' : `${Math.max(0, 100 - budgetAlerts.length * 10)}%`}
              </span>
              <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                6.8%
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Accounts</span>
                <span className="font-semibold text-gray-900 dark:text-white">{accounts.length}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Transactions</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currentMonthTransactions.length}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Budget Alerts</span>
                <span className="font-semibold text-gray-900 dark:text-white">{budgetAlerts.length}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Categories</span>
                <span className="font-semibold text-gray-900 dark:text-white">{categoryChartData.length}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '2.7%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Budget Alerts / Upgrade Card */}
        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Budget Alerts</CardTitle>
              <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {budgetAlerts.length > 0 ? (
              <div className="space-y-3">
                {budgetAlerts.slice(0, 3).map(alert => (
                  <div 
                    key={alert.budgetId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      {alert.type === 'exceeded' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.category}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            const progress = getBudgetProgress(alert.budgetId);
                            return progress 
                              ? `${formatCurrency(progress.spent)} of ${formatCurrency(progress.budget.amount)}`
                              : 'N/A';
                          })()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.type === 'exceeded' ? 'destructive' : 'secondary'} className="text-xs">
                      {alert.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">All budgets on track</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Great job managing your finances!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-full lg:col-span-2 bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input 
                    placeholder="Search product..." 
                    className="pl-9 h-8 w-64 bg-gray-50 dark:bg-muted border-gray-200 dark:border-border text-sm"
                  />
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-600 dark:text-gray-400">
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-border">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Description</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Account</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map(transaction => (
                      <tr key={transaction.id} className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-muted flex items-center justify-center">
                              {transaction.type === 'income' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{transaction.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{getAccountName(transaction.accountId)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(transaction.date)}</td>
                        <td className={`py-3 px-4 text-sm font-semibold text-right ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-6 rounded-full bg-gray-100 dark:bg-muted">
                            <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No transactions yet.</p>
                <p className="text-sm mt-2">Add your first transaction to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
