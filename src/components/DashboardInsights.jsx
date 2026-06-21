import React from 'react';
import PropTypes from 'prop-types';
import { SlBulb, SlClock, SlGraph, SlWallet, SlInfo } from 'react-icons/sl';
import { useCategories } from '../hooks/useCategories';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const DashboardInsights = ({ transactions, userId }) => {
  const { categories } = useCategories(userId);
  // Helper for date details
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const elapsedDays = today.getDate();
  const remainingDays = daysInMonth - elapsedDays;

  // Process data for the current calendar month
  const getMonthStats = () => {
    const monthTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const income = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expense = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    return { income, expense, count: monthTxns.length };
  };

  const { income: currentMonthIncome, expense: currentMonthExpense } = getMonthStats();

  // 1. Forecast Calculations
  const dailySpendRate = elapsedDays > 0 ? currentMonthExpense / elapsedDays : 0;
  const projectedEomExpense = dailySpendRate * daysInMonth;

  const dailyIncomeRate = elapsedDays > 0 ? currentMonthIncome / elapsedDays : 0;
  const projectedEomIncome = currentMonthIncome > 0 ? (dailyIncomeRate * daysInMonth) : 0;
  
  // Savings projections
  const actualBalance = currentMonthIncome - currentMonthExpense;
  const projectedEomBalance = projectedEomIncome - projectedEomExpense;

  // 2. Generate Dynamic Insights
  const generateInsights = () => {
    const insightsList = [];
    const expenses = transactions.filter((t) => t.type === 'expense');
    
    if (expenses.length === 0) return [];

    // Insight A: Savings Rate Evaluation
    if (currentMonthIncome > 0) {
      const savingsRate = (actualBalance / currentMonthIncome) * 100;
      let grade = 'Needs Attention';
      let tip = 'Try to lower non-essential category spending to build a 20% savings buffer.';
      let tone = 'rose';

      if (savingsRate >= 40) {
        grade = 'Elite';
        tip = 'Superb job saving 40%+ of your income! Consider redirecting surplus to long-term investments.';
        tone = 'emerald';
      } else if (savingsRate >= 20) {
        grade = 'Healthy';
        tip = 'You are maintaining a recommended 20%+ savings buffer. Keep it up!';
        tone = 'teal';
      } else if (savingsRate > 0) {
        grade = 'Tight';
        tip = 'Your savings rate is positive but thin. A small budget cut in dining/entertainment would help.';
        tone = 'amber';
      }

      insightsList.push({
        id: 'savings_rate',
        title: `Savings Rate: ${savingsRate.toFixed(0)}% (${grade})`,
        description: tip,
        icon: SlWallet,
        tone,
      });
    }

    // Insight B: Weekend vs Weekday analysis
    let weekdaySpend = 0;
    let weekdayCount = 0;
    let weekendSpend = 0;
    let weekendCount = 0;

    expenses.forEach((t) => {
      const day = new Date(t.date).getDay();
      const isWeekend = day === 0 || day === 6; // Sun = 0, Sat = 6
      if (isWeekend) {
        weekendSpend += parseFloat(t.amount || 0);
        weekendCount++;
      } else {
        weekdaySpend += parseFloat(t.amount || 0);
        weekdayCount++;
      }
    });

    const avgWeekday = weekdayCount > 0 ? weekdaySpend / weekdayCount : 0;
    const avgWeekend = weekendCount > 0 ? weekendSpend / weekendCount : 0;

    if (avgWeekend > avgWeekday * 1.15 && avgWeekday > 0) {
      const percentageDiff = ((avgWeekend - avgWeekday) / avgWeekday) * 100;
      insightsList.push({
        id: 'weekend_spike',
        title: `Weekend Spending Spike (+${percentageDiff.toFixed(0)}%)`,
        description: `Your average weekend transaction (${formatCurrency(avgWeekend)}) is notably higher than weekdays (${formatCurrency(avgWeekday)}). Consider a weekend budget cap.`,
        icon: SlClock,
        tone: 'rose',
      });
    } else if (avgWeekend > 0 && avgWeekday > 0) {
      insightsList.push({
        id: 'spend_consistency',
        title: 'Consistent Daily Velocity',
        description: `Your spending speed remains balanced between weekdays (${formatCurrency(avgWeekday)}/item) and weekends (${formatCurrency(avgWeekend)}/item). Good consistency.`,
        icon: SlClock,
        tone: 'teal',
      });
    }

    // Insight C: Spend Speed & Velocity Warning
    if (elapsedDays > 5 && currentMonthExpense > 0) {
      const currentMonthBudget = currentMonthIncome > 0 ? currentMonthIncome * 0.8 : 1000; // Benchmark limit
      const percentageOfLimit = (projectedEomExpense / currentMonthBudget) * 100;

      if (percentageOfLimit > 100) {
        insightsList.push({
          id: 'spend_velocity_high',
          title: 'High Expense Velocity Warning',
          description: `You are projected to spend ${formatCurrency(projectedEomExpense)} by EOM, exceeding your recommended expense benchmark (${formatCurrency(currentMonthBudget)}).`,
          icon: SlGraph,
          tone: 'rose',
        });
      } else if (percentageOfLimit < 70) {
        insightsList.push({
          id: 'spend_velocity_great',
          title: 'Efficient Monthly Track',
          description: `Excellent pace! Your projected EOM spend (${formatCurrency(projectedEomExpense)}) remains safely below your spending benchmark.`,
          icon: SlGraph,
          tone: 'emerald',
        });
      }
    }

    // Insight D: 50/30/20 Rule Breakdown
    const monthExpenses = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && t.type === 'expense';
    });

    if (monthExpenses.length > 0 && categories && categories.length > 0) {
      let needsTotal = 0;
      let wantsTotal = 0;
      let investmentsTotal = 0;

      monthExpenses.forEach((t) => {
        const cat = categories.find((c) => c.id === (t.categoryId || t.category));
        const budgetType = cat?.budgetType || 'want';

        const amt = parseFloat(t.amount || 0);
        if (budgetType === 'need') {
          needsTotal += amt;
        } else if (budgetType === 'investment') {
          investmentsTotal += amt;
        } else {
          wantsTotal += amt;
        }
      });

      const totalExpense = needsTotal + wantsTotal + investmentsTotal;
      if (totalExpense > 0) {
        const needsPct = (needsTotal / totalExpense) * 100;
        const wantsPct = (wantsTotal / totalExpense) * 100;
        const investmentsPct = (investmentsTotal / totalExpense) * 100;

        let tone = 'teal';
        let recommendation = '';
        
        if (needsPct > 55) {
          recommendation = 'Your Needs are above 50%. Review fixed expenses or bills to see where you can save.';
          tone = 'amber';
        } else if (wantsPct > 35) {
          recommendation = 'Your Wants spending is above 30%. Consider dialing back on entertainment or dining out.';
          tone = 'rose';
        } else if (investmentsPct < 15) {
          recommendation = 'Your Savings are below 20%. Try to automate savings at the start of the month.';
          tone = 'amber';
        } else {
          recommendation = 'Excellent balance! Your spending closely aligns with healthy financial planning models.';
          tone = 'emerald';
        }

        insightsList.unshift({
          id: 'budget_split',
          title: `Budget Split: ${needsPct.toFixed(0)}% Needs / ${wantsPct.toFixed(0)}% Wants / ${investmentsPct.toFixed(0)}% Savings`,
          description: `Actual this month: Needs ${formatCurrency(needsTotal)}, Wants ${formatCurrency(wantsTotal)}, Savings/Investments ${formatCurrency(investmentsTotal)}. ${recommendation}`,
          icon: SlBulb,
          tone,
        });
      }
    }

    // If list has less than 2 items, add a generic helpful finance tip
    if (insightsList.length < 2) {
      insightsList.push({
        id: 'generic_rule',
        title: 'Rule of 50/30/20',
        description: 'Aim to allocate 50% of your income to Needs, 30% to Wants, and save/invest the remaining 20%.',
        icon: SlBulb,
        tone: 'teal',
      });
    }

    return insightsList;
  };

  const insights = generateInsights();

  // Progress Bar Percentages
  const daysProgress = (elapsedDays / daysInMonth) * 100;
  const budgetLimit = currentMonthIncome > 0 ? currentMonthIncome : 2000; // Fallback benchmark
  const spendProgress = Math.min((currentMonthExpense / budgetLimit) * 100, 100);
  const projectedSpendProgress = Math.min((projectedEomExpense / budgetLimit) * 100, 100);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Forecasting / End of Month Projection Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-sm shadow-none transition-all hover:border-slate-300 dark:hover:border-zinc-700">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">EOM Predictions</p>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">Month Forecast Projections</h3>
        </div>

        <div className="mt-6 space-y-6">
          {/* Main Projection Figures */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 dark:border-zinc-800/40 bg-slate-50/50 dark:bg-zinc-950/20 p-4">
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Projected Expenses</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 block">
                {formatCurrency(projectedEomExpense)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Run rate: {formatCurrency(dailySpendRate)}/day
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 dark:border-zinc-800/40 bg-slate-50/50 dark:bg-zinc-950/20 p-4">
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Projected Balance</span>
              <span className={`text-lg font-extrabold tracking-tight mt-1 block ${
                projectedEomBalance >= 0 ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-500'
              }`}>
                {projectedEomBalance >= 0 ? '+' : ''}{formatCurrency(projectedEomBalance)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Current: {formatCurrency(actualBalance)}
              </span>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            {/* Calendar Days elapsed */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-350">Month Days Elapsed</span>
                <span className="text-slate-550 dark:text-slate-400 font-mono">
                  {elapsedDays} / {daysInMonth} Days ({daysProgress.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-slate-900 dark:bg-zinc-100 transition-all duration-300"
                  style={{ width: `${daysProgress}%` }}
                />
              </div>
            </div>

            {/* Current Spending vs Projected EOM */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-350">Monthly Spend Benchmark</span>
                <span className="text-slate-550 dark:text-slate-400 font-mono">
                  {formatCurrency(currentMonthExpense)} of {formatCurrency(budgetLimit)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden relative">
                {/* Projected Line indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                  style={{ left: `${projectedSpendProgress}%` }}
                  title={`Projected End of Month: ${formatCurrency(projectedEomExpense)}`}
                />
                {/* Current Spend bar */}
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    projectedEomExpense > budgetLimit ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${spendProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                <span>0%</span>
                <span className="text-rose-500">| Projected EOM ({projectedSpendProgress.toFixed(0)}%)</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Insights Panel */}
      <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-sm shadow-none transition-all hover:border-slate-300 dark:hover:border-zinc-700">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Financial intelligence</p>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">Smart Analysis & Tips</h3>
        </div>

        <div className="mt-5 space-y-3.5">
          {insights.map((insight) => {
            const Icon = insight.icon;
            let toneClasses = 'bg-slate-50 dark:bg-zinc-900/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800/80';
            if (insight.tone === 'rose') {
              toneClasses = 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/10';
            } else if (insight.tone === 'emerald') {
              toneClasses = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/10';
            } else if (insight.tone === 'amber') {
              toneClasses = 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/10';
            }

            return (
              <div 
                key={insight.id}
                className={`flex gap-3.5 rounded-2xl border p-4 transition-all hover:translate-x-1 duration-150 ${toneClasses}`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/50 text-base shadow-none border border-current/10">
                  <Icon className="text-sm font-bold" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] text-slate-550 dark:text-slate-350 leading-relaxed mt-1 font-semibold">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

DashboardInsights.propTypes = {
  transactions: PropTypes.array.isRequired,
  userId: PropTypes.string,
};
