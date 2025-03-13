import { useState } from "react";
import { RepoProvider } from "./context/useInput";
import AuthProvider from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnalysisDisplay from "./components/AnalysisDisplay";
import Dashboard from "./pages/Dashboard";
import { Analytics } from "@vercel/analytics/react";

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

function App() {
  const [repo, setRepo] = useState<string>("");
  const [repoData, setRepoData] = useState<RepoFile[] | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<
    HistoryContextType[] | null
  >(null);
  const [resetClicked, setResetClicked] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <AuthProvider>
        <RepoProvider
          value={{
            repo,
            setRepo,
            repoData,
            setRepoData,
            analysis,
            setAnalysis,
            resetClicked,
            setResetClicked,
            analysisHistory,
            setAnalysisHistory,
            isLoading,
            setIsLoading,
            error,
            setError,
          }}
        >
          <Analytics />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:owner/:repoName" element={<AnalysisDisplay />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </RepoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
