import { useState, useEffect } from 'react';
import { getAccounts } from '../services/firebase/firestore/accounts';

export const useAccounts = (userId, bookId = null) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    if (!userId) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAccounts(userId, bookId);
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userId, bookId]);

  return { accounts, loading, error, refetch: fetchAccounts };
};