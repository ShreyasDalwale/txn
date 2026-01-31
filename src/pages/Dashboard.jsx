import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Stats from '../components/Stats';
import TransactionList from '../components/TransactionList';
import './Dashboard.css';

const Dashboard = ({ user, transactions, loading, onUpdate }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/add" className="btn-add-transaction">
          + Add Transaction
        </Link>
      </div>
      
      <Stats transactions={transactions} />
      <TransactionList
        transactions={transactions}
        loading={loading}
        onUpdate={onUpdate}
      />
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  transactions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Dashboard;