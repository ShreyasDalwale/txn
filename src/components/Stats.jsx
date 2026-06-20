import React from 'react';
import PropTypes from 'prop-types';
import { SlWallet, SlArrowUp, SlArrowDown } from 'react-icons/sl';

const Stats = ({ transactions }) => {
  const calculateStats = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  };

  const { income, expenses, balance } = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      label: 'Income',
      value: formatCurrency(income),
      icon: SlArrowUp,
      tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      label: 'Expenses',
      value: formatCurrency(expenses),
      icon: SlArrowDown,
      tone: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20',
    },
    {
      label: 'Balance',
      value: formatCurrency(balance),
      icon: SlWallet,
      tone: balance >= 0 
        ? 'text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800' 
        : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div 
          key={label} 
          className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
              <p className="mt-2 truncate text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
            </div>
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="text-base font-bold" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Stats.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      amount: PropTypes.number,
    })
  ).isRequired,
};

export default Stats;
