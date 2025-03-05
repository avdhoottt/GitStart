import { createContext, useContext } from "react";

interface RepoFile {
  name: string;
  path: string | undefined;
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

interface RepoContextType {
  repo: string;
  setRepo: (url: string) => void;
  repoData: RepoFile[] | null;
  resetClicked: boolean;
  setResetClicked: (value: boolean) => void;
  analysisHistory: HistoryContextType[] | null;
  setAnalysisHistory: (data: HistoryContextType[] | null) => void;
  setRepoData: (data: RepoFile[] | null) => void;
  analysis: string;
  setAnalysis: (analysis: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const RepoContext = createContext<RepoContextType>({
  repo: "",
  setRepo: () => {},
  repoData: null,
  analysisHistory: null,
  setAnalysisHistory: () => {},
  setRepoData: () => {},
  resetClicked: false,
  setResetClicked: () => {},
  analysis: "",
  setAnalysis: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
});

export const useRepo = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
};

export const RepoProvider = RepoContext.Provider;
