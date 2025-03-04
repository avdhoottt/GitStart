import { useState } from "react";
import logoImage from "../assets/images/logosaas.png";
import MenuIcon from "../assets/icons/menu.svg";
import { motion, AnimatePresence } from "framer-motion";
import LoginButton from "./LoginButton";
import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isLoginLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <MenuIcon className="text-white" />
          </button>

          {/* Desktop Navigation */}
          <nav className="gap-6 items-center hidden sm:flex">
            <a href="#" className="text-white/60 hover:text-white transition">
              About
            </a>
            <a href="#" className="text-white/60 hover:text-white transition">
              Features
            </a>
            <a href="#" className="text-white/60 hover:text-white transition">
              Updates
            </a>
            <a href="#" className="text-white/60 hover:text-white transition">
              Help
            </a>
            <a href="#" className="text-white/60 hover:text-white transition">
              Customers
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
                    href="#"
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Updates
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Help
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition py-2"
                  >
                    Customers
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
