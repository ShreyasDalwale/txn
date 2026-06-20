import React from 'react';
import PropTypes from 'prop-types';
import './Transactions.css';

const Transactions = ({ user, transactions, loading, onUpdate }) => {
  if (loading) {
    return (
      <div className="transactions-page">
        <h1 className="page-title">Transactions</h1>
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <h1 className="page-title">All Transactions</h1>
      
      {transactions && transactions.length > 0 ? (
        <div className="transactions-list">
          {transactions.map((txn) => (
            <div key={txn.id} className={`transaction-item ${txn.type}`}>
              <div className="transaction-main">
                <div className="transaction-category">
                  <span className="category-badge">{txn.category || txn.categoryId}</span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-description">
                    {txn.description || 'No description'}
                  </span>
                  <span className="transaction-date">
                    {new Date(txn.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="transaction-amount">
                <span className={`amount ${txn.type}`}>
                  {txn.type === 'income' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-transactions">
          <p>No transactions yet. Start by adding your first transaction!</p>
        </div>
      )}
    </div>
  );
};

Transactions.propTypes = {
  user: PropTypes.object,
  transactions: PropTypes.array,
  loading: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default Transactions;
