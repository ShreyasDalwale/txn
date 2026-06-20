import React from 'react';
import PropTypes from 'prop-types';
import { SlArrowUp, SlArrowDown, SlDoc, SlPencil, SlTrash } from 'react-icons/sl';
import { softDeleteTxn } from '../services/firebase/firebase';
import { useCategories } from '../hooks/useCategories';
import { TRANSACTION_CATEGORIES } from '../constants/categories';

const TransactionList = ({ userId, transactions, loading, onUpdate, onEditClick, title = 'Recent Transactions' }) => {
  const { categories } = useCategories(userId);

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

  const getCategoryDetails = (categoryId) => {
    // 1. Look up in Firestore categories first
    const firestoreCategory = categories?.find((c) => c.id === categoryId);
    if (firestoreCategory) {
      return {
        name: firestoreCategory.name,
        icon: firestoreCategory.icon || '📦',
      };
    }

    // 2. Fallback to static TRANSACTION_CATEGORIES
    const staticCategory = TRANSACTION_CATEGORIES.find((cat) => cat.value === categoryId);
    if (staticCategory) {
      const emojiMatch = staticCategory.label.match(/^([^\s]+)/);
      const labelText = staticCategory.label.replace(/^([^\s]+)\s+/, '');
      return {
        name: labelText,
        icon: emojiMatch ? emojiMatch[0] : '📦',
      };
    }

    return {
      name: categoryId || 'Uncategorized',
      icon: '📦',
    };
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

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 dark:border-zinc-800 border-t-slate-900 dark:border-t-white"></div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Loading transactions...</p>
        </div>
      </section>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-600">
            <SlDoc className="text-2xl" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-400 dark:text-slate-500">No transactions recorded yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>

      <div className="mt-5 space-y-2">
        {transactions.map((transaction) => {
          const category = getCategoryDetails(transaction.categoryId || transaction.category);
          const isIncome = transaction.type === 'income';

          return (
            <div
              key={transaction.id}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 dark:border-zinc-800/40 bg-slate-50/50 dark:bg-zinc-900/10 p-4 transition-all duration-150 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40"
            >
              {/* Category Icon & Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg border border-slate-200 dark:border-zinc-800 ${
                    isIncome 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <span role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate">
                    {category.name}
                  </p>
                  {transaction.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {transaction.description}
                    </p>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-sm font-extrabold tracking-tight ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    type="button"
                    onClick={() => onEditClick && onEditClick(transaction)}
                    className="rounded-xl border border-slate-200 dark:border-zinc-800 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition outline-none"
                    title="Edit transaction"
                  >
                    <SlPencil className="text-xs font-bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(transaction.id)}
                    className="rounded-xl border border-slate-200 dark:border-zinc-800 p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-800 transition outline-none"
                    title="Delete transaction"
                  >
                    <SlTrash className="text-xs font-bold" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

TransactionList.propTypes = {
  userId: PropTypes.string,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string,
      categoryId: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default TransactionList;
