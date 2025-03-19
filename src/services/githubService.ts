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

    return {
      languages,
      structure: treeData.tree,
    };
  } catch (error) {
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
    console.error(`File not decoded: ${path}`, error);
    return null;
  }
};

export const getImportantFiles = async (
  owner: string,
  repo: string,
  filePaths: string[]
): Promise<RepoFile[]> => {
  try {
    const filePromises = filePaths.map(async (path) => {
      try {
        const content = await getFileContent(owner, repo, path);
        return {
          name: path.split("/").pop() || "",
          path: path,
          type: "file",
          content: content || undefined,
          status: content ? "success" : "empty",
        };
      } catch (error) {
        console.error(`Error fetching file: ${path}`, error);
        return {
          name: path.split("/").pop() || "",
          path: path,
          type: "file",
          content: `// File not found: ${path}`,
          status: "error",
        };
      }
    });

    const files = await Promise.all(filePromises);

    const validFiles = files.filter((file) => file.content !== undefined);

    if (validFiles.length === 0) {
      console.warn(
        "No valid files were found. Trying to fetch fallback files..."
      );
      const fallbackFiles = [
        "README.md",
        "package.json",
        "setup.py",
        "requirements.txt",
        "Makefile",
        "CMakeLists.txt",
        "BUILD",
        "WORKSPACE",
        "Dockerfile",
        ".github/workflows/main.yml",
      ];

      for (const fallbackPath of fallbackFiles) {
        try {
          const content = await getFileContent(owner, repo, fallbackPath);
          if (content) {
            validFiles.push({
              name: fallbackPath.split("/").pop() || "",
              path: fallbackPath,
              type: "file",
              content: content,
              status: "fallback",
            });
          }
        } catch (error) {
          continue;
        }
      }
    }

    return validFiles;
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

// Fetch issues
// export const fetchIssues = async (owner: string, repo: string) => {
//   try {
//     const issues = await octokit.request(
//       "GET  / repos / { owner } / { repo } / issues",
//       {
//         owner,
//         repo,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     return issues;
//   } catch (error) {
//     console.log(error);
//   }
// };
