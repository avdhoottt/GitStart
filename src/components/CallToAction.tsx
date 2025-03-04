import helix from "../assets/images/helix2.png";
import emoji from "../assets/images/emojistar.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const navigate = useNavigate();
  const translateY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const scrollToSection = (sectionId: any) => {
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
  };
  return (
    <div
      className="bg-black text-white py-[72px] sm:py-24 text-center"
      ref={containerRef}
    >
      <div className="container p-7 mx-auto max-w-xl relative">
        <motion.div
          style={{
            translateY,
          }}
        >
          <img src={helix} alt="" className="absolute top-6 -right-52" />
        </motion.div>
        <motion.div
          style={{
            translateY,
          }}
        >
          <img src={emoji} alt="" className="absolute -top-[120px] -left-64" />
        </motion.div>
        <h2 className="font-bold text-5xl tracking-tighter sm:text-6xl">
          Start Today
        </h2>
        <p className="text-xl text-white/70  mt-5">
          Turn any GitHub repository into a beginner-friendly project with
          step-by-step guidance for setup and contribution.
        </p>
        <form className="mt-10 flex justify-center items-center max-w-sm mx-auto sm:flex-row gap-2.5">
          <button
            className="bg-white text-black h-12 rounded-lg  px-5"
            onClick={() => scrollToSection("home")}
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallToAction;
