import React, { useEffect, useState } from "react";
import { useRepo } from "../context/useInput";
import ExtractRepoInfo from "../utils/ExtractRepoInfo";
import { fetchLangStruct, getImportantFiles } from "../services/githubService";
import {
  generatePromptAnalysis,
  generatePromptExtensions,
} from "../services/aiService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const InputBtn = ({ className = "", label = "Analyze" }) => {
  const { repo, repoData, setRepoData, setAnalysis, isLoading, setIsLoading } =
    useRepo();
  const { currentUser } = useAuth();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
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
    setIsLoading(true);

    try {
      const { owner, repo: repoName } = ExtractRepoInfo(repo);
      navigate(`/${owner}/${repoName}`);
      const repoInfo = await fetchLangStruct(owner, repoName);
      const extensions = await generatePromptExtensions(repoInfo);
      console.log(extensions);
      const Importantfiles = await getImportantFiles(
        owner,
        repoName,
        extensions
      );
      console.log(Importantfiles);
      setRepoData(Importantfiles);
      const analysis = await generatePromptAnalysis(Importantfiles);
      setAnalysis(analysis);
      console.log(analysis);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error("There's not data");
    }
  };

  return (
    <div className="relative">
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
