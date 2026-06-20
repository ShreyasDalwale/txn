import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'books';

export const addBook = async (userId, bookData) => {
  const bookRef = collection(db, `users/${userId}/${COLLECTION}`);
  const docRef = await addDoc(bookRef, {
    ...bookData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateBook = async (userId, bookId, bookData) => {
  const bookRef = doc(db, `users/${userId}/${COLLECTION}`, bookId);
  await updateDoc(bookRef, {
    ...bookData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBook = async (userId, bookId) => {
  const bookRef = doc(db, `users/${userId}/${COLLECTION}`, bookId);
  await deleteDoc(bookRef);
};

export const getBooks = async (userId) => {
  const booksRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(booksRef);
  
  let books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  // Sort in JavaScript to avoid index requirement
  books.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  
  return books;
};

export const getDefaultBook = async (userId) => {
  const booksRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(booksRef);
  
  const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const defaultBook = books.find(book => book.isDefault === true);
  
  if (defaultBook) {
    return defaultBook;
  }
  return null;
};