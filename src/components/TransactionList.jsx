import React from 'react';
import PropTypes from 'prop-types';
import { SlDoc, SlPencil, SlTrash } from 'react-icons/sl';
import { softDeleteTxn } from '../services/firebase/firebase';
import { useCategories } from '../hooks/useCategories';
import { TRANSACTION_CATEGORIES } from '../constants/categories';

const TransactionList = ({ userId, transactions, loading, onUpdate, onEditClick }) => {
  const { categories } = useCategories(userId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatGroupDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getCategoryDetails = (categoryId) => {
    const firestoreCategory = categories?.find((c) => c.id === categoryId);
    if (firestoreCategory) {
      return { name: firestoreCategory.name, icon: firestoreCategory.icon || '📦' };
    }
    const staticCategory = TRANSACTION_CATEGORIES.find((cat) => cat.value === categoryId);
    if (staticCategory) {
      const emojiMatch = staticCategory.label.match(/^([^\s]+)/);
      const labelText = staticCategory.label.replace(/^([^\s]+)\s+/, '');
      return { name: labelText, icon: emojiMatch ? emojiMatch[0] : '📦' };
    }
    return { name: categoryId || 'Uncategorized', icon: '📦' };
  };

  const handleDelete = async (id) => {
    try {
      await softDeleteTxn(id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction');
    }
  };

  // Group transactions by date key (YYYY-MM-DD)
  const groupedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    const groups = {};
    transactions.forEach((txn) => {
      const dateKey = txn.date ? txn.date.slice(0, 10) : 'unknown';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(txn);
    });
    // Sort groups newest first
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 dark:border-zinc-800 border-t-slate-900 dark:border-t-white" />
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Loading…</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-600">
          <SlDoc className="text-2xl" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-400 dark:text-slate-500">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedTransactions.map(([dateKey, txns]) => (
        <div key={dateKey}>
          {/* Date group header */}
          {(() => {
            const dayIn = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const dayOut = txns.filter(t => t.type !== 'income').reduce((s, t) => s + t.amount, 0);
            return (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {formatGroupDate(txns[0].date)}
                </span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-zinc-800" />
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {dayIn > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
                      +{formatCurrency(dayIn)}
                    </span>
                  )}
                  {dayOut > 0 && (
                    <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                      −{formatCurrency(dayOut)}
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Transaction rows */}
          <div className="space-y-2">
            {txns.map((transaction) => {
              const category = getCategoryDetails(transaction.categoryId || transaction.category);
              const isIncome = transaction.type === 'income';
              const time = formatTime(transaction.date);

              return (
                <div
                  key={transaction.id}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/20 px-4 py-3.5 transition-all duration-150 hover:bg-white dark:hover:bg-zinc-800/50 hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-sm"
                >
                  {/* Icon + Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base border ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span role="img" aria-label={category.name}>{category.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate leading-tight">
                        {category.name}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5 leading-tight">
                          {transaction.description}
                        </p>
                      )}
                      {time && (
                        <p className="text-[10px] font-medium text-slate-300 dark:text-zinc-600 mt-1 leading-none">
                          {time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p
                      className={`text-sm font-bold tabular-nums tracking-tight ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}
                    </p>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        type="button"
                        onClick={() => onEditClick && onEditClick(transaction)}
                        className="rounded-lg border border-slate-200 dark:border-zinc-700 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition outline-none"
                        title="Edit transaction"
                      >
                        <SlPencil className="text-[11px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        className="rounded-lg border border-slate-200 dark:border-zinc-700 p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900/40 transition outline-none"
                        title="Delete transaction"
                      >
                        <SlTrash className="text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
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
};

export default TransactionList;
