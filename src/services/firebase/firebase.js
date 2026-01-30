import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function getCities() {
  const citiesCol = collection(db, 'transactions');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(citySnapshot);
  return cityList;
}

export async function addTxn(txn) {
  try {
    const txnData = {
      ...txn,
      is_deleted: false,
      created_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'transactions'), txnData);
    console.log('Document written with ID: ', docRef.id);
    return { id: docRef.id, ...txnData };
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
}

export async function findTxn(uid) {
  try {
    const docRef = doc(db, 'transactions', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (e) {
    console.error('Error finding document: ', e);
    throw e;
  }
}

export async function findAllTxn(userId = null, orderByField = 'created_at', desc = true, limitCount = 50) {
  try {
    const constraints = [orderBy(orderByField, desc ? 'desc' : 'asc'), limit(limitCount)];
    
    if (userId) {
      constraints.push(where('userId', '==', userId));
    }
    
    constraints.push(where('is_deleted', '==', false));
    
    const q = query(collection(db, 'transactions'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const res = [];
    querySnapshot.forEach((doc) => {
      res.push({ id: doc.id, ...doc.data() });
    });
    return res;
  } catch (e) {
    console.error('Error finding documents: ', e);
    throw e;
  }
}

export async function updateTxn(id, data) {
  try {
    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
    return { id, ...data };
  } catch (e) {
    console.error('Error updating document: ', e);
    throw e;
  }
}

export async function softDeleteTxn(id) {
  try {
    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, {
      is_deleted: true,
      deleted_at: serverTimestamp(),
    });
    return { id };
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw e;
  }
}
