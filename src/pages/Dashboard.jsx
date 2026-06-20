import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Stats from '../components/Stats';
import TransactionList from '../components/TransactionList';

const Dashboard = ({ user, transactions, loading, onUpdate }) => {
  return (
    <div className="space-y-6 pb-8 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Transaction
        </Link>
      </div>

      <Stats transactions={transactions} />
      <TransactionList transactions={transactions} loading={loading} onUpdate={onUpdate} />
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  transactions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Dashboard;