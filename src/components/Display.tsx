import React from "react";
import Navbar from "./Navbar";

const Display = () => {
  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      repoName: "ai-interview-helper",
      owner: "avdhoottt",
      date: "March 2, 2025",
      isActive: true,
    },
    {
      id: 2,
      repoName: "react",
      owner: "facebook",
      date: "March 1, 2025",
      isActive: false,
    },
    {
      id: 3,
      repoName: "next.js",
      owner: "vercel",
      date: "February 28, 2025",
      isActive: false,
    },
    {
      id: 4,
      repoName: "tailwindcss",
      owner: "tailwindlabs",
      date: "February 27, 2025",
      isActive: false,
    },
  ]);
  return (
    <>
      <Navbar />
      <aside
        className={`'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 bg-gray-900/60 backdrop-blur-sm border-r border-purple-700/30 transition-transform duration-300 absolute lg:relative z-20 h-[calc(100vh-65px)]`}
      >
        <div className="p-4 flex flex-col h-full">
          <button className="w-full bg-purple-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-purple-500 transition duration-200 text-sm mb-6 flex items-center justify-center">
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

          <div className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2 pl-2">
            Analysis History
          </div>

          <div className="overflow-y-auto flex-1 -mr-2 pr-2">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm ${
                  item.isActive
                    ? "bg-purple-700/50 border border-purple-500/50"
                    : "hover:bg-gray-800/70"
                }`}
              >
                <div className="font-medium">
                  {item.owner}/{item.repoName}
                </div>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>{item.date}</span>
                  {item.isActive && (
                    <span className="text-purple-400">Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-700/50 text-xs text-gray-400">
            <div className="flex justify-between">
              <button className="hover:text-white transition-colors">
                Clear history
              </button>
              <button className="hover:text-white transition-colors">
                Export all
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Display;
