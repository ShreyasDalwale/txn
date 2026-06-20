import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SlArrowUp, SlArrowDown, SlDoc } from 'react-icons/sl';
import { softDeleteTxn, updateTxn } from '../services/firebase/firebase';
import { TRANSACTION_CATEGORIES } from '../constants/categories';

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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-2 py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"></div>
          <p className="text-sm text-slate-500">Loading transactions...</p>
        </div>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
        <div className="mt-10 flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <SlDoc className="text-2xl" />
          </div>
          <p className="mt-4 text-sm text-slate-500">No transactions yet. Add your first transaction above.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>

      <div className="mt-4 space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            {editingId === transaction.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: parseFloat(e.target.value) })
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-900"
                  />
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
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
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(transaction.id)}
                    className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {transaction.type === 'income' ? <SlArrowUp /> : <SlArrowDown />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{getCategoryLabel(transaction.category)}</p>
                      {transaction.description && (
                        <p className="text-sm text-slate-500">{transaction.description}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm text-slate-600"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm text-slate-600"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
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
