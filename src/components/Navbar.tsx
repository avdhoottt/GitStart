import { useState } from "react";
import logoImage from "../assets/images/logosaas.png";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginButton from "./LoginButton";
import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isLoginLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const scrollToSection = (sectionId: any) => {
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    // If we're not on the homepage, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait a bit for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-black">
      <div className="px-4 mx-auto">
        <div className="p-4 flex items-center justify-between">
          {/* Logo */}
          <div className="relative">
            <div className="absolute w-full top-2 bottom-0 bg-gradient-to-r"></div>
            <img
              src={logoImage}
              className="h-12 w-12 relative"
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {/* <img src={MenuIcon} alt="" className="text-white" /> */}
            <Menu size={24} color="white" />
          </button>

          {/* Desktop Navigation */}
          <nav className="gap-6 items-center hidden sm:flex">
            {currentUser && (
              <Link
                to="/dashboard"
                className="text-white/60 hover:text-white transition"
              >
                Dashboard
              </Link>
            )}
            <a
              onClick={() => scrollToSection("features")}
              className="text-white/60 hover:text-white transition"
            >
              Features
            </a>
            <a
              onClick={() => scrollToSection("faq")}
              className="text-white/60 hover:text-white transition"
            >
              FAQs
            </a>
            {isLoginLoading ? (
              <div className="h-10 w-10 rounded-full bg-gray-800 animate-pulse"></div>
            ) : currentUser ? (
              <UserProfile />
            ) : (
              <LoginButton
                label="Sign In"
                className="bg-white py-2 px-4 rounded-lg text-black w-full mt-2 cursor-pointer"
              />
            )}
          </nav>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="py-4 px-2 border-t border-white/10">
                <div className="flex flex-col space-y-4">
                  <a
                    onClick={() => scrollToSection("home")}
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Home
                  </a>
                  <a
                    onClick={() => scrollToSection("features")}
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Features
                  </a>
                  <a
                    onClick={() => scrollToSection("faq")}
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    FAQs
                  </a>
                  {isLoginLoading ? (
                    <div className="h-10 w-full bg-gray-800 animate-pulse rounded-lg"></div>
                  ) : currentUser ? (
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={currentUser.photoURL || ""}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border border-white/20"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {currentUser.displayName}
                          </div>
                          <div className="text-sm text-white/60">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          import("../auth/firebase").then(({ logOut }) =>
                            logOut()
                          )
                        }
                        className="w-full bg-gray-700 py-2 px-4 rounded-lg text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <LoginButton
                      className="bg-white py-2 px-4 rounded-lg text-black w-full mt-2 cursor-pointer"
                      label="Sign in"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
