import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import TransactionForm from '../components/TransactionForm';
import './AddTransaction.css';

const AddTransaction = ({ user, onTransactionAdded }) => {
  const navigate = useNavigate();

  const handleTransactionAdded = () => {
    if (onTransactionAdded) {
      onTransactionAdded();
    }
    navigate('/');
  };

  return (
    <div className="add-transaction-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back
        </button>
      </div>
      
      <TransactionForm user={user} onTransactionAdded={handleTransactionAdded} />
    </div>
  );
};

AddTransaction.propTypes = {
  user: PropTypes.object,
  onTransactionAdded: PropTypes.func,
};

export default AddTransaction;