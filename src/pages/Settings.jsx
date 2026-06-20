import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../hooks/useBooks';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { addBook, updateBook, deleteBook } from '../services/firebase/firestore/books';
import { addAccount, updateAccount, deleteAccount } from '../services/firebase/firestore/accounts';
import { addCategory, updateCategory, deleteCategory } from '../services/firebase/firestore/categories';
import { addTag, updateTag, deleteTag } from '../services/firebase/firestore/tags';
import './Settings.css';

const ColorPicker = ({ value, onChange, defaultColor }) => {
  const currentColor = value || defaultColor;
  const [localText, setLocalText] = useState(currentColor);

  // Sync local text when value changes from outside (preset or prop change)
  useEffect(() => {
    setLocalText(currentColor);
  }, [currentColor]);

  const presets = [
    '#11998e', // Teal/Primary
    '#10b981', // Emerald
    '#0284c7', // Sky Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#f59e0b', // Amber
  ];

  const handleTextChange = (val) => {
    let formatted = val;
    if (formatted && !formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }
    
    if (/^#[0-9A-Fa-f]{0,6}$/.test(formatted)) {
      setLocalText(formatted);
      
      if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
        onChange(formatted.toLowerCase());
      } else if (/^#[0-9A-Fa-f]{3}$/.test(formatted)) {
        const r = formatted[1];
        const g = formatted[2];
        const b = formatted[3];
        onChange(`#${r}${r}${g}${g}${b}${b}`.toLowerCase());
      }
    }
  };

  const isValidHex = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);
  const nativeValue = isValidHex(currentColor) ? currentColor : defaultColor;

  return (
    <div className="color-picker-container">
      <label className="color-picker-label">Color Theme</label>
      <div className="color-presets">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`color-preset-btn ${currentColor.toLowerCase() === preset.toLowerCase() ? 'active' : ''}`}
            style={{ backgroundColor: preset }}
            onClick={() => {
              onChange(preset);
              setLocalText(preset);
            }}
            title={preset}
          />
        ))}
      </div>
      <div className="color-custom-row">
        <div className="color-preview-wrapper" title="Choose custom color">
          <input
            type="color"
            value={nativeValue}
            onChange={(e) => {
              const newColor = e.target.value;
              onChange(newColor);
              setLocalText(newColor);
            }}
            className="color-input-native"
          />
          <div className="color-preview-swatch" style={{ backgroundColor: currentColor }} />
        </div>
        <input
          type="text"
          value={localText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#HEX"
          className="color-input-text"
        />
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultColor: PropTypes.string,
};

