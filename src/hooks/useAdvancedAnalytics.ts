import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Transaction } from '../types';

/**
 * Advanced Analytics Hook
 * Provides AI-powered insights and premium analytics features
 */

export interface FinancialHealthScore {
  score: number; // 0-100
  breakdown: {
    spendingPatterns: number;
    savingsHabits: number;
    debtRatio: number;
    billTimeliness: number;
    incomeStability: number;
  };
  trend: 'improving' | 'stable' | 'declining';
}

export interface CashflowForecast {
  month: string;
  expectedIncome: number;
  expectedSpending: number;
  expectedSavings: number;
  projectedBalance: number;
}

export interface BurnRateData {
  dailyBurnRate: number;
  runwayDays: number;
  currentBalance: number;
  projectedZeroDate: string | null;
}

export interface NetWorthTrend {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
  percentageChange: number;
}

export interface CategoryInsight {
  category: string;
  amount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SavingsVelocity {
  weeklyRate: number;
  monthlyRate: number;
  projectedCompletion: string | null;
  accelerationNeeded: number;
}

export interface IncomeStability {
  score: number; // 0-100
  variance: number;
  sourceCount: number;
  paymentFrequency: string;
  reliability: 'high' | 'medium' | 'low';
}

export interface DisposableIncome {
  amount: number;
  percentage: number;
  warning: boolean;
  projectedNextMonth: number;
}

export interface SpendingHeatmap {
  dayOfWeek: { [key: string]: number };
  timeOfDay: { [key: string]: number };
  peakSpendingDay: string;
  peakSpendingTime: string;
}

export interface Anomaly {
  id: string;
  type: 'spike' | 'suspicious' | 'duplicate' | 'unusual';
  transaction: Transaction;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface SavingsOpportunity {
  category: string;
  potentialSavings: number;
  recommendation: string;
  impact: number; // percentage
}

export function useAdvancedAnalytics() {
  const { accounts, transactions, budgets, goals } = useFinance();

  // 1. Financial Health Score
  const financialHealthScore = useMemo((): FinancialHealthScore => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const recentTransactions = transactions.filter(
      t => new Date(t.date) >= threeMonthsAgo
    );

    // Spending Patterns (0-20)
    const avgMonthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / 3;
    const budgetTotal = budgets.reduce((sum, b) => sum + b.amount, 0);
    const spendingScore = budgetTotal > 0 
      ? Math.min(20, (1 - avgMonthlyExpenses / budgetTotal) * 20)
      : 10;

    // Savings Habits (0-20)
    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    const savingsScore = Math.max(0, Math.min(20, savingsRate * 100));

    // Debt Ratio (0-20) - simplified: credit account balances
    const creditAccounts = accounts.filter(a => a.type === 'credit');
    const debtScore = creditAccounts.length === 0 ? 20 : 15;

    // Bill Timeliness (0-20) - simplified
    const billScore = 18;

    // Income Stability (0-20)
    const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
    const incomeVariance = incomeTransactions.length > 1
      ? Math.sqrt(
          incomeTransactions.reduce((sum, t) => {
            const avg = totalIncome / incomeTransactions.length;
            return sum + Math.pow(t.amount - avg, 2);
          }, 0) / incomeTransactions.length
        )
      : 0;
    const avgIncome = totalIncome / Math.max(1, incomeTransactions.length);
    const stabilityScore = avgIncome > 0
      ? Math.max(0, Math.min(20, 20 - (incomeVariance / avgIncome) * 10))
      : 10;

    const totalScore = spendingScore + savingsScore + debtScore + billScore + stabilityScore;

    return {
      score: Math.round(totalScore),
      breakdown: {
        spendingPatterns: Math.round(spendingScore),
        savingsHabits: Math.round(savingsScore),
        debtRatio: Math.round(debtScore),
        billTimeliness: Math.round(billScore),
        incomeStability: Math.round(stabilityScore),
      },
      trend: totalScore >= 70 ? 'improving' : totalScore >= 50 ? 'stable' : 'declining',
    };
  }, [accounts, transactions, budgets]);

  // 2. Monthly Cashflow Forecast
  const cashflowForecast = useMemo((): CashflowForecast[] => {
    const now = new Date();
    const forecasts: CashflowForecast[] = [];
    
    // Calculate averages from last 3 months
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    for (let i = 0; i < 3; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month.getMonth() && 
               tDate.getFullYear() === month.getFullYear();
      });

      monthlyData[monthKey] = {
        income: monthTransactions.filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: monthTransactions.filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
      };
    }

