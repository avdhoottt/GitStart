import { ArrowRight } from "lucide-react";
import Cursor from "../assets/images/cursor.png";
import Message from "../assets/images/message.png";
import { motion } from "framer-motion";
import InputField from "./InputField";
import InputBtn from "./InputBtn";

const Hero = () => {
  return (
    <div className="bg-black text-white hero-gradient py-[72px] sm:py-24 relative overflow-clip">
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] lg:w-[2400px] lg:h-[1200px] sm:h-[768px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[##b48cde] bg-[radial-gradient(closest-side,#000_82%,#9560eb)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
      <div className="container relative mx-auto">
        <div className="flex items-center justify-center">
          <a
            href=""
            className="inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30"
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-transparent bg-clip-text [-webkit-background-clip:text]">
              GitStart is here
            </span>
            <span className="inline-flex items-center gap-1">
              <span></span>
              <ArrowRight size={16} color="white" />
            </span>
          </a>
        </div>
        <div className="flex justify-center mt-8">
          <div className="inline-flex relative">
            <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter text-center inline-flex">
              Open Source
              <br />
              Made Simple
            </h1>
            <motion.div
              className="h-[200px] w-[200px] absolute right-[676px] top-[108px] hidden sm:inline "
              drag
              dragSnapToOrigin
            >
              <img
                src={Cursor}
                className="max-w-none"
                alt=""
                draggable="false"
              />
            </motion.div>
            <motion.div
              className="h-[200px] w-[200px] absolute top-[56px] left-[698px] hidden sm:inline"
              drag
              dragSnapToOrigin
            >
              <img
                src={Message}
                className="max-w-none"
                alt=""
                draggable="false"
              />
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-center text-xl mt-8 max-w-md">
            Your personal guide to navigating any GitHub repository,
            understanding setup requirements, and collaborating effectively.
          </p>
        </div>
        <div className="flex flex-col p-4 justify-center items-center gap-4 mt-8 sm:flex-row">
          <InputField
            className="w-full px-5 py-3 text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/50 transition-colors"
            type="text"
            placeholder="Enter your Github URL"
          />
          <InputBtn
            className="bg-white text-black py-3 px-5 rounded-lg font-medium sm:h-16"
            label="Analyze"
          />
          {/* <button className="bg-white text-black py-3 px-5 rounded-lg font-medium sm:h-16">
            Analyze
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
