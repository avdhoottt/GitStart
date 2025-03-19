import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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
let authBusy = false;

export const signInWithGithub = async () => {
  try {
    if (authBusy) {
      return null;
    }

    authBusy = true;
    const result = await signInWithPopup(auth, githubprovider);

    const credentials = GithubAuthProvider.credentialFromResult(result);
    const token = credentials?.accessToken;

    if (token) {
      localStorage.setItem("githubToken", token);
    }
    authBusy = false;
    return {
      user: result.user,
      token,
    };
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    authBusy = false;
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
  return localStorage.getItem("githubToken");
};

export const db = getFirestore(app);

export const handelSubscribe = async (email: string) => {
  try {
    await addDoc(collection(db, "subscribers"), {
      emailId: email,
      subsribeAt: new Date(),
      source: "Call to Action",
    });
  } catch (error) {
    console.error("Error adding subscribe data", error);
  }
};

export { auth };
