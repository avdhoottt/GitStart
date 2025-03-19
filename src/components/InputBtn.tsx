import { useEffect, useState } from "react";
import { useRepo } from "../context/useInput";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { analyzeRepo } from "../utils/analyzeRepo";
import { motion } from "framer-motion";

const InputBtn = ({ className = "", label = "Analyze" }) => {
  const {
    repo,
    setRepoData,
    setAnalysis,
    isLoading,
    setIsLoading,
    setResetClicked,
    inputBtnClicked,
    setInputBtnClicked,
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
    if (isLoading) return;
    if (!repo) return;

    if (!currentUser) {
      setShowLoginMessage(true);
      return;
    }
    const safetyTimeout = setTimeout(() => {
      setInputBtnClicked(false);
    }, 60000);

    try {
      setResetClicked(false);
      setInputBtnClicked(true);

      await analyzeRepo(repo, setRepoData, setAnalysis, navigate, setIsLoading);
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      clearTimeout(safetyTimeout);
      setInputBtnClicked(false);
    }
  };

  return (
    <div className="relative group">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      ></motion.div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="text-center p-8 rounded-lg relative">
            <div className="absolute inset-0 bg-white/5 rounded-lg border border-white/10 blur-md"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <svg
                  className="animate-spin h-10 w-10 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="w-2"></div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-sm opacity-80"
                ></motion.div>
              </div>
              <p className="text-xl font-medium tracking-tight text-white">
                Analyzing repository...
              </p>
              <p className="text-sm text-white/60 mt-3">
                This may take a moment
              </p>

              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: "5%" }}
                  animate={{ width: ["5%", "95%"] }}
                  transition={{ duration: 8, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className={`${className} relative z-10 w-full font-medium transition-all duration-300 px-6 py-3 border-white/10 backdrop-blur-md flex items-center justify-center gap-2 hover:border-white/20`}
        onClick={handleAnalyse}
        disabled={isLoading || inputBtnClicked}
      >
        {isLoading
          ? "Analyzing..."
          : inputBtnClicked
          ? "Starting analysis..."
          : label}
        {!isLoading && !inputBtnClicked && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L20 12L12 20M4 12L20 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {showLoginMessage && !currentUser && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white/5 text-red-400 border border-red-500/20 px-4 py-2 rounded-md text-sm whitespace-nowrap z-10 backdrop-blur-md">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/5 rotate-45 border-t border-l border-red-500/20"></div>
          Please login first
        </div>
      )}
    </div>
  );
};

export default InputBtn;
