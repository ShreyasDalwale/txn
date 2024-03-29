import { initializeApp } from 'firebase/app';
// import { firestore } from 'firebase';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyC1tB8sJYOLeq3FadH9pJXd4m8cHyxQ_PM',
  authDomain: 'wally-ph1fio.firebaseapp.com',
  projectId: 'wally-ph1fio',
  storageBucket: 'wally-ph1fio.appspot.com',
  messagingSenderId: '946676094026',
  appId: '1:946676094026:web:0cfceaff9df091a59c02b3',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export async function getCities() {
  const citiesCol = collection(db, 'transactions');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(citySnapshot);
  return cityList;
}

export async function addTxn(txn) {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), txn);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function findTxn(uid) {
  const q = query(collection(db, 'transactions'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
}
