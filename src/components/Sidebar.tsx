import { useEffect, useState, useRef } from "react";
import { useRepo } from "../context/useInput";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
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

  // To track scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  const navbarRef = useRef<HTMLElement | null>(null);
  const [navbarHeight, setNavbarHeight] = useState(10); // Default height

  useEffect(() => {
    // Find the navbar element
    navbarRef.current =
      document.querySelector("nav") || document.querySelector(".navbar");

    if (navbarRef.current) {
      const height = navbarRef.current.getBoundingClientRect().height;
      setNavbarHeight(height);
    }

    // Set up scroll listener
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
  }, [currentUser, owner, repoName]);

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
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  // Calculate sidebar position based on scroll and navbar
  const getSidebarStyle = () => {
    const isNavbarVisible = scrollPosition < navbarHeight;

    return {
      top: isNavbarVisible ? `${navbarHeight}px` : "0px",
      height: isNavbarVisible ? `calc(100vh - ${navbarHeight}px)` : "100vh",
    };
  };

  return (
    <>
      {/* Sidebar toggle button - fixed position */}
      <button
        className="sm:hidden md:hidden fixed z-50 bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar - with dynamic positioning based on scroll */}
      <div
        className={`fixed left-0 z-40 w-72 bg-gray-900 border-r border-purple-900/30 transition-all duration-300 shadow-xl backdrop-blur-lg overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={getSidebarStyle()}
      >
        <div className="p-5 flex flex-col h-full">
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-900 transition duration-200 text-sm mb-8 flex items-center justify-center shadow-lg"
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Analysis
          </button>

          <div className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 pl-2">
            Analysis History
          </div>

          <div className="overflow-y-auto flex-1 -mr-2 pr-2 space-y-3">
            {analysisHistory && analysisHistory.length > 0 ? (
              analysisHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                    item.isActive
                      ? "bg-purple-900/50 border border-purple-500/50 shadow-md"
                      : "hover:bg-gray-800/70 border border-gray-800/50 hover:border-gray-700/50"
                  }`}
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="font-medium text-white">
                    {item.owner}/{item.repoName}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                    <span>{item.date}</span>
                    {item.isActive && (
                      <span className="text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 px-4 bg-gray-800/20 rounded-lg border border-gray-800/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto mb-2 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 110-2h2V8a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                No analysis history found
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-800 text-xs text-gray-400">
            <div className="flex justify-between">
              <button
                className="px-3 py-2 hover:text-white transition-colors hover:bg-red-950/30 rounded-md"
                onClick={handleClearHistory}
              >
                Clear history
              </button>
              <button className="px-3 py-2 hover:text-white transition-colors hover:bg-gray-800/70 rounded-md">
                Export all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
