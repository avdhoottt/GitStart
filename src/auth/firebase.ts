import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const githubprovider = new GithubAuthProvider();
githubprovider.addScope("repo");
githubprovider.addScope("read:user");

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubprovider);

    const credentials = GithubAuthProvider.credentialFromResult(result);
    const token = credentials?.accessToken;

    if (token) {
      localStorage.setItem("token", token);
    }
    return {
      user: result.user,
      token,
    };
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("githubToken");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getGithubToken = () => {
  return localStorage.getItem("token");
};

export const db = getFirestore(app);

export { auth };
