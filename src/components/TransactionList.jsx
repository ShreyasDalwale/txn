import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SlArrowUp, SlArrowDown, SlDoc } from 'react-icons/sl';
import { softDeleteTxn, updateTxn } from '../services/firebase/firebase';
import { TRANSACTION_CATEGORIES } from '../constants/categories';
import './TransactionList.css';

const TransactionList = ({ transactions, loading, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryLabel = (categoryValue) => {
    const category = TRANSACTION_CATEGORIES.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await softDeleteTxn(id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateTxn(id, editData);
      setEditingId(null);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      alert('Failed to update transaction');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="transaction-list-container">
        <h2 className="list-title">Recent Transactions</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h2 className="list-title">Recent Transactions</h2>
        <div className="empty-state">
          <div className="empty-icon">
            <SlDoc />
          </div>
          <p>No transactions yet. Add your first transaction above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h2 className="list-title">Recent Transactions</h2>
      
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`transaction-item ${transaction.type}`}
          >
            {editingId === transaction.id ? (
              <div className="edit-form">
                <div className="edit-row">
                  <div className="edit-group">
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) =>
                        setEditData({ ...editData, amount: parseFloat(e.target.value) })
                      }
                      className="edit-input"
                    />
                  </div>
                  <div className="edit-group">
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="edit-select"
                    >
                      {TRANSACTION_CATEGORIES.filter(
                        (cat) => cat.type === transaction.type || cat.type === 'both'
                      ).map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="edit-group">
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder="Description"
                    className="edit-input"
                  />
                </div>
                <div className="edit-group">
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    className="edit-input"
                  />
                </div>
                <div className="edit-actions">
                  <button
                    onClick={() => handleSaveEdit(transaction.id)}
                    className="btn-save"
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="transaction-content">
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? (
                      <SlArrowUp />
                    ) : (
                      <SlArrowDown />
                    )}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-category">
                      {getCategoryLabel(transaction.category)}
                    </div>
                    {transaction.description && (
                      <div className="transaction-description">
                        {transaction.description}
                      </div>
                    )}
                    <div className="transaction-date">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                  <div className="transaction-amount-section">
                    <div
                      className={`transaction-amount ${
                        transaction.type === 'income' ? 'income-amount' : 'expense-amount'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
                <div className="transaction-actions">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="btn-edit"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func,
};

export default TransactionList;
