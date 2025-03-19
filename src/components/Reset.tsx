import { useParams } from "react-router-dom";
import { useRepo } from "../context/useInput";
import {
  generatePromptAnalysis,
  getImportantFilePaths,
} from "../services/aiService";
import { fetchLangStruct, getImportantFiles } from "../services/githubService";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Reset = ({
  className = "",
  label = "Reset",
  setParentLoading,
  parentLoading,
}: {
  className?: string;
  label?: string;
  setParentLoading: (loading: boolean) => void;
  parentLoading: boolean;
}) => {
  const { setRepoData, setAnalysis, setIsLoading, setResetClicked } = useRepo();

  const [isResetLoading] = useState(false);
  const { owner, repoName } = useParams();
  const { currentUser } = useAuth();

  const handleReset = async () => {
    setResetClicked(true);

    if (!owner || !repoName || isResetLoading) {
      return;
    }

    setIsLoading(true);
    if (setParentLoading) setParentLoading(true);

    setRepoData([]);
    setAnalysis("");

    try {
      const repoInfo = await fetchLangStruct(owner, repoName);

      const importantFilePaths = await getImportantFilePaths(repoInfo);

      const importantFiles = await getImportantFiles(
        owner,
        repoName,
        importantFilePaths
      );
      setRepoData(importantFiles);

      const analysis = await generatePromptAnalysis(importantFiles);
      setAnalysis(analysis || "");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        if (setParentLoading) setParentLoading(false);
      }, 300);
    }
  };

  return (
    <div className="relative">
      {parentLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="text-center text-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Re-Analyzing repository...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      )}

      <button
        className={`${className}`}
        onClick={handleReset}
        disabled={isResetLoading || parentLoading}
      >
        {isResetLoading || parentLoading ? "Re-analyzing..." : label}
      </button>

      {!currentUser && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-900/80 text-white px-4 py-2 rounded text-sm whitespace-nowrap z-10">
          Please login first
        </div>
      )}
    </div>
  );
};

export default Reset;
