// context/useInput.ts
import { createContext, useContext } from "react";

// Define types for repository files
interface RepoFile {
  name: string;
  path: string;
  type: string;
  content?: string;
}

interface HistoryContextType {
  id: string;
  repoName: string;
  owner: string;
  date: string;
  isActive: boolean;
}

// Define the shape of your context
interface RepoContextType {
  repo: string;
  setRepo: (url: string) => void;
  repoData: RepoFile[] | null;
  analysisHistory: HistoryContextType[] | null;
  setAnalysisHistory: (data: HistoryContextType[] | null) => void;
  setRepoData: (data: RepoFile[] | null) => void;
  analysis: string;
  setAnalysis: (analysis: RepoFile[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// Create context with default values
export const RepoContext = createContext<RepoContextType>({
  repo: "",
  setRepo: () => {},
  repoData: null,
  analysisHistory: null,
  setAnalysisHistory: () => {},
  setRepoData: () => {},
  analysis: "",
  setAnalysis: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
});

// Create custom hook for using the context
export const useRepo = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
};

// Export the Provider for wrapping the app
export const RepoProvider = RepoContext.Provider;
