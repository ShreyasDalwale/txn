import { useState, useEffect } from 'react';
import { getTags } from '../services/firebase/firestore/tags';

export const useTags = (userId) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    if (!userId) {
      setTags([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getTags(userId);
      setTags(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [userId]);

  return { tags, loading, error, refetch: fetchTags };
};