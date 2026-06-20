import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addTxn } from '../services/firebase/firebase';
import { useCategories } from '../hooks/useCategories';
import { useBooks } from '../hooks/useBooks';
import { useAccounts } from '../hooks/useAccounts';

const TransactionForm = ({ user, onTransactionAdded }) => {
  const now = new Date();
  const initialDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: initialDateTime,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryGrid, setShowCategoryGrid] = useState(false);

  const amountRef = useRef(null);
  const categoryRef = useRef(null);

  const { categories, loading: categoriesLoading } = useCategories(user?.uid);
  const { books } = useBooks(user?.uid);
  const defaultBook = books?.find((b) => b.isDefault) || books?.[0];
  const { accounts } = useAccounts(user?.uid, defaultBook?.id);
  const defaultAccount = accounts?.find((a) => a.isDefault) || accounts?.[0];

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const validCategory = categories.find((cat) => cat.id === formData.category);
    if (!formData.category || !validCategory) {
      const firstCategory = categories[0];
      if (firstCategory) {
        setFormData((prev) => ({ ...prev, category: firstCategory.id }));
      }
    }
  }, [categories, formData.category]);

  useEffect(() => {
    if (amountRef.current) {
      amountRef.current.focus();
    }
  }, [formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!user) {
      setError('You must be signed in to add transactions');
      return;
    }

    try {
      setLoading(true);

      if (!defaultBook || !defaultAccount) {
        setError('Please set up a book and account in Settings first');
        return;
      }

      await addTxn({
        amount: parseFloat(formData.amount),
        type: formData.type,
        categoryId: formData.category,
        description: formData.description,
        date: formData.date,
        userId: user.uid,
        bookId: defaultBook.id,
        accountId: defaultAccount.id,
      });

      const nextDateTime = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
        new Date().getDate()
      ).padStart(2, '0')}T${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

      setFormData({
        amount: '',
        type: 'expense',
        category: categories?.filter((c) => c.level === 0)?.[0]?.id || '',
        description: '',
        date: nextDateTime,
      });

      setShowCategoryGrid(false);

      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeToggle = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleCategorySelect = (categoryValue) => {
    setFormData((prev) => ({ ...prev, category: categoryValue }));
    setShowCategoryGrid(false);
  };

  const visibleCategories = categories?.filter((cat) => cat.isActive !== false) || [];
  const selectedCategory =
    visibleCategories.find((c) => c.id === formData.category) || visibleCategories[0] || null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">Record</p>
        <h2 className="text-2xl font-semibold text-slate-900">Add New Transaction</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Type</label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1">
              <button
                type="button"
                className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  formData.type === 'income'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 hover:bg-white'
                }`}
                onClick={() => handleTypeToggle('income')}
              >
                Income
              </button>
              <button
                type="button"
                className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  formData.type === 'expense'
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-600 hover:bg-white'
                }`}
                onClick={() => handleTypeToggle('expense')}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
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
              className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <div className="relative">
            <button
              type="button"
              ref={categoryRef}
              onClick={() => setShowCategoryGrid((prev) => !prev)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 outline-none focus:border-slate-900"
            >
              {selectedCategory?.name || 'Select category'}
            </button>

            {showCategoryGrid && (
              <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                {categoriesLoading ? (
                  <p className="px-2 py-3 text-sm text-slate-500">Loading categories...</p>
                ) : visibleCategories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {visibleCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
                          formData.category === cat.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-3 text-sm text-slate-500">
                    No categories found. Add some in settings.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional notes"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !user}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Adding transaction...' : 'Add Transaction'}
        </button>
      </form>
    </section>
  );
};

TransactionForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  onTransactionAdded: PropTypes.func,
};

export default TransactionForm;
