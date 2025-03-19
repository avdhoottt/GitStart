import { motion, useScroll, useTransform } from "framer-motion";
import appScreen from "../assets/images/app-screen.png";
import { useRef } from "react";

const ProductShow = () => {
  const appImage = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  return (
    <div className="bg-black text-white py-[72px] sm:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#131313_1px,transparent_1px),linear-gradient(to_bottom,#131313_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]">
        <div className="absolute -bottom-[25%] -right-[25%] left-0 top-0 bg-[radial-gradient(circle_800px_at_0%_0%,rgba(120,65,200,0.15),transparent)]"></div>
      </div>

      <div className="container p-4 mx-auto relative z-10">
        <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
            Simple Interface
          </span>
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="text-xl text-center text-white/60 mt-5">
            Navigate the complex world of open source with GitStart's clear,
            straightforward interface designed for contributors at all
            experience levels.
          </p>
        </div>
        <div className="flex justify-center mt-12">
          <div className="relative p-2 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg opacity-50 blur-xl"></div>
            <motion.div
              style={{
                opacity: opacity,
                rotateX: rotateX,
                transformPerspective: "800px",
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl opacity-30"></div>
              <img
                src={appScreen}
                alt="Product Screenshot"
                className="relative rounded-lg border border-white/10 shadow-2xl"
                ref={appImage}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
