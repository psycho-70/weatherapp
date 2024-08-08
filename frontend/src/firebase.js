import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6KViYWAZe1sBqaRrCS8qVwzoXfvE2Q2w",
  authDomain: "first-try-a4dff.firebaseapp.com",
  projectId: "first-try-a4dff",
  storageBucket: "first-try-a4dff.appspot.com",
  messagingSenderId: "816921935684",
  appId: "1:816921935684:web:7782cef3e365a572532111",
  measurementId: "G-9L1J2JPX7K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signInWithProvider = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
    return user;
  } catch (error) {
    console.error("Error signing in with provider:", error);

    if (error.code === 'auth/cancelled-popup-request') {
      console.log("Popup was closed by the user before completing the sign-in.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log("User closed the popup.");
    } else {
      throw error; // Re-throw other errors after logging
    }
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { auth, googleProvider, githubProvider, signInWithProvider, signOutUser, db, doc, setDoc };
