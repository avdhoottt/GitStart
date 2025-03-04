const ExtractRepoInfo = (url: string): { owner: string; repo: string } => {
  const repoUrl = new URL(url);
  const pathSegments = repoUrl.pathname.split("/").filter(Boolean);

  if (pathSegments.length < 2) {
    throw new Error("Repo is not valid");
  }
  return {
    owner: pathSegments[0],
    repo: pathSegments[1],
  };
};

export default ExtractRepoInfo;
