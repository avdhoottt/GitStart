import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, ArrowRight, Check } from "lucide-react";
import { handelSubscribe } from "../auth/firebase";

const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 10);
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await handelSubscribe(email);
      setIsSubscribed(true);
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-black text-white py-[72px] sm:py-24 relative"
      ref={containerRef}
    >
      {/* Background effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#131313_1px,transparent_1px),linear-gradient(to_bottom,#131313_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]">
        <div className="absolute top-[20%] -right-[25%] left-0 bottom-0 bg-[radial-gradient(circle_800px_at_100%_20%,rgba(105,90,205,0.1),transparent)]"></div>
      </div>

      <div className="container p-7 mx-auto relative z-10">
        <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
            Start Today
          </span>
        </h2>

        <p className="text-center text-xl text-white/60 mt-5 max-w-[648px] mx-auto">
          Turn any GitHub repository into a beginner-friendly project with
          step-by-step guidance for setup and contribution.
        </p>

        <div className="mt-12 max-w-[648px] mx-auto relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-lg opacity-70 blur-xl"></div>
          <div className="relative p-6 flex flex-col justify-center items-center space-y-8">
            {/* Get Started Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-70 transition duration-300 blur"></div>
              <motion.button
                type="button"
                className="relative bg-white/5 hover:bg-white/10 text-white h-12 rounded-lg px-5 border border-white/10 backdrop-blur-sm transition-colors z-10 flex items-center"
                onClick={(e) => scrollToSection(e, "home")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ExternalLink size={16} className="ml-2" />
              </motion.button>
            </div>
            <div className="w-full pt-6 border-t border-white/10">
              <h3 className="text-center text-white text-lg font-medium mb-4">
                Stay updated with GitStart
              </h3>

              {!isSubscribed ? (
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white/90 placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
                    disabled={isSubmitting}
                  />
                  <motion.button
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm ${
                      isSubmitting
                        ? "bg-blue-700/50 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    onClick={handleSubscribe}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                    <ArrowRight size={14} className="ml-2" />
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  className="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 py-2 px-4 rounded-lg border border-green-500/20 max-w-sm mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Check size={16} />
                  <span>Thanks for subscribing!</span>
                </motion.div>
              )}

              {error && (
                <motion.p
                  className="text-red-400 text-sm mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
