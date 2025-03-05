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

export const getImportantFilePaths = async (
  repoInfo: RepoStrcutureInput
): Promise<string[]> => {
  const availableFiles = repoInfo.structure
    .filter((item) => item.type === "blob" && item.path)
    .map((item) => item.path) as string[];

  const languagesList = Object.keys(repoInfo.languages).join(", ");

  const totalFiles = availableFiles.length;
  const sampleFiles = availableFiles.slice(0, 20).join("\n");

  const prompt = `Analyze this GitHub repository structure and its languages.
    Languages used: ${languagesList}

    This repository has ${totalFiles} files. Here are some sample files to understand the structure:
    ${sampleFiles}

    Based on the languages used and file structure, provide the paths of up to 15 MOST IMPORTANT files that would give enough information to set up this repository locally and start contributing to it.

    Focus on:
    1. Configuration files (package.json, tsconfig.json, .env.example, etc.)
    2. Setup instructions (README.md, CONTRIBUTING.md)
    3. Build scripts and dependency information
    4. Core architecture files that explain the project structure

    IMPORTANT:
    - Respond with ONLY a JSON array of file paths WITHOUT any markdown formatting or explanation
    - ONLY include files that are likely to exist - common files like README.md, CONTRIBUTING.md, package.json
    - VERIFY your paths match the repository structure
    - DO NOT include paths that contain directories like "ci/official/containers/" unless you're very confident they exist
    - The response should be EXACTLY in this format: ["file1.md", "file2.json", "path/to/file3.js"]`.trim();

  try {
    const response = await fetchAIResponse(prompt);
    if (!response) {
      throw new Error("Empty response from AI");
    }

    let cleanedResponse = response;
    if (response.includes("```")) {
      const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        cleanedResponse = match[1].trim();
      }
    }

    const filePaths = JSON.parse(cleanedResponse);

    if (Array.isArray(filePaths)) {
      const validatedPaths = filePaths.filter((path) => {
        if (availableFiles.includes(path)) {
          return true;
        }

        const lowerPath = path.toLowerCase();
        return availableFiles.some((file) => file.toLowerCase() === lowerPath);
      });

      const essentialFiles = [
        "README.md",
        "CONTRIBUTING.md",
        "LICENSE",
        "package.json",
        "setup.py",
      ];
      for (const file of essentialFiles) {
        const exactMatch = availableFiles.find((f) => f === file);
        const caseInsensitiveMatch = availableFiles.find(
          (f) => f.toLowerCase() === file.toLowerCase()
        );

        const matchedFile = exactMatch || caseInsensitiveMatch;
        if (matchedFile && !validatedPaths.includes(matchedFile)) {
          validatedPaths.push(matchedFile);
        }
      }

      console.log(
        `AI suggested ${filePaths.length} files, ${validatedPaths.length} were validated to exist`
      );
      return validatedPaths.slice(0, 15);
    }

    throw new Error("Response is not an array");
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return [
      "README.md",
      "LICENSE",
      "CONTRIBUTING.md",
      "package.json",
      "setup.py",
      "requirements.txt",
      "Makefile",
      "CMakeLists.txt",
      "WORKSPACE",
      "BUILD",
    ];
  }
};

export const generatePromptAnalysis = async (files: any[]) => {
  const fileContents = files.map((file) => ({
    name: file.name,
    path: file.path,
    content: file.content?.slice(0, 5000) || "Empty file",
    status: file.status || "success",
  }));

  const prompt = `Analyze these GitHub repository files and provide detailed documentation focused on:

  First write in detail:
  - What the repository is about
  - Where is it used
  - Which people use it and where it has been used
  - How the project can help

1. Project Setup Guide(Try to make the steps sound simple and present them in a easier way that anyone could understand)
   - Complete system requirements and prerequisites (exact versions)
   - Step-by-step installation instructions with all necessary commands (Include links to the things that needs to be installed wherever possible)
   - Required environment variables and configuration files
   - Detailed troubleshooting for common setup errors

2. Contribution Guidelines
   - How to set up the development environment specifically for contributing

Include any project-specific conventions, scripts, or tools that facilitate setup and contribution. Format as clear documentation with proper code blocks for commands.

Repository files: ${JSON.stringify(fileContents, null, 2)}

Note that some files might be listed as missing or not found due to API limitations. Please focus on the files you do have access to.

Please provide a detailed, well-structured response in markdown format but dont incldue the \`\`\`markdown tag in the response. Act like you are an expert software developer trying to help others so don't add any lines like based on the files or here are the results or Based on the provided files or anything like that, just give them what they need and don't say any lines like a chatbot.`;

  const response = fetchAIResponse(prompt);
  return response;
};

export const fetchAI = async (prompt: string) => {
  const data = await model.generateContent(prompt);
  return data.response.text();
};
