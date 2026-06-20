import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, increment } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'tags';

export const addTag = async (userId, tagData) => {
  const tagRef = collection(db, `users/${userId}/${COLLECTION}`);
  const docRef = await addDoc(tagRef, {
    ...tagData,
    usageCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTag = async (userId, tagId, tagData) => {
  const tagRef = doc(db, `users/${userId}/${COLLECTION}`, tagId);
  await updateDoc(tagRef, {
    ...tagData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteTag = async (userId, tagId) => {
  const tagRef = doc(db, `users/${userId}/${COLLECTION}`, tagId);
  await deleteDoc(tagRef);
};

export const getTags = async (userId) => {
  const tagsRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(tagsRef);
  
  let tags = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  // Sort in JavaScript to avoid index requirement
  tags.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  
  return tags;
};

export const incrementTagUsage = async (userId, tagId) => {
  const tagRef = doc(db, `users/${userId}/${COLLECTION}`, tagId);
  await updateDoc(tagRef, {
    usageCount: increment(1),
  });
};