    const avgIncome = Object.values(monthlyData).reduce((sum, d) => sum + d.income, 0) / 3;
    const avgExpenses = Object.values(monthlyData).reduce((sum, d) => sum + d.expenses, 0) / 3;

    // Calculate current balance
    let currentBalance = accounts.reduce((sum, acc) => {
      const accTransactions = transactions.filter(t => t.accountId === acc.id);
      const balance = acc.initialBalance + accTransactions.reduce((s, t) => 
        s + (t.type === 'income' ? t.amount : -t.amount), 0
      );
      return sum + balance;
    }, 0);

    // Forecast next 3 months
    for (let i = 0; i < 3; i++) {
      const forecastMonth = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
      const expectedSavings = avgIncome - avgExpenses;
      currentBalance += expectedSavings;

      forecasts.push({
        month: forecastMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        expectedIncome: Math.round(avgIncome),
        expectedSpending: Math.round(avgExpenses),
        expectedSavings: Math.round(expectedSavings),
        projectedBalance: Math.round(currentBalance),
      });
    }

    return forecasts;
  }, [accounts, transactions]);

  // 3. Burn Rate & Runway
  const burnRateData = useMemo((): BurnRateData => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= last30Days)
      .reduce((sum, t) => sum + t.amount, 0);

    const dailyBurnRate = recentExpenses / 30;

    const currentBalance = accounts.reduce((sum, acc) => {
      const accTransactions = transactions.filter(t => t.accountId === acc.id);
      const balance = acc.initialBalance + accTransactions.reduce((s, t) => 
        s + (t.type === 'income' ? t.amount : -t.amount), 0
      );
      return sum + balance;
    }, 0);

    const runwayDays = dailyBurnRate > 0 ? Math.floor(currentBalance / dailyBurnRate) : Infinity;
    
    const projectedZeroDate = runwayDays !== Infinity && runwayDays > 0
      ? new Date(now.getTime() + runwayDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    return {
      dailyBurnRate: Math.round(dailyBurnRate * 100) / 100,
      runwayDays: runwayDays === Infinity ? 999 : runwayDays,
      currentBalance: Math.round(currentBalance * 100) / 100,
      projectedZeroDate,
    };
  }, [accounts, transactions]);

  // 4. Net Worth Trendline
  const netWorthTrend = useMemo((): NetWorthTrend[] => {
    const trends: NetWorthTrend[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const relevantTransactions = transactions.filter(
        t => new Date(t.date) <= monthEnd
      );

      const assets = accounts
        .filter(a => a.type !== 'credit')
        .reduce((sum, acc) => {
          const accTrans = relevantTransactions.filter(t => t.accountId === acc.id);
          const balance = acc.initialBalance + accTrans.reduce((s, t) => 
            s + (t.type === 'income' ? t.amount : -t.amount), 0
          );
          return sum + Math.max(0, balance);
        }, 0);

      const liabilities = accounts
        .filter(a => a.type === 'credit')
        .reduce((sum, acc) => {
          const accTrans = relevantTransactions.filter(t => t.accountId === acc.id);
          const balance = acc.initialBalance + accTrans.reduce((s, t) => 
            s + (t.type === 'income' ? t.amount : -t.amount), 0
          );
          return sum + Math.abs(Math.min(0, balance));
        }, 0);

      const netWorth = assets - liabilities;
      const prevNetWorth = trends.length > 0 ? trends[trends.length - 1].netWorth : netWorth;
      const percentageChange = prevNetWorth !== 0 
        ? ((netWorth - prevNetWorth) / Math.abs(prevNetWorth)) * 100 
        : 0;

      trends.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        assets: Math.round(assets),
        liabilities: Math.round(liabilities),
        netWorth: Math.round(netWorth),
        percentageChange: Math.round(percentageChange * 10) / 10,
      });
    }

    return trends;
  }, [accounts, transactions]);

  // 5. Category Insights
  const categoryInsights = useMemo((): CategoryInsight[] => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const getCategorySpending = (start: Date, end: Date) => {
      const categoryMap: { [key: string]: number } = {};
      transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' && tDate >= start && tDate < end;
        })
        .forEach(t => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });
      return categoryMap;
    };

    const currentSpending = getCategorySpending(currentMonth, now);
    const lastMonthSpending = getCategorySpending(lastMonth, currentMonth);
    const twoMonthsAgoSpending = getCategorySpending(twoMonthsAgo, lastMonth);

    const insights: CategoryInsight[] = [];
    const allCategories = new Set([
      ...Object.keys(currentSpending),
      ...Object.keys(lastMonthSpending),
      ...Object.keys(twoMonthsAgoSpending),
    ]);

    allCategories.forEach(category => {
      const current = currentSpending[category] || 0;
      const last = lastMonthSpending[category] || 0;
      const twoMonths = twoMonthsAgoSpending[category] || 0;

      const avgPrevious = (last + twoMonths) / 2;
      const growthRate = avgPrevious > 0 ? ((current - avgPrevious) / avgPrevious) * 100 : 0;

      const trend = growthRate > 10 ? 'increasing' : growthRate < -10 ? 'decreasing' : 'stable';
      const riskLevel = growthRate > 30 ? 'high' : growthRate > 10 ? 'medium' : 'low';

      insights.push({
        category,
        amount: Math.round(current),
        trend,
        growthRate: Math.round(growthRate * 10) / 10,
        riskLevel,
      });
    });

    return insights.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // 6. Savings Velocity (for goals)
  const savingsVelocity = useMemo((): SavingsVelocity | null => {
    if (goals.length === 0) return null;

    const activeGoal = goals.find(g => g.status === 'active') || goals[0];
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const recentSavings = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= fourWeeksAgo)
      .reduce((sum, t) => sum + t.amount, 0) -
      transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= fourWeeksAgo)
        .reduce((sum, t) => sum + t.amount, 0);

    const weeklyRate = recentSavings / 4;
    const monthlyRate = weeklyRate * 4.33;

    const remaining = activeGoal.targetAmount - activeGoal.currentAmount;
    const weeksNeeded = weeklyRate > 0 ? remaining / weeklyRate : Infinity;
    
    const projectedCompletion = weeksNeeded !== Infinity
      ? new Date(now.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const deadline = new Date(activeGoal.deadline);
    const weeksUntilDeadline = (deadline.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000);
    const requiredWeeklyRate = weeksUntilDeadline > 0 ? remaining / weeksUntilDeadline : 0;
    const accelerationNeeded = requiredWeeklyRate > weeklyRate 
      ? ((requiredWeeklyRate - weeklyRate) / weeklyRate) * 100 
      : 0;

    return {
      weeklyRate: Math.round(weeklyRate * 100) / 100,
      monthlyRate: Math.round(monthlyRate * 100) / 100,
      projectedCompletion,
      accelerationNeeded: Math.round(accelerationNeeded),
    };
  }, [goals, transactions]);

  // 7. Income Stability Score
  const incomeStability = useMemo((): IncomeStability => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const incomeTransactions = transactions.filter(
      t => t.type === 'income' && new Date(t.date) >= sixMonthsAgo
    );

    if (incomeTransactions.length === 0) {
      return {
        score: 0,
        variance: 0,
        sourceCount: 0,
        paymentFrequency: 'none',
        reliability: 'low',
      };
    }

    const amounts = incomeTransactions.map(t => t.amount);
    const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const variance = Math.sqrt(
      amounts.reduce((sum, a) => sum + Math.pow(a - avg, 2), 0) / amounts.length
    );

    const coefficientOfVariation = avg > 0 ? (variance / avg) * 100 : 100;
    const score = Math.max(0, Math.min(100, 100 - coefficientOfVariation));

    const sources = new Set(incomeTransactions.map(t => t.description)).size;
    const avgDaysBetween = incomeTransactions.length > 1
      ? (now.getTime() - new Date(incomeTransactions[0].date).getTime()) / 
        (incomeTransactions.length - 1) / (24 * 60 * 60 * 1000)
      : 30;

    const frequency = avgDaysBetween < 10 ? 'weekly' : 
                     avgDaysBetween < 20 ? 'bi-weekly' :
                     avgDaysBetween < 35 ? 'monthly' : 'irregular';

    const reliability = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    return {
      score: Math.round(score),
      variance: Math.round(variance),
      sourceCount: sources,
      paymentFrequency: frequency,
      reliability,
    };
  }, [transactions]);

  // 8. Disposable Income Projection
  const disposableIncome = useMemo((): DisposableIncome => {
    const now = new Date();

    const monthlyIncome = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'income' && 
               tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const recurringExpenses = budgets.reduce((sum, b) => {
      if (b.period === 'monthly') return sum + b.amount;
      if (b.period === 'weekly') return sum + b.amount * 4.33;
      if (b.period === 'yearly') return sum + b.amount / 12;
      return sum;
    }, 0);

    const disposable = monthlyIncome - recurringExpenses;
    const percentage = monthlyIncome > 0 ? (disposable / monthlyIncome) * 100 : 0;
    const warning = disposable < 0;

    // Project next month based on average
    const avgIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= new Date(now.getFullYear(), now.getMonth() - 3, 1))
      .reduce((sum, t) => sum + t.amount, 0) / 3;

    const projectedNextMonth = avgIncome - recurringExpenses;

    return {
      amount: Math.round(disposable),
      percentage: Math.round(percentage * 10) / 10,
      warning,
      projectedNextMonth: Math.round(projectedNextMonth),
    };
  }, [transactions, budgets]);

  // 9. Time-Based Spending Heatmap
  const spendingHeatmap = useMemo((): SpendingHeatmap => {
    const dayOfWeek: { [key: string]: number } = {
      Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, 
      Thursday: 0, Friday: 0, Saturday: 0,
    };
    const timeOfDay: { [key: string]: number } = {
      Morning: 0, Afternoon: 0, Evening: 0, Night: 0,
    };

    transactions.filter(t => t.type === 'expense').forEach(t => {
      const date = new Date(t.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();

      dayOfWeek[day] += t.amount;

      if (hour >= 6 && hour < 12) timeOfDay.Morning += t.amount;
      else if (hour >= 12 && hour < 18) timeOfDay.Afternoon += t.amount;
      else if (hour >= 18 && hour < 22) timeOfDay.Evening += t.amount;
      else timeOfDay.Night += t.amount;
    });

    const peakDay = Object.entries(dayOfWeek).reduce((a, b) => a[1] > b[1] ? a : b);
    const peakTime = Object.entries(timeOfDay).reduce((a, b) => a[1] > b[1] ? a : b);

    return {
      dayOfWeek,
      timeOfDay,
      peakSpendingDay: peakDay[0],
      peakSpendingTime: peakTime[0],
    };
  }, [transactions]);

  // 10. Anomaly Detection
  const anomalies = useMemo((): Anomaly[] => {
    const detected: Anomaly[] = [];
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentTransactions = transactions.filter(t => new Date(t.date) >= last30Days);

    // Calculate average transaction amount
    const avgAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / 
                     Math.max(1, recentTransactions.length);

    // Detect spikes (transactions > 3x average)
    recentTransactions.forEach(t => {
      if (t.amount > avgAmount * 3) {
        detected.push({
          id: t.id,
          type: 'spike',
          transaction: t,
          severity: t.amount > avgAmount * 5 ? 'high' : 'medium',
          description: `Unusually large ${t.type}: ${t.amount.toFixed(2)} (avg: ${avgAmount.toFixed(2)})`,
        });
      }
    });

    // Detect duplicates (same amount, category, and description within 24 hours)
    for (let i = 0; i < recentTransactions.length; i++) {
      for (let j = i + 1; j < recentTransactions.length; j++) {
        const t1 = recentTransactions[i];
        const t2 = recentTransactions[j];
        
        if (t1.amount === t2.amount && 
            t1.category === t2.category && 
            t1.description === t2.description) {
          const timeDiff = Math.abs(new Date(t1.date).getTime() - new Date(t2.date).getTime());
          if (timeDiff < 24 * 60 * 60 * 1000) {
            detected.push({
              id: t2.id,
              type: 'duplicate',
              transaction: t2,
              severity: 'medium',
              description: `Possible duplicate transaction`,
            });
          }
        }
      }
    }

    return detected.slice(0, 10); // Limit to 10 most recent
  }, [transactions]);

  // 11. Savings Opportunities
  const savingsOpportunities = useMemo((): SavingsOpportunity[] => {
    const opportunities: SavingsOpportunity[] = [];
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const categorySpending = categoryInsights;

    // Find high-growth categories
    categorySpending.forEach(cat => {
      if (cat.growthRate > 20 && cat.amount > 100) {
        const potentialSavings = cat.amount * 0.2; // 20% reduction
        opportunities.push({
          category: cat.category,
          potentialSavings: Math.round(potentialSavings),
          recommendation: `Reduce ${cat.category} spending by 20%`,
          impact: 20,
        });
      }
    });

    // Find categories exceeding budgets
    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' && 
                 t.category === budget.category &&
                 tDate >= lastMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      if (spent > budget.amount) {
        const excess = spent - budget.amount;
        opportunities.push({
          category: budget.category,
          potentialSavings: Math.round(excess),
          recommendation: `Bring ${budget.category} back within budget`,
          impact: Math.round((excess / spent) * 100),
        });
      }
    });

    return opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings).slice(0, 5);
  }, [categoryInsights, budgets, transactions]);

  return {
    financialHealthScore,
    cashflowForecast,
    burnRateData,
    netWorthTrend,
    categoryInsights,
    savingsVelocity,
    incomeStability,
    disposableIncome,
    spendingHeatmap,
    anomalies,
    savingsOpportunities,
  };
}
