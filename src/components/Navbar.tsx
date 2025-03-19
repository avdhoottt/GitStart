import { useState, useEffect } from "react";
import logoImage from "../assets/images/sass-logo-1.png";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginButton from "./LoginButton";
import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isLoginLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const bannerHeight = 40;

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > (isHomePage ? bannerHeight : 0)) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const navLinkClass =
    "relative text-white/70 hover:text-white transition-colors duration-300 py-2 text-sm font-medium";
  const navLinkActiveClass = "text-white";

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", requiresAuth: true },
    {
      label: "Features",
      path: "#features",
      onClick: () => scrollToSection("features"),
    },
    { label: "FAQs", path: "#faq", onClick: () => scrollToSection("faq") },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90" : "bg-black/60"
      } backdrop-blur-md border-b border-white/5`}
      style={{
        top: isHomePage && !scrolled ? `${bannerHeight}px` : 0,
      }}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <motion.img
            src={logoImage}
            alt="GitStart Logo"
            className="h-10 w-auto cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{
              scale: 1.05,
              filter: "drop-shadow(0 0 8px rgba(100, 100, 255, 0.5))",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />

          <nav className="hidden sm:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.requiresAuth && !currentUser) return null;

              return (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  {link.onClick ? (
                    <a
                      onClick={link.onClick}
                      className={`${navLinkClass} cursor-pointer`}
                    >
                      {link.label}
                      <motion.span
                        className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      ></motion.span>
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`${navLinkClass} ${
                        location.pathname === link.path
                          ? navLinkActiveClass
                          : ""
                      }`}
                    >
                      {link.label}
                      <motion.span
                        className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      ></motion.span>
                    </Link>
                  )}
                </motion.div>
              );
            })}

            <div>
              {isLoginLoading ? (
                <div className="flex space-x-2 items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                </div>
              ) : currentUser ? (
                <UserProfile />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                    <LoginButton
                      label="Sign In"
                      className="relative bg-black py-2 px-6 rounded-lg text-white border border-white/10 cursor-pointer font-medium text-sm transition-all duration-300"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </nav>
          <motion.button
            className="sm:hidden relative group"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            <div className="relative p-2 rounded-lg border border-white/10 bg-black">
              {isMenuOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden overflow-hidden bg-black/95 border-t border-white/5 backdrop-blur-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                if (link.requiresAuth && !currentUser) return null;

                return link.onClick ? (
                  <a
                    key={link.label}
                    onClick={link.onClick}
                    className="block py-3 text-white/70 hover:text-white transition-colors px-3 rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`block py-3 px-3 rounded-lg hover:bg-white/5 ${
                      location.pathname === link.path
                        ? "text-white bg-white/5"
                        : "text-white/70 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-white/10 mt-2">
                {isLoginLoading ? (
                  <div className="h-12 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                      <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                    </div>
                  </div>
                ) : currentUser ? (
                  <div className="py-3">
                    <div className="flex items-center gap-3 mb-3 px-3">
                      <img
                        src={currentUser.photoURL || ""}
                        alt="Profile"
                        className="w-10 h-10 rounded-md border border-white/10"
                      />
                      <div>
                        <div className="font-medium text-white text-sm">
                          {currentUser.displayName}
                        </div>
                        <div className="text-xs text-white/60">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                    <div className="px-3 pt-2">
                      <button
                        onClick={() =>
                          import("../auth/firebase").then(({ logOut }) => {
                            logOut();
                            setIsMenuOpen(false);
                          })
                        }
                        className="w-full relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 to-red-600/30 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                        <div className="relative bg-black py-2 px-4 rounded-lg text-white border border-white/10 text-sm">
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 px-3">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-70 blur transition-all duration-300"></div>
                      <LoginButton
                        className="relative bg-black w-full py-3 px-4 rounded-lg text-white text-sm font-medium border border-white/10 cursor-pointer"
                        label="Sign in"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
