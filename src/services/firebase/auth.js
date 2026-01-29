// auth.js
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log(result.user);
    return result.user;
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => signOut(auth);


import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveUser = async (user) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
};
