import { useState, useEffect } from 'react';
import { getBooks } from '../services/firebase/firestore/books';

export const useBooks = (userId) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    if (!userId) {
      setBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getBooks(userId);
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [userId]);

  return { books, loading, error, refetch: fetchBooks };
};