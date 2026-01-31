import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addTxn } from '../services/firebase/firebase';
import { TRANSACTION_CATEGORIES } from '../constants/categories';
import './TransactionForm.css';

const TransactionForm = ({ user, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryGrid, setShowCategoryGrid] = useState(false);
  const [categorySearchText, setCategorySearchText] = useState('');
  
  const amountRef = useRef(null);
  const categoryRef = useRef(null);
  const dateRef = useRef(null);

  // Auto-focus amount when type changes
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
      await addTxn({
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        userId: user.uid,
      });

      setFormData({
        amount: '',
        type: 'expense',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0],
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
    // Reset category to first available for the selected type
    const firstCategory = TRANSACTION_CATEGORIES.find(
      (cat) => cat.type === type || cat.type === 'both'
    );
    if (firstCategory) {
      setFormData((prev) => ({ ...prev, category: firstCategory.value }));
    }
  };

  const handleAmountKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      categoryRef.current?.focus();
    }
  };

  const handleCategorySelect = (categoryValue) => {
    setFormData((prev) => ({ ...prev, category: categoryValue }));
    setShowCategoryGrid(false);
    setCategorySearchText('');
  };

  const handleCategoryKeyDown = (e) => {
    // Open/close with Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (showCategoryGrid) {
        setShowCategoryGrid(false);
        dateRef.current?.focus();
      } else {
        setShowCategoryGrid(true);
      }
      return;
    }
    
    // Close with Escape
    if (e.key === 'Escape') {
      setShowCategoryGrid(false);
      setCategorySearchText('');
      return;
    }
    
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      setCategorySearchText('');
      return;
    }
    
    // Handle letter typing
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const newSearchText = categorySearchText + e.key.toLowerCase();
      setCategorySearchText(newSearchText);
      
      // Find matching category
      const matchedCategory = filteredCategories.find((cat) => 
        cat.label.toLowerCase().includes(newSearchText) ||
        cat.value.toLowerCase().startsWith(newSearchText)
      );
      
      if (matchedCategory) {
        setFormData((prev) => ({ ...prev, category: matchedCategory.value }));
        setShowCategoryGrid(true);
      }
    }
  };

  const filteredCategories = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.type === formData.type || cat.type === 'both'
  );

  return (
    <div className="transaction-form-container">
      <h2 className="form-title">Add New Transaction</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            ref={dateRef}
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Type Toggle */}
        <div className="form-group no-underline">
          <label>Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'income' ? 'active income' : ''}`}
              onClick={() => handleTypeToggle('income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => handleTypeToggle('expense')}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            ref={amountRef}
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onKeyDown={handleAmountKeyDown}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="form-input"
            required
          />
        </div>

        {/* Category Grid */}
        <div className="form-group">
          <label>Category</label>
          <button
            type="button"
            ref={categoryRef}
            className="category-display"
            onClick={() => setShowCategoryGrid(!showCategoryGrid)}
            onFocus={() => setShowCategoryGrid(true)}
            onBlur={() => {
              // Delay to allow clicks on chips to register
              setTimeout(() => setShowCategoryGrid(false), 200);
            }}
            onKeyDown={handleCategoryKeyDown}
          >
            {filteredCategories.find((cat) => cat.value === formData.category)?.label || 'Select Category'}
          </button>
          
          {showCategoryGrid && (
            <div className="category-grid">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  tabIndex="-1"
                  className={`category-chip ${formData.category === cat.value ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional..."
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading || !user}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

TransactionForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  onTransactionAdded: PropTypes.func,
};

export default TransactionForm;
