import { useEffect, useState } from "react";
import { useRepo } from "../context/useInput";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../auth/firebase";
import { GitBranch, X, Menu, Plus, Trash2 } from "lucide-react";

interface AnalysisHistoryItem {
  id: string;
  repoName: string;
  owner: string;
  date: string;
  isActive: boolean;
}

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { analysisHistory, setAnalysisHistory, setAnalysis } = useRepo();
  const { currentUser } = useAuth();
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(64);
  const [scrollPosition, setScrollPosition] = useState(0);

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
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;
      try {
        const historyRef = collection(db, "analysisHistory");
        const q = query(
          historyRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const historyData: AnalysisHistoryItem[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          historyData.push({
            id: doc.id,
            repoName: data.repoName,
            owner: data.owner,
            date: new Date(data.createdAt.toDate()).toLocaleDateString(),
            isActive: data.owner === owner && data.repoName === repoName,
          });
        });
        setAnalysisHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [currentUser, owner, repoName, setAnalysisHistory]);

  const handleHistoryItemClick = async (item: AnalysisHistoryItem) => {
    try {
      const docRef = doc(db, "analysisHistory", item.id);
      const docsSnap = await getDoc(docRef);
      if (docsSnap.exists()) {
        const data = docsSnap.data();
        if (data.analysisContent) {
          setAnalysis(data.analysisContent);
        }
      }
      navigate(`/${item.owner}/${item.repoName}`);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error getting history item:", error);
      navigate(`/${item.owner}/${item.repoName}`);
    }
  };

  const handleClearHistory = async () => {
    if (
      !currentUser ||
      !window.confirm("Are you sure you want to clear your analysis history?")
    )
      return;

    try {
      const historyRef = collection(db, "analysisHistory");
      const q = query(historyRef, where("userId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setAnalysisHistory([]);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const getSidebarStyle = () => {
    return {
      top: `${navbarHeight}px`,
      height: `calc(100vh - ${navbarHeight}px)`,
      position: "fixed",
    } as React.CSSProperties;
  };

  return (
    <>
      <div
        className={`fixed left-0 z-40 w-64 bg-black border-r border-white/10 transition-all duration-300 lg:shadow-xl overflow-y-auto ${
          isSidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={getSidebarStyle()}
      >
        <div className="p-5 flex flex-col h-full">
          <motion.button
            className="w-full bg-black text-white font-medium py-2.5 px-4 rounded-lg border border-white/10 transition duration-200 text-sm mb-6 flex items-center justify-center group relative"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative flex items-center justify-center z-10">
              <Plus
                size={16}
                className="mr-2 text-blue-400 group-hover:text-blue-300"
              />
              <span className="group-hover:text-blue-300">New Analysis</span>
            </div>
          </motion.button>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-white/40 tracking-wide uppercase">
              Analysis History
            </h3>
            <div className="text-xs text-white/40">
              {analysisHistory?.length || 0} items
            </div>
          </div>

          <div className="overflow-y-auto flex-1 space-y-1 pr-1 -mx-1">
            {analysisHistory && analysisHistory.length > 0 ? (
              analysisHistory.map((item) => (
                <motion.div
                  key={item.id}
                  className={`px-2 py-2 rounded-md cursor-pointer transition-all duration-150 text-sm ${
                    item.isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-600/10 text-white border border-blue-500/20"
                      : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                  }`}
                  onClick={() => handleHistoryItemClick(item)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <GitBranch
                      size={14}
                      className={`mr-2 ${
                        item.isActive ? "text-blue-400" : "text-white/40"
                      }`}
                    />
                    <div className="flex-1 truncate font-medium">
                      {item.owner}/{item.repoName}
                    </div>
                  </div>
                  <div className="text-xs text-white/40 mt-1 pl-6 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {item.date}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 px-3 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                  <GitBranch size={20} className="text-white/30" />
                </div>
                <p className="text-white/50 text-sm mb-4">
                  No analysis history found
                </p>
                <motion.button
                  onClick={() => navigate("/")}
                  className="mx-auto text-xs text-blue-400 hover:text-blue-300 inline-flex items-center bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={14} className="mr-1.5" />
                  Start first analysis
                </motion.button>
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-white/10 text-xs">
            <div className="flex justify-center">
              <motion.button
                className="px-3 py-1.5 text-white/50 hover:text-red-400 transition-colors inline-flex items-center"
                onClick={handleClearHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={14} className="mr-1.5" />
                Clear history
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        className="sm:hidden md:hidden fixed z-50 bottom-6 right-6 bg-black text-white p-3 rounded-full border border-white/10 shadow-xl transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur"></div>
          {isSidebarOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </div>
      </motion.button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
          style={{ top: navbarHeight }}
        />
      )}
    </>
  );
};

export default Sidebar;
