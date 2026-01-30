import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addTxn } from '../services/firebase/firebase';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../constants/categories';
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

  const filteredCategories = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.type === formData.type || cat.type === 'both'
  );

  return (
    <div className="transaction-form-container">
      <h2 className="form-title">Add New Transaction</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              required
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              {filteredCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description..."
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
