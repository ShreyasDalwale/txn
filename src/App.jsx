import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SlChart, SlGraph, SlWallet } from 'react-icons/sl';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import TransactionForm from './components/TransactionForm';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { signInWithGoogle } from './services/auth';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading: transLoading, refetch } = useTransactions(user?.uid);
  const navigate = useNavigate();
  const location = useLocation();

  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const isAddTxnPage = location.pathname === '/add-transaction';

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
    if (window.innerWidth < 768) {
      setEditingTransaction(txn);
      navigate('/add-transaction');
    } else {
      setIsAdding(false);
      setEditingTransaction(txn);
    }
  };

  const handleAddClick = () => {
    if (window.innerWidth < 768) {
      navigate('/add-transaction');
    } else {
      setEditingTransaction(null);
      setIsAdding(true);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 dark:border-zinc-800 border-t-slate-900 dark:border-t-white"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your wallet...</p>
      </div>
    );
  }

  return (
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
        <Sidebar user={user} />
      )}

      <div className="flex-1 flex flex-col md:pl-72 min-h-screen relative z-10">
        {/* Main Layout Container */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-10">
          <main className={`flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 md:pb-8 ${isAddTxnPage ? 'pb-4' : 'pb-24'}`}>
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
                    />
                  }
                />
                <Route
                  path="/add-transaction"
                  element={
                    <div className="flex-1 flex flex-col justify-end min-h-[calc(100vh-32px)] md:min-h-0">
                      <TransactionForm
                        user={user}
                        transactionToEdit={editingTransaction}
                        onTransactionAdded={() => {
                          refetch();
                          setEditingTransaction(null);
                          navigate('/');
                        }}
                        onClose={() => {
                          setEditingTransaction(null);
                          navigate('/');
                        }}
                      />
                    </div>
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
                      <span className="text-2xl text-slate-700 dark:text-slate-350"><SlChart /></span>
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

          {/* Pane 3: Add/Edit Pane (Desktop only) */}
          {user && (isAdding || editingTransaction) && (
            <aside className="hidden md:flex border-l border-slate-200 dark:border-zinc-800 shadow-none flex-col w-96 xl:w-[420px] flex-shrink-0 bg-slate-50 dark:bg-[#0c0c0c] animate-in slide-in-from-right duration-200">
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
          )}
        </div>

        {/* Floating Action Button for mobile */}
        {user && !isAddTxnPage && (
          <button
            type="button"
            onClick={handleAddClick}
            className="md:hidden fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-lg transition-all duration-150 active:scale-95 active:rotate-90 outline-none"
            aria-label="Add transaction"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        {user && !isAddTxnPage && (
          <BottomNav />
        )}
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Toggle theme on Alt + T
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const currentDark = document.documentElement.classList.contains('dark');
        const nextDark = !currentDark;
        if (nextDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: nextDark } }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
