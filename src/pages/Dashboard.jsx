import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Stats from '../components/Stats';
import TransactionList from '../components/TransactionList';
import { TrendChart, CategoryBreakdownDonut } from '../components/DashboardCharts';
import { DashboardInsights } from '../components/DashboardInsights';
import { SlPlus } from 'react-icons/sl';

const Dashboard = ({ user, transactions, loading, onUpdate, onAddClick, onEditClick }) => {
  const [timeframe, setTimeframe] = useState('this_month');

  // Filter transactions based on selected timeframe
  const getFilteredTransactions = () => {
    if (!transactions) return [];

    const now = new Date();
    
    return transactions.filter((t) => {
      if (!t.date) return false;
      const tDate = new Date(t.date);

      if (timeframe === '7_days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return tDate >= sevenDaysAgo;
      }

      if (timeframe === '30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return tDate >= thirtyDaysAgo;
      }

      if (timeframe === 'this_month') {
        return (
          tDate.getFullYear() === now.getFullYear() &&
          tDate.getMonth() === now.getMonth()
        );
      }

      return true; // 'all'
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const timeframes = [
    { id: '7_days', label: '7 Days' },
    { id: '30_days', label: '30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 pb-8 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-48 bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-3xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-3xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-3xl"></div>
        </div>
        <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Dashboard Top Row Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5 animate-in fade-in duration-300">Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector toggle */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-zinc-950 border border-slate-200/40 dark:border-zinc-800/40 p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 outline-none ${
                  timeframe === tf.id
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddClick}
            className="hidden md:inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-3 text-sm font-bold shadow-none transition duration-150 outline-none active:scale-[0.98]"
          >
            <SlPlus className="text-xs font-bold" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <Stats transactions={filteredTransactions} />

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TrendChart transactions={filteredTransactions} />
        </div>
        <div className="lg:col-span-2">
          <CategoryBreakdownDonut userId={user?.uid} transactions={filteredTransactions} />
        </div>
      </div>

      {/* Dynamic Forecast & Smart Tips Section */}
      <DashboardInsights transactions={filteredTransactions} userId={user?.uid} />

      {/* Recent Transactions List */}
      <TransactionList 
        userId={user?.uid}
        transactions={filteredTransactions} 
        loading={loading} 
        onUpdate={onUpdate} 
        onEditClick={onEditClick}
        title={`Transactions this period (${filteredTransactions.length})`}
      />
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  transactions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default Dashboard;