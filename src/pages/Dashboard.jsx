import React from 'react';
import PropTypes from 'prop-types';
import Stats from '../components/Stats';
import TransactionList from '../components/TransactionList';
import { SlPlus } from 'react-icons/sl';

const Dashboard = ({ user, transactions, loading, onUpdate, onAddClick, onEditClick }) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Dashboard Top Row Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Overview</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-3 text-sm font-bold shadow-none transition duration-150 outline-none active:scale-[0.98]"
        >
          <SlPlus className="text-xs font-bold" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <Stats transactions={transactions} />

      {/* Recent Transactions List */}
      <TransactionList 
        userId={user?.uid}
        transactions={transactions} 
        loading={loading} 
        onUpdate={onUpdate} 
        onEditClick={onEditClick}
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