import { useState, useEffect } from 'react';
import { findAllTxn } from '../services/firebase/firebase';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await findAllTxn(userId, 'created_at', true, 100);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  return { transactions, loading, error, refetch: fetchTransactions };
};
