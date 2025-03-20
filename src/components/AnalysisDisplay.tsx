import { useEffect, useState } from "react";
import { useRepo } from "../context/useInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Reset from "./Reset";
import { analyzeRepo } from "../utils/analyzeRepo";
import { signInWithGithub } from "../auth/firebase";
import { ArrowLeft, Calendar, Code, GitFork } from "lucide-react";

const AnalysisDisplay = () => {
  const {
    setRepo,
    repoData,
    setRepoData,
    analysis,
    isLoading,
    setAnalysis,
    setIsLoading,
    error,
    setError,
    resetClicked,
    inputBtnClicked,
    setInputBtnClicked,
  } = useRepo();
  const [localIsLoading, setLocalIsLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [autoAnalysisDone, setAutoAnalysisDone] = useState(false);
  const { currentUser } = useAuth();
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const [navbarHeight, setNavbarHeight] = useState(64);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, []);
  useEffect(() => {
    if (isLoading) {
      setLocalIsLoading(true);
    } else {
      setLocalIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (analysis) {
      setLocalIsLoading(false);
    }
  }, [analysis]);

  const handleAuthentication = async () => {
    setAuthInProgress(true);
    try {
      const res = await signInWithGithub();
      if (!res) {
        setAuthInProgress(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error in Authentication when user is absent ${error}`);
      setLocalIsLoading(false);
      setAuthInProgress(false);
      return false;
    }
  };

  useEffect(() => {
    const initialAuthNeeded = async () => {
      if (!currentUser && !authInProgress) {
        await handleAuthentication();
      }
    };
    initialAuthNeeded();
  }, [currentUser, authInProgress]);

  useEffect(() => {
    let isMounted = true;

    const loadAnalysisData = async () => {
      if (isLoading) {
        return;
      }

      if (!owner || !repoName) {
        if (isMounted) {
          setLocalIsLoading(false);
        }
        return;
      }

      if (resetClicked) {
        return;
      }

      if (analysis) {
        if (isMounted) {
          setLocalIsLoading(false);
        }
        return;
      }

      if (autoAnalysisDone) {
        if (isMounted) {
          setLocalIsLoading(false);

          setIsLoading(false);
        }
        return;
      }

      try {
        if (currentUser) {
          setAutoAnalysisDone(true);

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
              if (isMounted) {
                setAnalysis(historyItem.analysisContent);
                setLocalIsLoading(false);
                setIsLoading(false);
              }
              return;
            }
          }

          try {
            if (isMounted) {
              setIsLoading(true);
              setLocalIsLoading(true);
            }
            const repo = `https://github.com/${owner}/${repoName}`;
            if (isMounted) setRepo(repo);

            await analyzeRepo(
              repo,
              (data: any) => {
                if (isMounted) setRepoData(data);
              },
              setAnalysis,
              null,
              setIsLoading
            );

            if (isMounted) {
              setLocalIsLoading(false);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Analysis error:", error);
            if (isMounted) {
              setLocalIsLoading(false);
              setIsLoading(false);
            }
          }
        } else {
          console.error("No user logged in, can't perform analysis");
        }

        if (isMounted) {
          setLocalIsLoading(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading analysis data:", error);
        if (isMounted) {
          setError("Failed to load repository analysis. Please try again.");
          setLocalIsLoading(false);
          setIsLoading(false);
        }
      }
    };

    loadAnalysisData();

    return () => {
      isMounted = false;
      if (inputBtnClicked) {
        setInputBtnClicked(false);
      }
    };
  }, [
    owner,
    repoName,
    currentUser,
    analysis,
    repoData,
    resetClicked,
    inputBtnClicked,
    setRepo,
    setRepoData,
    setAnalysis,
    setIsLoading,
    setInputBtnClicked,
    isLoading,
  ]);

  useEffect(() => {
    const saveToHistory = async () => {
      // Skip if conditions aren't met
      if (!currentUser || !owner || !repoName || !analysis || localIsLoading) {
        return;
      }

      try {
        // Create a deterministic document ID based on user and repo
        // This ensures only one document can exist for this user+repo combination
        const docId = `${currentUser.uid}_${owner}_${repoName}`.replace(
          /[/\s.#$[\]]/g,
          "_"
        );

        // Reference to the specific document
        const docRef = doc(db, "analysisHistory", docId);

        // Check if document already exists
        const docSnap = await getDoc(docRef);

        // Only create/update if document doesn't exist
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            useEmail: currentUser.email,
            userId: currentUser.uid,
            repoName: repoName,
            owner: owner,
            createdAt: serverTimestamp(),
            analysisContent: analysis,
            // Adding a timestamp for when record was created
            updatedAt: serverTimestamp(),
          });
          console.log(
            `Saved analysis for ${owner}/${repoName} with ID: ${docId}`
          );
        } else {
          console.log(
            `Analysis for ${owner}/${repoName} already exists, skipping save`
          );
        }
      } catch (error) {
        console.error("Error saving to history:", error);
      }
    };

    // Only attempt to save when we have complete data
    if (analysis && !localIsLoading && currentUser) {
      saveToHistory();
    }
  }, [currentUser, owner, repoName, analysis, localIsLoading, db]);

  // Render loading state
  if (localIsLoading || isLoading) {
    // Always check both loading states to prevent flashing
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center"
          style={{ paddingTop: navbarHeight }}
        >
          <div className="text-center relative">
            <div className="w-16 h-16 relative mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-purple-500 animate-spin-slow"></div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl font-medium text-white tracking-tight">
                Analyzing repository...
              </p>
              <p className="text-sm text-white/60 mt-2">
                This may take a moment
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center p-4"
          style={{ paddingTop: navbarHeight }}
        >
          <motion.div
            className="text-center p-8 rounded-lg border border-white/10 max-w-md bg-black/30 backdrop-blur-sm relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg blur-md"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white tracking-tight">
                Error Occurred
              </h2>
              <p className="text-white/70 mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center bg-black px-4 py-2 rounded-lg text-red-400 hover:text-red-300 border border-red-500/20 transition-colors text-sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div
          className="flex-1 flex items-center justify-center p-4"
          style={{ paddingTop: navbarHeight }}
        >
          <motion.div
            className="text-center p-8 rounded-lg border border-white/10 max-w-md bg-black/30 backdrop-blur-sm relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg blur-md"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <GitFork size={28} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-white tracking-tight">
                No Analysis Available
              </h2>
              <p className="text-white/70 mb-6">
                There is no analysis data for this repository
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center bg-black px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-colors text-sm"
              >
                <Code size={16} className="mr-2" />
                Start New Analysis
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />

      <main
        className="pt-8 pb-16 px-6 lg:px-8 lg:ml-64 transition-all duration-300"
        style={{ paddingTop: `${navbarHeight + 32}px` }}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-white/50 text-sm mb-3">
              <a
                href="/"
                className="hover:text-blue-400 transition-colors inline-flex items-center"
              >
                <ArrowLeft size={14} className="mr-1" />
                Home
              </a>
              <span>/</span>
              <a
                href={`https://github.com/${owner}/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {owner}/{repoName}
              </a>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  Repository Analysis
                </h1>
                <div className="flex items-center text-white/50 text-sm gap-3">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden bg-black/30 backdrop-blur-sm relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-lg opacity-70 blur-xl"></div>

            <div className="relative">
              <div className="px-6 py-3 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white tracking-tight flex items-center">
                  <Code size={18} className="mr-2 text-blue-400" />
                  Analysis Results
                </h2>
                <div className="flex items-center space-x-2 text-white/50"></div>
              </div>

              <div className="p-6 markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="my-6 rounded-md overflow-hidden border border-white/10 relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                          <div className="relative">
                            <div className="bg-white/5 px-4 py-2 text-xs text-white/60 flex justify-between items-center">
                              <span className="flex items-center">
                                <Code
                                  size={14}
                                  className="mr-1.5 text-blue-400"
                                />
                                {match[1]}
                              </span>
                              <motion.button
                                className="hover:text-blue-400 transition-colors text-xs flex items-center opacity-0 group-hover:opacity-100"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    String(children).replace(/\n$/, "")
                                  );
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg
                                  className="w-3.5 h-3.5 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  ></path>
                                </svg>
                                Copy
                              </motion.button>
                            </div>
                            <pre className="bg-black p-4 overflow-x-auto">
                              <code className="font-mono text-sm text-white/80">
                                {String(children).replace(/\n$/, "")}
                              </code>
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <code className="bg-white/5 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300">
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-4 text-white/80 leading-relaxed text-[15px]">
                        {children}
                      </p>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-8 mb-4 text-white tracking-tight">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mt-6 mb-4 text-white tracking-tight">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mt-5 mb-3 text-white tracking-tight">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-bold mt-5 mb-3 text-white tracking-tight">
                        {children}
                      </h4>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2 text-white/80 text-[15px]">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2 text-white/80 text-[15px]">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-6 rounded-md border border-white/10">
                        <table className="min-w-full border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-white/5 text-white">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-white/10 text-white/80">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-white/5 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left border-b border-white/10 font-medium text-sm">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 border-b border-white/10 text-sm">
                        {children}
                      </td>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="pl-4 border-l-2 border-blue-500 py-1 px-3 my-4 text-white/60 italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="my-6 border-white/10" />,
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
              <div className="border-t border-white/10 px-6 py-4 flex justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Reset
                    className="bg-black hover:bg-white/5 text-white py-2 px-6 rounded-lg text-sm transition-colors border border-white/10 inline-flex items-center"
                    parentLoading={localIsLoading}
                    setParentLoading={setLocalIsLoading}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-12 text-center text-sm text-white/40">
            Analyzed with GitStart {new Date().getFullYear()} •
            <motion.button
              onClick={() => navigate("/")}
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code size={14} className="mr-1.5" />
              Analyze another repository
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalysisDisplay;
