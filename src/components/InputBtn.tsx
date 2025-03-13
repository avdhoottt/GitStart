import { useEffect, useState } from "react";
import { useRepo } from "../context/useInput";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { analyzeRepo } from "../utils/analyzeRepo";

const InputBtn = ({ className = "", label = "Analyze" }) => {
  const {
    repo,
    setRepoData,
    setAnalysis,
    isLoading,
    setIsLoading,
    setResetClicked,
  } = useRepo();
  const { currentUser } = useAuth();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: any;
    if (showLoginMessage) {
      timer = setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showLoginMessage]);

  const handleAnalyse = async () => {
    if (!currentUser) {
      setShowLoginMessage(true);
      return;
    }
    if (!repo || isLoading) return;
    setResetClicked(false);

    analyzeRepo(repo, setRepoData, setAnalysis, navigate, setIsLoading);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="text-center text-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing repository...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      )}

      <button
        className={`${className}`}
        onClick={handleAnalyse}
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : label}
      </button>

      {showLoginMessage && !currentUser && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-900/80 text-white px-4 py-2 rounded text-sm whitespace-nowrap z-10">
          Please login first
        </div>
      )}
    </div>
  );
};

export default InputBtn;
