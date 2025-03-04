import {
  Children,
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "firebase/auth";
import { auth, getGithubToken } from "../auth/firebase";

interface AuthContextType {
  currentUser: User | null;
  isLoginLoading: boolean;
  githubToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoginLoading: false,
  githubToken: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a UseAuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginLoading, setIsLoginLoding] = useState(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setGithubToken(getGithubToken);
      setIsLoginLoding(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isLoginLoading,
    githubToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
