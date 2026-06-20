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
      tone: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Expenses',
      value: formatCurrency(expenses),
      icon: SlArrowDown,
      tone: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Balance',
      value: formatCurrency(balance),
      icon: SlWallet,
      tone: balance >= 0 ? 'text-slate-900 bg-slate-100' : 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="text-lg" />
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
