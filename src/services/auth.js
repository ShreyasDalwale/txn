import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from '../services/firebase/firebase';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUser(result.user);
    return result.user;
  } catch (err) {
    console.error('Error signing in:', err);
    throw err;
  }
};

export const logout = () => signOut(auth);

export const saveUser = async (user) => {
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving user:', err);
  }
};
