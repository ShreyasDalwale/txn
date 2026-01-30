import React from 'react';
import PropTypes from 'prop-types';
import { SlWallet, SlArrowUp, SlArrowDown } from 'react-icons/sl';
import './Stats.css';

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

  return (
    <div className="stats-container">
      <div className="stat-card stat-income">
        <div className="stat-icon">
          <SlArrowUp />
        </div>
        <div className="stat-content">
          <h3 className="stat-label">Income</h3>
          <p className="stat-value">{formatCurrency(income)}</p>
        </div>
      </div>

      <div className="stat-card stat-expense">
        <div className="stat-icon">
          <SlArrowDown />
        </div>
        <div className="stat-content">
          <h3 className="stat-labels mt-10">Expenses</h3>
          <p className="stat-value">{formatCurrency(expenses)}</p>
        </div>
      </div>

      <div className="stat-card stat-balance">
        <div className="stat-icon">
          <SlWallet />
        </div>
        <div className="stat-content">
          <h3 className="stat-label">Balance</h3>
          <p className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
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
