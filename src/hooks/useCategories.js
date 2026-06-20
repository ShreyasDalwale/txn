import { useState, useEffect } from 'react';
import { getCategories, getCategoriesByType } from '../services/firebase/firestore/categories';

export const useCategories = (userId, type = null) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    if (!userId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = type ? await getCategoriesByType(userId, type) : await getCategories(userId);
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId, type]);

  return { categories, loading, error, refetch: fetchCategories };
};