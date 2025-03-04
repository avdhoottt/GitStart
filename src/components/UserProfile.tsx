import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../auth/firebase";
import { getUserProfile } from "../services/githubService";
import { useRepo } from "../context/useInput";

const UserProfile = () => {
  const { currentUser, githubToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const { setIsLoading } = useRepo();
  const [showDropdown, setShowDropdown] = useState(false);

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
  }, [githubToken]);

  const handleLogout = async () => {
    try {
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
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={profile?.avatar_url || currentUser.photoURL || ""}
          alt="Profile"
          className="w-8 h-8 rounded-full border border-white/20"
        />
        <span className="text-white/70 hidden sm:block">
          {profile?.login || currentUser.displayName}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-white/10 rounded-lg shadow-lg w-48 py-1 z-10">
          <div className="px-4 py-2 border-b border-white/10">
            <div className="font-medium text-white">
              {profile?.name || currentUser.displayName}
            </div>
            <div className="text-sm text-white/60">
              {profile?.login || currentUser.email}
            </div>
          </div>

          <a
            href={profile?.html_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-white/70 hover:bg-gray-700 hover:text-white transition"
          >
            View GitHub Profile
          </a>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-white/70 hover:bg-gray-700 hover:text-white transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
