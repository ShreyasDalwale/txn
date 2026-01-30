import React from 'react';
import { SlChart, SlShield, SlGraph, SlWallet } from 'react-icons/sl';
import './App.css';
import Header from './components/Header';
import Stats from './components/Stats';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading: transLoading, refetch } = useTransactions(user?.uid);

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
    <div className="App">
      <Header user={user} />
      
      <main className="main-content">
        {user ? (
          <>
            <Stats transactions={transactions} />
            <TransactionForm user={user} onTransactionAdded={refetch} />
            <TransactionList
              transactions={transactions}
              loading={transLoading}
              onUpdate={refetch}
            />
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
  );
};

export default App;

