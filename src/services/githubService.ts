import { Octokit } from "octokit";
import { getGithubToken } from "../auth/firebase";

const getOctokit = () => {
  const token = getGithubToken();

  return new Octokit({
    auth: token || import.meta.env.VITE_GITHUB_TOKEN,
  });
};

interface RepoFile {
  name: string;
  path: string | undefined;
  type: string;
  content?: string;
}

const octokit = getOctokit();

export const fetchLangStruct = async (owner: string, repo: string) => {
  try {
    const { data: languages } = await octokit.request(
      "GET /repos/{owner}/{repo}/languages",
      {
        owner,
        repo,
      }
    );

    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const defBranch = repoData.default_branch;

    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defBranch}`,
    });

    const commitSha = refData.object.sha;

    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: commitSha,
      recursive: "true",
    });
    //   console.log(languages, treeData.tree);
    return {
      languages,
      structure: treeData.tree,
    };
  } catch (error) {
    console.log("Error fetching repo info", error);
    return {
      languages: {},
      structure: [],
    };
  }
};

export const getFileContent = async (
  owner: string,
  repo: string,
  path: string
): Promise<string | null> => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    if ("content" in data) {
      return atob(data.content);
    }
    return null;
  } catch (error) {
    console.error("File not decoded", error);
    return null;
  }
};

export const getImportantFiles = async (
  owner: string,
  repo: string,
  extensions: string[]
): Promise<RepoFile[]> => {
  try {
    // Get repo structure first
    const { structure } = await fetchLangStruct(owner, repo);

    // Create extension regex pattern
    const extensionPattern = extensions.join("|").replace(/\./g, "\\.");
    const extensionRegex = new RegExp(`\\.(${extensionPattern})$`, "i");

    // Process files in parallel with Promise.all for better performance
    const filePromises = structure
      .filter(
        (item: any) => item.type === "blob" && extensionRegex.test(item.path)
      )
      .map(async (item) => {
        const content = await getFileContent(owner, repo, item.path || "");
        return {
          name: item.path?.split("/").pop() || "",
          path: item.path,
          type: "file",
          content: content || undefined,
        };
      });

    return await Promise.all(filePromises);
  } catch (error) {
    console.error("Error fetching important files:", error);
    return [];
  }
};

export const getUserProfile = async () => {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Get user's repositories
export const getUserRepos = async (perPage = 10, page = 1) => {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc",
    });
    return data;
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    throw error;
  }
};
