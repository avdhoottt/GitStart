import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import InputField from "./InputField";
import InputBtn from "./InputBtn";

const Hero = () => {
  return (
    <div className="bg-black text-white py-[72px] sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[120px] opacity-70"></div>
        <div className="absolute -top-[40%] -left-[10%] right-0 bottom-0 bg-[radial-gradient(circle_800px_at_100%_20%,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute top-[60%] -right-[10%] left-0 bottom-0 bg-[radial-gradient(circle_800px_at_0%_50%,rgba(139,92,246,0.1),transparent)]"></div>
      </div>

      <div className="container relative mx-auto z-10 px-6">
        <div className="flex items-center justify-center mb-16">
          <a
            href=""
            className="inline-flex gap-3 border py-1.5 px-3 rounded-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 text-transparent bg-clip-text [-webkit-background-clip:text] font-medium">
              Your Open Source Companion
            </span>
            <span className="inline-flex items-center gap-1">
              <ArrowRight size={16} color="#888888" />
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 sm:px-16 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>Open Source</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                Made Simple
              </span>
            </motion.h1>

            <motion.p
              className="text-xl mt-6 text-white/60 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your personal guide to navigating any GitHub repository,
              understanding setup requirements, and collaborating effectively.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col md:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="#features" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-70 transition duration-300 blur"></div>
                <button className="relative bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-lg font-medium border border-white/10 backdrop-blur-sm transition-colors z-10 w-full">
                  Coming to Product Hunt! 🚀
                </button>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl opacity-70 blur-xl"></div>
            <div className="relative bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80">
                Analyze Repository
              </h3>
              <p className="text-white/60 mb-6">
                Paste a GitHub repository URL below to get started with your
                analysis.
              </p>

              <InputField
                className="w-full px-5 py-4 text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-white/40 transition-colors backdrop-blur-sm mb-4"
                type="text"
                placeholder="Enter your Github URL"
              />

              <InputBtn
                className="w-full bg-white/5 hover:bg-white/10 text-white py-4 px-5 rounded-lg font-medium border border-white/10 backdrop-blur-sm"
                label="Analyze Repository"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
