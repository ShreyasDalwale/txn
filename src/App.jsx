import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SlChart, SlGraph, SlWallet } from 'react-icons/sl';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import TransactionForm from './components/TransactionForm';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useBooks } from './hooks/useBooks';
import { signInWithGoogle } from './services/auth';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading: transLoading, refetch } = useTransactions(user?.uid);
  const { books } = useBooks(user?.uid);
  
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [activeBookId, setActiveBookId] = useState(() => {
    return localStorage.getItem('activeBookId') || null;
  });

  const activeBook = books?.find((b) => b.id === activeBookId) || books?.find((b) => b.isDefault) || books?.[0];

  useEffect(() => {
    if (activeBook?.id) {
      localStorage.setItem('activeBookId', activeBook.id);
    }
  }, [activeBook?.id]);

  useEffect(() => {
    const handleUpdateNeeded = () => {
      setShowUpdateBanner(true);
    };

    window.addEventListener('pwa-update-needed', handleUpdateNeeded);

    return () => {
      window.removeEventListener('pwa-update-needed', handleUpdateNeeded);
    };
  }, []);

  const handleUpdate = () => {
    if (window.__updateSW) {
      window.__updateSW();
    } else {
      window.location.reload();
    }
    setShowUpdateBanner(false);
  };

  const closePane = () => {
    setIsAdding(false);
    setEditingTransaction(null);
  };

  const handleEditClick = (txn) => {
    setIsAdding(false);
    setEditingTransaction(txn);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsAdding(true);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-teal"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your wallet...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-200">
        {showUpdateBanner && (
          <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 dark:border-zinc-800 px-4 py-3 text-sm text-white shadow-none animate-in fade-in duration-300">
            <span>New version available</span>
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-900 hover:bg-slate-100 transition"
            >
              Update now
            </button>
          </div>
        )}

        {user && (
          <Sidebar
            activeBook={activeBook}
            user={user}
            onAddClick={handleAddClick}
          />
        )}

        <div className="flex-1 flex flex-col md:pl-72 min-h-screen relative z-10">
          {/* Mobile Top Header */}
          {user && (
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 md:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal text-xs font-bold text-white">
                  TXN
                </div>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{activeBook?.name || 'Personal'}</span>
              </div>
            </header>
          )}

          {/* Main Layout Container */}
          <div className="flex-1 flex flex-col lg:flex-row relative z-10">
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
              {user ? (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        user={user}
                        transactions={transactions}
                        loading={transLoading}
                        onUpdate={refetch}
                        onAddClick={handleAddClick}
                        onEditClick={handleEditClick}
                      />
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <Transactions
                        user={user}
                        transactions={transactions}
                        loading={transLoading}
                        onUpdate={refetch}
                        onEditClick={handleEditClick}
                      />
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Settings
                        user={user}
                        activeBookId={activeBookId}
                        onActiveBookChange={setActiveBookId}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              ) : (
                <div className="flex min-h-[75vh] items-center justify-center px-4">
                  <div className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center shadow-none">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white text-xl font-bold">
                      TX
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-6">Welcome to Txn</h2>
                    <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Track your income and expenses effortlessly. Sign in with Google to get started.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 p-5 flex flex-col items-center">
                        <span className="text-2xl text-slate-700 dark:text-slate-300"><SlChart /></span>
                        <span className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">Track stats</span>
                      </div>
                      <div className="rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 p-5 flex flex-col items-center">
                        <span className="text-2xl text-slate-700 dark:text-slate-300"><SlWallet /></span>
                        <span className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">Monitor balance</span>
                      </div>
                      <div className="rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 p-5 flex flex-col items-center">
                        <span className="text-2xl text-slate-700 dark:text-slate-300"><SlGraph /></span>
                        <span className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">Clean reports</span>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-8 py-3.5 font-bold text-sm transition duration-200 outline-none active:scale-[0.98]"
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Pane 3: Add/Edit Pane */}
            {user && (isAdding || editingTransaction) && (
              <>
                {/* Backdrop overlay on mobile */}
                <div
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                  onClick={closePane}
                />
                
                {/* Drawer/Sidebar */}
                <aside className="fixed inset-y-0 right-0 z-50 w-full bg-slate-50 dark:bg-[#0c0c0c] border-l border-slate-200 dark:border-zinc-800 shadow-none flex flex-col transition-all duration-300 transform translate-x-0 sm:max-w-lg lg:relative lg:inset-y-auto lg:right-auto lg:z-0 lg:border-l lg:border-slate-200 lg:dark:border-zinc-800 lg:shadow-none lg:w-96 xl:w-[420px] lg:flex-shrink-0 animate-in slide-in-from-right duration-200">
                  <div className="h-full overflow-y-auto p-6">
                    <TransactionForm
                      user={user}
                      transactionToEdit={editingTransaction}
                      onTransactionAdded={() => {
                        refetch();
                        closePane();
                      }}
                      onClose={closePane}
                    />
                  </div>
                </aside>
              </>
            )}
          </div>

          {user && (
            <BottomNav
              onAddClick={handleAddClick}
            />
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
