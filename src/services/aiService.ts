import { GoogleGenerativeAI } from "@google/generative-ai";

const api = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
const model = api.getGenerativeModel({
  model: "gemini-2.0-flash",
});

interface RepoStrcutureInput {
  languages: Record<string, number>;
  structure: Array<{
    name?: string;
    type?: string;
    path?: string;
    sha?: string;
    mode?: string;
    size?: number;
    url?: string;
  }>;
}

export const fetchAIResponse = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI response fetching failed", error);
  }
};

export const generatePromptExtensions = async (
  repoInfo: RepoStrcutureInput
): Promise<string[]> => {
  const languagesList = Object.keys(repoInfo.languages).join(", ");
  const fileList = repoInfo.structure
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .join("/n");

  const prompt = `Analyze this GitHub repository structure and its languages.
    Languages used: ${languagesList}

    File structure:
    ${fileList}

    Based on the languages used and file structure, provide an array of file extensions that would be important to understand for setting up this project and contributing to it. Remember, we are doing this because we don't want to fetch every file of the repo so try to give those extensions that are really important and those which contribute to setting up the repo. Like in a React project, we dont need all js, ts, jsx, and tsx files. we'll just need the .json, .md, .config.ts,.

    For example, if it's a JavaScript/TypeScript project, important extensions might include: ["json", "ts", "md", "env.example"].

    Respond ONLY with a JSON array of extensions without the dot prefix. For example:
        ["md", "json", "yml"]. make sure to just give the array in string format like normal text response, don't give it in a code block: "["md", "json", "js", "yml"]"`.trim();

  try {
    const response = await fetchAIResponse(prompt);

    const extensions = JSON.parse(response || "");
    if (Array.isArray(extensions)) {
      return extensions;
    }
    throw new Error("Invalid repsonse format");
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return [];
  }
};

export const generatePromptAnalysis = async (files: any[]) => {
  const prompt = `Analyze this GitHub repository files, go through them, analyze and try to provide detailed documentation focused on:

1. Project Setup Guide
   - Complete system requirements and prerequisites (exact versions)
   - Step-by-step installation instructions with all necessary commands (Incldue links to the things that needs to be installed wherever possible) Try to predict what the files indicate to install/set up.
   - Required environment variables and configuration files
   - Detailed troubleshooting for common setup errors

2. Contribution Guidelines
   - How to set up the development environment specifically for contributing

Include any project-specific conventions, scripts, or tools that facilitate setup and contribution. Format as clear documentation with proper code blocks for commands.

Repository data: ${JSON.stringify(files, null, 2)}

Please provide a detailed, well-structured response. Give in markdown format but don't include the markdown tag \`\`\`markdown`;

  const response = fetchAIResponse(prompt);
  return response;
};

export const fetchAI = async (prompt: string) => {
  const data = await model.generateContent(prompt);
  return data.response.text();
};
