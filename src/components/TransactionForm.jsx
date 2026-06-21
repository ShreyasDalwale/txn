import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addTxn, updateTxn } from '../services/firebase/firebase';
import { useCategories } from '../hooks/useCategories';
import { useAccounts } from '../hooks/useAccounts';
import CustomSelect from './CustomSelect';

const TransactionForm = ({ user, transactionToEdit, onTransactionAdded, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: '',
    accountId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryGrid, setShowCategoryGrid] = useState(false);

  const amountRef = useRef(null);
  const categoryRef = useRef(null);

  const { categories, loading: categoriesLoading } = useCategories(user?.uid);
  const { accounts, loading: accountsLoading } = useAccounts(user?.uid);

  // Sync state with transactionToEdit or reset on new transaction
  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        amount: transactionToEdit.amount.toString(),
        type: transactionToEdit.type || 'expense',
        category: transactionToEdit.categoryId || transactionToEdit.category || '',
        description: transactionToEdit.description || '',
        date: transactionToEdit.date || '',
        accountId: transactionToEdit.accountId || '',
      });
    } else {
      const now = new Date();
      const initialDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: initialDateTime,
        accountId: '',
      });
    }
    setError('');
  }, [transactionToEdit]);

  // Set default account when accounts load
  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.accountId) {
      if (transactionToEdit) {
        setFormData((prev) => ({
          ...prev,
          accountId: transactionToEdit.accountId || accounts[0]?.id || '',
        }));
      } else {
        const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];
        if (defaultAccount) {
          setFormData((prev) => ({
            ...prev,
            accountId: defaultAccount.id,
          }));
        }
      }
    }
  }, [accounts, transactionToEdit, formData.accountId]);

  // Set default category when categories load
  useEffect(() => {
    if (!categories || categories.length === 0 || formData.category) return;

    const filtered = categories.filter((cat) => cat.type === formData.type || cat.type === 'both');
    const firstCategory = filtered[0] || categories[0];
    if (firstCategory) {
      setFormData((prev) => ({ ...prev, category: firstCategory.id }));
    }
  }, [categories, formData.type, formData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!user) {
      setError('You must be signed in to submit transactions');
      return;
    }

    try {
      setLoading(true);

      if (!accounts || accounts.length === 0) {
        setError('Please set up an account in Settings first');
        return;
      }

      if (!formData.accountId) {
        setError('Please select an account');
        return;
      }

      const txnData = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        categoryId: formData.category,
        description: formData.description,
        date: formData.date,
        userId: user.uid,
        bookId: null,
        accountId: formData.accountId,
      };

      if (transactionToEdit) {
        await updateTxn(transactionToEdit.id, txnData);
      } else {
        await addTxn(txnData);
      }

      // Reset form if creating
      if (!transactionToEdit) {
        const nextDateTime = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
          new Date().getDate()
        ).padStart(2, '0')}T${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

        const defaultAccount = accounts?.find((a) => a.isDefault) || accounts?.[0];

        setFormData({
          amount: '',
          type: 'expense',
          category: categories?.filter((c) => c.level === 0)?.[0]?.id || '',
          description: '',
          date: nextDateTime,
          accountId: defaultAccount?.id || '',
        });
      }

      setShowCategoryGrid(false);

      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      setError('Failed to save transaction. Please try again.');
      console.error('Error saving transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeToggle = (type) => {
    setFormData((prev) => {
      const filtered = categories?.filter((cat) => cat.type === type || cat.type === 'both') || [];
      const defaultCatId = filtered[0]?.id || '';
      return { ...prev, type, category: defaultCatId };
    });
  };

  const handleCategorySelect = (categoryValue) => {
    setFormData((prev) => ({ ...prev, category: categoryValue }));
    setShowCategoryGrid(false);
  };

  const visibleCategories = categories?.filter((cat) => cat.isActive !== false) || [];
  const typedCategories = visibleCategories.filter((cat) => cat.type === formData.type || cat.type === 'both');
  const selectedCategory = visibleCategories.find((c) => c.id === formData.category) || typedCategories[0] || null;

  const accountOptions = (accounts || []).map((acc) => ({
    value: acc.id,
    label: acc.name,
    icon: acc.icon || '💳',
    subLabel: `$${acc.balance?.toFixed(2) || '0.00'}`,
  }));

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Spacer to push content to bottom on mobile */}
      <div className="flex-1 md:hidden" />

      {/* Header and Close Action */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-zinc-800 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all outline-none"
            aria-label="Close form"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 dark:border-rose-900/20 bg-rose-50 dark:bg-rose-900/10 px-4 py-3.5 text-xs font-bold text-rose-700 dark:text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col relative z-10 space-y-6">
        <div className="space-y-5">
          {/* Toggle Income / Expense */}
        <div>
          <label className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Type</label>
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-950 border border-slate-200/40 dark:border-zinc-800/40 p-1">
            <button
              type="button"
              className={`rounded-xl py-2.5 text-xs font-bold transition-all duration-150 ${
                formData.type === 'expense'
                  ? 'bg-rose-600 text-white shadow-none'
                  : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
              onClick={() => handleTypeToggle('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`rounded-xl py-2.5 text-xs font-bold transition-all duration-150 ${
                formData.type === 'income'
                  ? 'bg-emerald-600 text-white shadow-none'
                  : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
              onClick={() => handleTypeToggle('income')}
            >
              Income
            </button>
          </div>
        </div>

        {/* Date and Time input */}
        <div>
          <label htmlFor="date" className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Date & Time
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-2xl glow-focus px-4 py-3 text-sm text-slate-900 dark:text-slate-100 transition-all duration-150"
            required
          />
        </div>

        {/* Amount input */}
        <div>
          <label htmlFor="amount" className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 font-bold">$</span>
            <input
              ref={amountRef}
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-2xl glow-focus pl-9 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-extrabold tracking-wide transition-all duration-150"
              required
            />
          </div>
        </div>

        {/* Account selector */}
        <div>
          <label htmlFor="accountId" className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Account
          </label>
          {accountsLoading ? (
            <div className="h-11 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800" />
          ) : accounts.length > 0 ? (
            <CustomSelect
              id="accountId"
              value={formData.accountId}
              onChange={(val) => setFormData({ ...formData, accountId: val })}
              options={accountOptions}
              placeholder="Select an account"
            />
          ) : (
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/20 rounded-2xl px-4 py-3.5">
              Please set up an account in Settings first.
            </div>
          )}
        </div>

        {/* Category selector */}
        <div>
          <label className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</label>
          <div className="relative">
            <button
              type="button"
              ref={categoryRef}
              onClick={() => setShowCategoryGrid((prev) => !prev)}
              className="w-full rounded-2xl glow-focus px-4 py-3 text-left text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between shadow-none transition-all duration-150"
            >
              <span className="flex items-center gap-2">
                {selectedCategory?.icon && <span>{selectedCategory.icon}</span>}
                <span className="font-bold">{selectedCategory?.name || 'Select category'}</span>
              </span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {showCategoryGrid && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-none max-h-60 overflow-y-auto">
                {categoriesLoading ? (
                  <p className="px-3 py-3.5 text-xs text-slate-500 font-bold">Loading categories...</p>
                ) : typedCategories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {typedCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition border ${
                          formData.category === cat.id
                            ? 'bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-800 text-white shadow-none'
                            : 'bg-slate-50 dark:bg-zinc-950 border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-3.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No categories found. Add some in settings.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description input */}
        <div>
          <label htmlFor="description" className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional notes"
            rows="2"
            className="w-full rounded-2xl glow-focus px-4 py-3 text-sm text-slate-900 dark:text-slate-100 transition-all duration-150 resize-none"
          />
        </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-2.5">
          <button
            type="submit"
            disabled={loading || !user}
            className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3.5 text-sm font-bold transition-all duration-150 outline-none active:scale-[0.98] disabled:opacity-50"
          >
            {loading 
              ? (transactionToEdit ? 'Saving changes...' : 'Adding transaction...') 
              : (transactionToEdit ? 'Save Changes' : 'Add Transaction')}
          </button>
          
          {transactionToEdit && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 py-3.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition duration-150 active:scale-[0.99]"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

TransactionForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  transactionToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.string,
    categoryId: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    bookId: PropTypes.string,
    accountId: PropTypes.string,
  }),
  onTransactionAdded: PropTypes.func,
  onClose: PropTypes.func,
};

export default TransactionForm;
