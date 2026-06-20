import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Add a new transaction
 */
export const addTransaction = async (userId, transactionData) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  
  const transaction = {
    ...transactionData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(transactionsRef, transaction);
  return { id: docRef.id, ...transaction };
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (userId, transactionId, updates) => {
  const transactionRef = doc(db, `users/${userId}/transactions/${transactionId}`);
  
  const updateData = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  await updateDoc(transactionRef, updateData);
  return { id: transactionId, ...updateData };
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (userId, transactionId) => {
  const transactionRef = doc(db, `users/${userId}/transactions/${transactionId}`);
  await deleteDoc(transactionRef);
};

/**
 * Get all transactions for a user
 */
export const getTransactions = async (userId, bookId = null) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  
  let q;
  if (bookId) {
    q = query(
      transactionsRef,
      where('bookId', '==', bookId),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(
      transactionsRef,
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Get transactions by account
 */
export const getTransactionsByAccount = async (userId, accountId) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  const q = query(
    transactionsRef,
    where('accountId', '==', accountId),
    orderBy('date', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Get transactions by category
 */
export const getTransactionsByCategory = async (userId, categoryId) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  const q = query(
    transactionsRef,
    where('categoryId', '==', categoryId),
    orderBy('date', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
