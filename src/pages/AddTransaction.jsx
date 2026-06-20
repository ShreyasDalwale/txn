import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = ({ user, onTransactionAdded }) => {
  const navigate = useNavigate();

  const handleTransactionAdded = () => {
    if (onTransactionAdded) {
      onTransactionAdded();
    }
    navigate('/');
  };

  return (
    <div className="space-y-4 pb-8">
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
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