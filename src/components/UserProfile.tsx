import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../auth/firebase";
import { getUserProfile } from "../services/githubService";
import { useRepo } from "../context/useInput";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { currentUser, githubToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const { setIsLoading } = useRepo();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (githubToken) {
        setIsLoading(true);
        try {
          const data = await getUserProfile();
          setProfile(data);
        } catch (error) {
          console.error("Error fetching GitHub profile:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-profile-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [githubToken, setIsLoading]);

  const handleLogout = async () => {
    try {
      navigate("/");
      await logOut();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative user-profile-container">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 cursor-pointer relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
        <div className="relative flex items-center gap-2 z-10">
          <img
            src={profile?.avatar_url || currentUser.photoURL || ""}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300"
          />
          <span className="text-white/70 hidden sm:block group-hover:text-white transition-colors">
            {profile?.login || currentUser.displayName}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="absolute right-0 top-full mt-2 bg-black border border-white/10 rounded-lg shadow-lg w-56 py-1 z-10 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg opacity-70 blur-xl"></div>
              <div className="relative">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-start gap-3">
                    <img
                      src={profile?.avatar_url || currentUser.photoURL || ""}
                      alt="Profile"
                      className="w-10 h-10 rounded-md border border-white/20"
                    />
                    <div>
                      <div className="font-medium text-white">
                        {profile?.name || currentUser.displayName}
                      </div>
                      <div className="text-xs text-white/60">
                        {profile?.login || currentUser.email}
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={profile?.html_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Github size={16} className="text-white/50" />
                  <span>View GitHub Profile</span>
                </a>

                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-white/70 hover:bg-white/5 hover:text-red-400 transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <LogOut size={16} className="text-white/50" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
