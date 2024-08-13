import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6KViYWAZe1sBqaRrCS8qVwzoXfvE2Q2w",
  authDomain: "first-try-a4dff.firebaseapp.com",
  projectId: "first-try-a4dff",
  storageBucket: "first-try-a4dff.appspot.com",
  messagingSenderId: "816921935684",
  appId: "1:816921935684:web:7782cef3e365a572532111",
  measurementId: "G-9L1J2JPX7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

const db = getFirestore(app);

// Set up providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithProvider = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info
    const user = result.user;
    console.log('User signed in: ', user);
    return user;
  } catch (error) {
    console.error('Error during sign-in:', error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error during sign-out:', error.message);
  }
};

export { auth, googleProvider, githubProvider, db, collection, addDoc, getDocs, deleteDoc, doc, query, where };
