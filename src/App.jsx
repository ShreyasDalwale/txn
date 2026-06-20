import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SlChart, SlGraph, SlWallet } from 'react-icons/sl';
import './App.css';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useBooks } from './hooks/useBooks';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading: transLoading, refetch } = useTransactions(user?.uid);
  const { books } = useBooks(user?.uid);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

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

  if (authLoading) {
    return (
      <div className="app-shell">
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <p className="text-sm text-slate-500">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-shell">
        {showUpdateBanner && (
          <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
            <span>New version available</span>
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-900"
            >
              Update now
            </button>
          </div>
        )}

        {user && <Sidebar activeBook={activeBook} user={user} />}

        <main className="main-content pb-24 pt-6 md:pl-72 md:pb-8 md:pt-6">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {user ? (
              <>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        user={user}
                        transactions={transactions}
                        loading={transLoading}
                        onUpdate={refetch}
                      />
                    }
                  />
                  <Route
                    path="/add"
                    element={<AddTransaction user={user} onTransactionAdded={refetch} />}
                  />
                  <Route
                    path="/transactions"
                    element={
                      <Transactions
                        user={user}
                        transactions={transactions}
                        loading={transLoading}
                        onUpdate={refetch}
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
                <BottomNav />
              </>
            ) : (
              <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <h2 className="text-3xl font-semibold text-slate-900">Welcome to Expense Tracker</h2>
                  <p className="mt-3 text-base text-slate-500">
                    Track your income and expenses effortlessly. Sign in with Google to get started.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <span className="flex justify-center text-sky-500"><SlChart /></span>
                      <span className="mt-2 block text-sm text-slate-600">Track transactions</span>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <span className="flex justify-center text-emerald-500"><SlWallet /></span>
                      <span className="mt-2 block text-sm text-slate-600">Monitor balance</span>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <span className="flex justify-center text-violet-500"><SlGraph /></span>
                      <span className="mt-2 block text-sm text-slate-600">View statistics</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;

