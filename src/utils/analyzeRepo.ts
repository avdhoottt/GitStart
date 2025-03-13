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

    const repoInfo = await fetchLangStruct(owner, repoName);
    const importantFilePaths = await getImportantFilePaths(repoInfo);
    console.log("Important files:", importantFilePaths);

    const importantFiles = await getImportantFiles(
      owner,
      repoName,
      importantFilePaths
    );
    setRepoData(importantFiles);

    const analysis = await generatePromptAnalysis(importantFiles);
    setAnalysis(analysis || "");

    navigate(`/${owner}/${repoName}`);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  } catch (error) {
    setIsLoading(false);
    console.error("There's no data", error);
  }
};
