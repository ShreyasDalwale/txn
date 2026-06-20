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

const ColorPicker = ({ value, onChange, defaultColor }) => {
  const currentColor = value || defaultColor;
  const [localText, setLocalText] = useState(currentColor);

  // Sync local text when value changes from outside
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
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Color Theme</label>
      
      {/* Preset Palette */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`h-7 w-7 rounded-full border border-slate-200 dark:border-zinc-800 shadow-none transition-all duration-150 hover:scale-105 active:scale-95 ${
              currentColor.toLowerCase() === preset.toLowerCase()
                ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-900 scale-105 shadow-none'
                : ''
            }`}
            style={{ backgroundColor: preset }}
            onClick={() => {
              onChange(preset);
              setLocalText(preset);
            }}
            title={preset}
          />
        ))}
      </div>

      {/* Native Picker & Hex Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-slate-50 dark:bg-zinc-950 shadow-none transition-all hover:border-slate-350 dark:hover:border-zinc-700">
          <input
            type="color"
            value={nativeValue}
            onChange={(e) => {
              const newColor = e.target.value;
              onChange(newColor);
              setLocalText(newColor);
            }}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          />
          <div className="h-6 w-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-none" style={{ backgroundColor: currentColor }} />
        </div>
        <input
          type="text"
          value={localText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#HEX"
          className="flex-1 rounded-2xl glow-focus px-4 py-3 text-sm text-slate-900 dark:text-slate-100 font-mono uppercase"
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
    if (activeTab === 'books') return books || [];
    if (activeTab === 'accounts') return accounts || [];
    if (activeTab === 'categories') return categories || [];
    if (activeTab === 'tags') return tags || [];
    return [];
  };

  const renderForm = () => {
    const inputClasses = "w-full rounded-2xl glow-focus px-4 py-3 text-sm text-slate-900 dark:text-slate-100";
    
    if (activeTab === 'books') {
      return (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Book Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={inputClasses}
          />
          <input
            type="text"
            placeholder="Currency (USD)"
            value={formData.currency || 'USD'}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className={inputClasses}
          />
          <input
            type="text"
            placeholder="Icon (📖)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className={inputClasses}
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#11998e"
          />
        </div>
      );
    } else if (activeTab === 'accounts') {
      return (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Account Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />
          <select
            value={formData.type || 'bank'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={inputClasses}
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
            className={inputClasses}
          />
          <select
            value={formData.bookId || books[0]?.id || ''}
            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
            className={inputClasses}
          >
            {books?.map((book) => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Icon (🏦)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className={inputClasses}
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#10b981"
          />
        </div>
      );
    } else if (activeTab === 'categories') {
      return (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />
          <select
            value={formData.type || 'expense'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={inputClasses}
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
            className={inputClasses}
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#f43f5e"
          />
        </div>
      );
    } else if (activeTab === 'tags') {
      return (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tag Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
          />
          <input
            type="text"
            placeholder="Icon (✈️)"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className={inputClasses}
          />
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
            defaultColor="#8b5cf6"
          />
        </div>
      );
    }
  };

  const tabs = [
    { id: 'preference', label: 'Preference' },
    { id: 'books', label: 'Books' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'categories', label: 'Categories' },
    { id: 'tags', label: 'Tags' },
  ];

  return (
    <div className="space-y-6 pb-8 relative z-10">
      {/* Settings Title */}
      <div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Configuration</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">Settings</h1>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1.5 border-b border-slate-200 dark:border-zinc-800 pb-2.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 flex-shrink-0 outline-none ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-zinc-800 text-white shadow-none'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              cancelEdit();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'preference' ? (
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Book</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Select which book to use for transaction logs</p>
            
            <div className="mt-6 space-y-3">
              {books?.map((book) => (
                <div
                  key={book.id}
                  className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all duration-150 ${
                    activeBookId === book.id
                      ? 'border-brand-teal bg-brand-teal/5 dark:bg-brand-teal/10 shadow-none font-bold'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900'
                  }`}
                  onClick={() => onActiveBookChange(book.id)}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-850 text-lg border border-slate-200 dark:border-zinc-850 shadow-none">
                    {book.icon || '📖'}
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-slate-200">{book.name}</span>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">{book.currency || 'USD'}</span>
                  </div>
                  {activeBookId === book.id && (
                    <span className="ml-auto rounded-lg bg-brand-teal text-white text-[10px] font-bold px-2 py-0.5">
                      Active
                    </span>
                  )}
                </div>
              ))}
              {(!books || books.length === 0) && (
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 text-center py-8">
                  No books found. Please create a book first in the Books tab.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form Panel */}
            <div className="lg:col-span-1 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none h-fit">
              <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
              </h3>
              {renderForm()}
              <div className="mt-5 flex gap-2">
                {editingItem ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3 px-4 text-xs font-bold transition duration-150 active:scale-[0.98] disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 py-3 px-4 text-xs font-bold transition duration-150 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-3.5 px-4 text-xs font-bold transition duration-150 active:scale-[0.98] disabled:opacity-50"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            {/* List Panel */}
            <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Existing {activeTab}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {getItems().map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 rounded-2xl p-4 hover:bg-slate-100/50 dark:hover:bg-zinc-850/50 transition duration-150"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.icon && (
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-lg border border-slate-200 dark:border-zinc-800 shadow-none">
                          {item.icon}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{item.name}</h4>
                        {activeTab === 'accounts' && (
                          <p className="text-xs font-semibold text-slate-455 dark:text-slate-500 mt-0.5 truncate capitalize">
                            {item.type} • ${item.balance?.toFixed(2) || '0.00'}
                          </p>
                        )}
                        {activeTab === 'categories' && (
                          <p className="text-xs font-semibold text-slate-455 dark:text-slate-500 mt-0.5 capitalize">{item.type}</p>
                        )}
                        {activeTab === 'tags' && (
                          <p className="text-xs font-semibold text-slate-455 dark:text-slate-500 mt-0.5">{item.usageCount || 0} uses</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 py-2 text-xs font-bold text-slate-550 dark:text-slate-455 hover:text-rose-600 hover:bg-white dark:hover:bg-zinc-800 transition outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {getItems().length === 0 && (
                  <p className="col-span-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-8">
                    No {activeTab} defined yet. Create one on the left.
                  </p>
                )}
              </div>
            </div>
          </div>
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
