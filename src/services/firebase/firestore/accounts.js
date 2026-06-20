import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'accounts';

export const addAccount = async (userId, accountData) => {
  const accountRef = collection(db, `users/${userId}/${COLLECTION}`);
  const docRef = await addDoc(accountRef, {
    ...accountData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateAccount = async (userId, accountId, accountData) => {
  const accountRef = doc(db, `users/${userId}/${COLLECTION}`, accountId);
  await updateDoc(accountRef, {
    ...accountData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAccount = async (userId, accountId) => {
  const accountRef = doc(db, `users/${userId}/${COLLECTION}`, accountId);
  await deleteDoc(accountRef);
};

export const getAccounts = async (userId, bookId = null) => {
  const accountsRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(accountsRef);
  
  let accounts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  // Filter in JavaScript to avoid needing Firestore indexes
  accounts = accounts.filter(account => account.isActive !== false);
  
  if (bookId) {
    accounts = accounts.filter(account => account.bookId === bookId);
  }
  
  // Sort by createdAt descending
  accounts.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  
  return accounts;
};