const Settings = ({ user, activeBookId, onActiveBookChange }) => {
  const [activeTab, setActiveTab] = useState('preference');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const { books, refetch: refetchBooks } = useBooks(user?.uid);
  const { accounts, refetch: refetchAccounts } = useAccounts(user?.uid);
  const { categories, refetch: refetchCategories } = useCategories(user?.uid);
  const { tags, refetch: refetchTags } = useTags(user?.uid);

  const handleAdd = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (activeTab === 'books') {
        await addBook(user.uid, { ...formData, isDefault: books.length === 0 });
        refetchBooks();
      } else if (activeTab === 'accounts') {
        await addAccount(user.uid, { ...formData, isActive: true, balance: parseFloat(formData.balance || 0) });
        refetchAccounts();
      } else if (activeTab === 'categories') {
        await addCategory(user.uid, { ...formData, isActive: true, level: 0, parentId: null, order: categories.length });
        refetchCategories();
      } else if (activeTab === 'tags') {
        await addTag(user.uid, formData);
        refetchTags();
      }
      setFormData({});
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!user || !editingItem) return;
    setLoading(true);
    try {
      if (activeTab === 'books') {
        await updateBook(user.uid, editingItem.id, formData);
        refetchBooks();
      } else if (activeTab === 'accounts') {
        await updateAccount(user.uid, editingItem.id, { ...formData, balance: parseFloat(formData.balance) });
        refetchAccounts();
      } else if (activeTab === 'categories') {
        await updateCategory(user.uid, editingItem.id, formData);
        refetchCategories();
      } else if (activeTab === 'tags') {
        await updateTag(user.uid, editingItem.id, formData);
        refetchTags();
      }
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      if (activeTab === 'books') {
        await deleteBook(user.uid, id);
        refetchBooks();
      } else if (activeTab === 'accounts') {
        await deleteAccount(user.uid, id);
        refetchAccounts();
      } else if (activeTab === 'categories') {
        await deleteCategory(user.uid, id);
        refetchCategories();
      } else if (activeTab === 'tags') {
        await deleteTag(user.uid, id);
        refetchTags();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const getItems = () => {
    if (activeTab === 'books') return books;
    if (activeTab === 'accounts') return accounts;
    if (activeTab === 'categories') return categories;
    if (activeTab === 'tags') return tags;
    return [];
  };

  const renderForm = () => {
    if (activeTab === 'books') {
      return (
        <>
          <input
            type="text"
            placeholder="Book Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Currency (USD)"
            value={formData.currency || 'USD'}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Icon (💰)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="form-input"
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#00bcd4"
          />
        </>
      );
    } else if (activeTab === 'accounts') {
      return (
        <>
          <input
            type="text"
            placeholder="Account Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
          <select
            value={formData.type || 'bank'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-input"
          >
            <option value="bank">Bank Account</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="digital_wallet">Digital Wallet</option>
          </select>
          <input
            type="number"
            placeholder="Initial Balance"
            value={formData.balance || ''}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            className="form-input"
          />
          <select
            value={formData.bookId || books[0]?.id || ''}
            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
            className="form-input"
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Icon (🏦)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="form-input"
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#00e676"
          />
        </>
      );
    } else if (activeTab === 'categories') {
      return (
        <>
          <input
            type="text"
            placeholder="Category Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
          <select
            value={formData.type || 'expense'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-input"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="both">Both</option>
          </select>
          <input
            type="text"
            placeholder="Icon (🍔)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="form-input"
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#e91e63"
          />
        </>
      );
    } else if (activeTab === 'tags') {
      return (
        <>
          <input
            type="text"
            placeholder="Tag Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Icon (✈️)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="form-input"
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#9c27b0"
          />
        </>
      );
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === 'preference' ? 'active' : ''}`}
          onClick={() => { setActiveTab('preference'); cancelEdit(); }}
        >
          Preference
        </button>
        <button
          className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => { setActiveTab('books'); cancelEdit(); }}
        >
          Books
        </button>
        <button
          className={`tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('accounts'); cancelEdit(); }}
        >
          Accounts
        </button>
        <button
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => { setActiveTab('categories'); cancelEdit(); }}
        >
          Categories
        </button>
        <button
          className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`}
          onClick={() => { setActiveTab('tags'); cancelEdit(); }}
        >
          Tags
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'preference' ? (
          <div className="preference-section">
            <h3>Active Book</h3>
            <p className="preference-description">Select which book to use for new transactions</p>
            <div className="book-selection">
              {books?.map((book) => (
                <div
                  key={book.id}
                  className={`book-option ${activeBookId === book.id ? 'selected' : ''}`}
                  onClick={() => onActiveBookChange(book.id)}
                >
                  <span className="book-option-icon">{book.icon || '📖'}</span>
                  <div className="book-option-details">
                    <span className="book-option-name">{book.name}</span>
                    <span className="book-option-currency">{book.currency || 'USD'}</span>
                  </div>
                  {activeBookId === book.id && (
                    <span className="book-selected-badge">Active</span>
                  )}
                </div>
              ))}
              {(!books || books.length === 0) && (
                <p className="no-books">No books found. Create a book first in the Books tab.</p>
              )}
            </div>
          </div>
        ) : (
          <>
        <div className="settings-form">
          <h3>{editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</h3>
          {renderForm()}
          <div className="form-actions">
            {editingItem ? (
              <>
                <button onClick={handleUpdate} disabled={loading} className="btn-save">
                  Update
                </button>
                <button onClick={cancelEdit} className="btn-cancel">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAdd} disabled={loading} className="btn-add">
                Add
              </button>
            )}
          </div>
        </div>

        <div className="settings-list">
          <h3>Existing {activeTab}</h3>
          <div className="items-grid">
            {getItems().map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-info">
                  {item.icon && <span className="item-icon">{item.icon}</span>}
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    {activeTab === 'accounts' && (
                      <p className="item-meta">
                        {item.type} • ${item.balance?.toFixed(2) || '0.00'}
                      </p>
                    )}
                    {activeTab === 'categories' && (
                      <p className="item-meta">{item.type}</p>
                    )}
                    {activeTab === 'tags' && (
                      <p className="item-meta">{item.usageCount || 0} uses</p>
                    )}
                  </div>
                </div>
                <div className="item-actions">
                  <button onClick={() => startEdit(item)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

Settings.propTypes = {
  user: PropTypes.object,
  activeBookId: PropTypes.string,
  onActiveBookChange: PropTypes.func,
};

export default Settings;
