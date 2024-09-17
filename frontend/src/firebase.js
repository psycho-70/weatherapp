import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};



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
