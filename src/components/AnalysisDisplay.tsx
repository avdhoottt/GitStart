import { useEffect } from "react";
import { useRepo } from "../context/useInput";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AnalysisDisplay = () => {
  const {
    repoData,
    analysis,
    isLoading,
    setAnalysis,
    setIsLoading,
    error,
    setError,
  } = useRepo();
  const { currentUser } = useAuth();
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const loadAnalysisData = async () => {
      if (!owner || !repoName || !currentUser) return;
      if (analysis && repoData) return;

      setIsLoading(true);

      try {
        const historyRef = collection(db, "analysisHistory");
        const q = query(
          historyRef,
          where("userId", "==", currentUser.uid),
          where("owner", "==", owner),
          where("repoName", "==", repoName)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const historyItem = querySnapshot.docs[0].data();
          if (historyItem.analysisContent) {
            console.log("Loaded analysis from history");
            setAnalysis(historyItem.analysisContent);
            setIsLoading(false);
            return;
          }
        }
        navigate("/");
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading analysis data:", error);
        setError("Failed to load repository analysis. Please try again.");
        setIsLoading(false);
      }
    };

    loadAnalysisData();
  }, [owner, repoName, currentUser, analysis, repoData]);

  useEffect(() => {
    const saveToHistory = async () => {
      if (!currentUser || !owner || !repoName || !analysis || isLoading) return;

      try {
        const historyRef = collection(db, "analysisHistory");
        const q = query(
          historyRef,
          where("userId", "==", currentUser.uid),
          where("owner", "==", owner),
          where("repoName", "==", repoName)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(collection(db, "analysisHistory"), {
            userId: currentUser.uid,
            repoName: repoName,
            owner: owner,
            createdAt: new Date(),
            analysisContent: analysis,
          });
        }
      } catch (error) {
        console.error("Error saving to history:", error);
      }
    };

    saveToHistory();
  }, [currentUser, owner, repoName, analysis, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing repository...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white bg-red-900/20 p-8 rounded-lg border border-red-800/50 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white bg-gray-900/60 p-8 rounded-lg border border-gray-800/60 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">No Analysis Available</h2>
            <p className="text-gray-300">
              There is no analysis data for this repository
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Sidebar />

      <main className="p-4 pt-6 lg:p-8 lg:ml-72 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
              <a href="/" className="hover:text-purple-400 transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-white">
                {owner}/{repoName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 mt-4">
              Repository Analysis
            </h1>
            <div className="flex items-center text-gray-400 text-sm">
              <span className="bg-purple-900/40 text-purple-400 px-2 py-1 rounded mr-2 border border-purple-800/50">
                {owner}/{repoName}
              </span>
              <span className="text-gray-500">
                Analyzed {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800/50 overflow-hidden">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-800/50">
              <h2 className="text-lg font-medium text-white">
                Analysis Results
              </h2>
            </div>

            <div className="p-6 markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="my-4 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between items-center">
                          <span>{match[1]}</span>
                          <button
                            className="hover:text-white transition-colors text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                String(children).replace(/\n$/, "")
                              );
                            }}
                          >
                            Copy
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={nightOwl}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: 0 }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-300"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-300 leading-relaxed">
                      {children}
                    </p>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-8 mb-4 text-white border-b border-gray-800 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-6 mb-4 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mt-5 mb-3 text-white">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-6 rounded-lg border border-gray-800">
                      <table className="min-w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-800 text-white">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left border-b border-gray-700 font-medium text-sm">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 border-b border-gray-800 text-sm">
                      {children}
                    </td>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-4 border-l-4 border-purple-700 bg-gray-800/30 py-2 px-3 rounded-r-lg my-4 text-gray-400 italic">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-6 border-gray-800" />,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>

          <div className="mt-8 mb-12 text-center text-sm text-gray-500">
            Analyzed with GitStart {new Date().getFullYear()} •
            <button
              onClick={() => navigate("/")}
              className="ml-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Analyze another repository
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisDisplay;
