import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import logoImage from "../assets/images/sass-logo-1.png";
import { Rocket, Code, Github } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />

      <main
        className="pt-16 pb-16 px-6 lg:px-8 lg:ml-64 transition-all duration-300"
        style={{ paddingTop: `${navbarHeight + 48}px` }}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <motion.img
                src={logoImage}
                alt="GitStart Logo"
                className="h-16"
                whileHover={{
                  scale: 1.05,
                  filter: "drop-shadow(0 0 8px rgba(100, 100, 255, 0.5))",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Simplify Repository Setup
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              GitStart analyzes your GitHub repositories and provides
              comprehensive setup instructions to get new developers onboarded
              quickly.
            </p>

            <div className="flex justify-center mb-12">
              <motion.button
                onClick={() => navigate("/")}
                className="relative group inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                <div className="relative flex items-center">
                  <Code size={18} className="mr-2" />
                  Start New Analysis
                </div>
              </motion.button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden bg-black/30 backdrop-blur-sm relative mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-lg opacity-70 blur-xl"></div>
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center">
                <Rocket size={20} className="mr-2 text-blue-400" />
                GitStart Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Repository Analysis
                  </h3>
                  <p className="text-white/70 text-sm">
                    Automated analysis of project dependencies, structure, and
                    setup requirements.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Step-by-Step Setup Guides
                  </h3>
                  <p className="text-white/70 text-sm">
                    Clear instructions for environment setup, dependencies, and
                    configuration.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Developer Onboarding
                  </h3>
                  <p className="text-white/70 text-sm">
                    Get new team members up and running in minutes instead of
                    hours.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    History & Sharing
                  </h3>
                  <p className="text-white/70 text-sm">
                    Save and share setup guides with your team for future
                    reference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center bg-black px-5 py-3 rounded-lg text-white border border-white/10 hover:border-blue-500/40 transition-colors text-sm group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Github
                size={16}
                className="mr-2 text-white/70 group-hover:text-blue-400"
              />
              <span>Connect Repository</span>
            </motion.button>
          </div>

          <div className="mt-12 text-center text-sm text-white/40">
            GitStart {new Date().getFullYear()} • Simplifying development setup
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
