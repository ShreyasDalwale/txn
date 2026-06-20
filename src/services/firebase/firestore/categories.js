import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'categories';

export const addCategory = async (userId, categoryData) => {
  const categoryRef = collection(db, `users/${userId}/${COLLECTION}`);
  const docRef = await addDoc(categoryRef, {
    ...categoryData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCategory = async (userId, categoryId, categoryData) => {
  const categoryRef = doc(db, `users/${userId}/${COLLECTION}`, categoryId);
  await updateDoc(categoryRef, {
    ...categoryData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCategory = async (userId, categoryId) => {
  const categoryRef = doc(db, `users/${userId}/${COLLECTION}`, categoryId);
  await deleteDoc(categoryRef);
};

export const getCategories = async (userId) => {
  const categoriesRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(categoriesRef);
  
  let categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  // Filter and sort in JavaScript to avoid index requirements
  categories = categories.filter(cat => cat.isActive !== false);
  categories.sort((a, b) => {
    if (a.level !== b.level) return (a.level || 0) - (b.level || 0);
    return (a.order || 0) - (b.order || 0);
  });
  
  return categories;
};

export const getCategoriesByType = async (userId, type) => {
  const categoriesRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(categoriesRef);
  
  let categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const normalizedType = type?.toLowerCase();
  
  // Filter and sort in JavaScript
  categories = categories.filter(cat => {
    if (cat.isActive === false) return false;
    const catType = typeof cat.type === 'string' ? cat.type.toLowerCase() : '';
    return !catType || catType === normalizedType || catType === 'both';
  });
  categories.sort((a, b) => {
    if (a.level !== b.level) return (a.level || 0) - (b.level || 0);
    return (a.order || 0) - (b.order || 0);
  });
  
  return categories;
};

export const getSubcategories = async (userId, parentId) => {
  const categoriesRef = collection(db, `users/${userId}/${COLLECTION}`);
  const snapshot = await getDocs(categoriesRef);
  
  let subcategories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  // Filter and sort in JavaScript
  subcategories = subcategories.filter(cat => 
    cat.parentId === parentId && 
    cat.isActive !== false
  );
  subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  return subcategories;
};