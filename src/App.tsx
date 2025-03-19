import { useState, useEffect } from "react";
import { RepoProvider } from "./context/useInput";
import AuthProvider from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

function RouteChangeHandler({
  setInputBtnClicked,
}: {
  setInputBtnClicked: (value: boolean) => void;
}) {
  const location = useLocation();

  useEffect(() => {
    setInputBtnClicked(false);
  }, [location.pathname, setInputBtnClicked]);

  return null;
}

function App() {
  const [repo, setRepo] = useState<string>("");
  const [repoData, setRepoData] = useState<RepoFile[] | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<
    HistoryContextType[] | null
  >(null);
  const [resetClicked, setResetClicked] = useState<boolean>(false);
  const [inputBtnClicked, setInputBtnClicked] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (inputBtnClicked) {
      timeoutId = setTimeout(() => {
        setInputBtnClicked(false);
      }, 30000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [inputBtnClicked]);

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
            inputBtnClicked,
            setInputBtnClicked,
            analysisHistory,
            setAnalysisHistory,
            isLoading,
            setIsLoading,
            error,
            setError,
          }}
        >
          <RouteChangeHandler setInputBtnClicked={setInputBtnClicked} />

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
