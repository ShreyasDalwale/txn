import { initializeApp } from 'firebase/app';
// import { firestore } from 'firebase';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  limit, orderBy,
  doc,
  getDoc,serverTimestamp
} from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
    txn = {...txn,is_deleted:false,created_at:serverTimestamp()}
    const docRef = await addDoc(collection(db, 'transactions'), txn);
    console.log('Document written with ID: ', docRef.id);
    return docRef
  } catch (e) {
    console.error('Error adding document: ', e);
    return false
  }
}

export async function findTxn(uid){
  const docRef = doc(db,'transactions',uid)
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

}
export async function findAllTxn(order_by='created_at',desc=true,limit_count=10){ 
  const q = query(
    collection(db, 'transactions'), 
    // where('id', '==', uid)
    orderBy(order_by,desc ? 'desc' : 'asc'),
    limit(limit_count),
    pageSize(limit_count)
  );
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  let res  = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ' => ', doc.data());
    res.push({id:doc.id,...doc.data()})
  });
  return res;
}
