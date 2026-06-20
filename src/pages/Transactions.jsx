import React from 'react';
import PropTypes from 'prop-types';
import TransactionList from '../components/TransactionList';

const Transactions = ({ user, transactions, loading, onUpdate, onEditClick }) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Transactions Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">Transactions</h1>
      </div>

      {/* Shared Transaction List Component */}
      <TransactionList
        userId={user?.uid}
        transactions={transactions}
        loading={loading}
        onUpdate={onUpdate}
        onEditClick={onEditClick}
        title="All Transactions"
      />
    </div>
  );
};

Transactions.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  transactions: PropTypes.array,
  loading: PropTypes.bool,
  onUpdate: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
};

export default Transactions;
