import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SlChart, SlGraph, SlWallet } from 'react-icons/sl';
import './App.css';
import Header from './components/Header';
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
  
  // Get active book from localStorage or use default
  const [activeBookId, setActiveBookId] = useState(() => {
    return localStorage.getItem('activeBookId') || null;
  });
  
  const activeBook = books?.find(b => b.id === activeBookId) || books?.find(b => b.isDefault) || books?.[0];
  
  // Update localStorage when active book changes
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
      <div className="App">
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {showUpdateBanner && (
          <div className="pwa-update-banner">
            <span>New version available</span>
            <button type="button" onClick={handleUpdate}>
              Update now
            </button>
          </div>
        )}
        {user && <Sidebar activeBook={activeBook} />}
        <Header user={user} />
        
        <main className="main-content">
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
                  element={
                    <AddTransaction 
                      user={user}
                      onTransactionAdded={refetch}
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
            <div className="welcome-section">
              <div className="welcome-card">
                <h2 className="welcome-title">Welcome to Expense Tracker</h2>
                <p className="welcome-text">
                  Track your income and expenses effortlessly. Sign in with Google to get started.
                </p>
                <div className="welcome-features">
                  <div className="feature">
                    <span className="feature-icon"><SlChart /></span>
                    <span>Track transactions</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon"><SlWallet /></span>
                    <span>Monitor balance</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon"><SlGraph /></span>
                    <span>View statistics</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
};

export default App;

