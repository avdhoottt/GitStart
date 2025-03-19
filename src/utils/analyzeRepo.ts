import {
  generatePromptAnalysis,
  getImportantFilePaths,
} from "../services/aiService";
import { fetchLangStruct, getImportantFiles } from "../services/githubService";
import ExtractRepoInfo from "./ExtractRepoInfo";

export const analyzeRepo = async (
  repo: string,
  setRepoData: any,
  setAnalysis: any,
  navigate: any,
  setIsLoading: any
) => {
  setIsLoading(true);

  try {
    const { owner, repo: repoName } = ExtractRepoInfo(repo);

    const currentPath = window.location.pathname;
    const targetPath = `/${owner}/${repoName}`;
    const isAlreadyOnTargetPath = currentPath === targetPath;

    const repoInfo = await fetchLangStruct(owner, repoName);

    const importantFilePaths = await getImportantFilePaths(repoInfo);

    const importantFiles = await getImportantFiles(
      owner,
      repoName,
      importantFilePaths
    );
    setRepoData(importantFiles);

    const analysis = await generatePromptAnalysis(importantFiles);

    if (!analysis || analysis.length < 100) {
      console.error("⚠️ Analysis too short or empty, might indicate an error");

      const fallbackAnalysis = `# Repository Analysis\n\n## ${owner}/${repoName}\n\nThis repository contains ${
        importantFiles.length
      } important files including: ${importantFiles
        .slice(0, 3)
        .map((f) => f.name)
        .join(", ")}, etc.\n\nPlease check back later for a complete analysis.`;
      setAnalysis(fallbackAnalysis);
    } else {
      setAnalysis(analysis);
    }

    if (!isAlreadyOnTargetPath && navigate) {
      navigate(`/${owner}/${repoName}`);
    }

    setIsLoading(false);

    return true;
  } catch (error) {
    console.error("❌ Error during repository analysis:", error);
    setIsLoading(false);
    return false;
  }
};
