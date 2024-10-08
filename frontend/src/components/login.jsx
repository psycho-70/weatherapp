import { useState, useContext, useEffect } from "react";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import { AppContext } from "../appContext"; // Update the path accordingly
import { signInWithProvider,googleProvider,githubProvider,auth,} from "../firebase";
import { onAuthStateChanged,createUserWithEmailAndPassword  } from "firebase/auth";

const Page = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { darkMode, setDarkMode } = useContext(AppContext);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignIn = async (provider) => {
    setLoading(true);
    try {
      await signInWithProvider(provider);
      // Redirect or handle success after sign-in if necessary
    } catch (error) {
      console.error("Sign-in error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully:", userCredential.user);
        
        // Reset the form fields
        setEmail('');
        setPassword('');
        
        // Optionally, you can update the user's profile with name and lastName
        // Redirect or perform other actions after sign-up
    
    } catch (error) {
        console.error("Sign-up error:", error.message);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
      <h1 className="text-center text-2xl font-bold p-3">Sign up</h1>
      <div className="md:flex min-h-screen justify-center gap-6 flex-wrap">
        <div className="w-full md:w-[40%]">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl mt-3 p-5 bg-slate-600 rounded-md text-center font-bold">
              Welcome to <span className="text-red-500 font-bold">Weather App</span>
            </h1>
            <p className="text-lg text-center">
              Welcome to the Weather App! This app provides accurate and up-to-date weather information for cities around the world. With features such as hourly forecasts, air quality data, and real-time weather updates, you'll always be prepared for whatever the weather brings.
            </p>

            <h1 className="text-2xl p-5 mt-4 bg-slate-600 rounded-md text-center font-bold">
              Sign up for <span className="text-red-500 font-bold">Your Account</span>
            </h1>
            <p className="text-lg text-center">
              To continue your journey with us, please sign up for your account below.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => handleSignIn(githubProvider)}
              disabled={loading} // Disable the button while loading
              className="w-80 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
            >
              <div className="bg-white p-2 rounded-full">
              <FaGithub />

              </div>
              <span className="ml-4">Sign Up with GitHub</span>
            </button>

            <button
              onClick={() => handleSignIn(googleProvider)}
              disabled={loading} // Disable the button while loading
              className="w-80 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
            >
              <div className="bg-white p-1 rounded-full">
              <FaGoogle />


              </div>
              <span className="ml-4">Sign Up with Google</span>
            </button>
          </div>

          <form className=" flex flex-col" onSubmit={handleSubmit}>
            <div className="m-3 border-b text-center">
              <div className="text-2xl font-bold">Create Your Account</div>
            </div>
            <div className="flex flex-wrap gap-4 md:m-5">
             
            </div>
            <input
              className={`px-8 py-4 rounded-lg font-medium ${darkMode ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "bg-gray-600 border-gray-200 placeholder-white"} text-sm focus:outline-none focus:border-gray-400`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={`px-8 py-4 rounded-lg font-medium ${darkMode ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "bg-gray-600 border-gray-200 placeholder-white"} text-sm focus:outline-none focus:border-gray-400 mt-5`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className={`my-5 tracking-wide font-semibold ${darkMode ? "bg-indigo-700 text-gray-100" : "bg-indigo-500 text-gray-100"} py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
            >
              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">{loading ? "Signing Up..." : "Sign Up"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
