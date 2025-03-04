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
    <div className="bg-black text-white bg-gradient-to-b from-black to-[#5d2ca8] py-[72px] sm:py-24">
      <div className="container p-4 mx-auto">
        <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tighter">
          Simple Interface
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="text-xl text-center text-white/70 mt-5">
            Navigate the complex world of open source with GitStart's clear,
            straightforward interface designed for contributors at all
            experience levels.
          </p>
        </div>
        <div className="flex justify-center">
          <motion.div
            style={{
              opacity: opacity,
              rotateX: rotateX,
              transformPerspective: "800px",
            }}
          >
            <img
              src={appScreen}
              alt="Product Screenshot"
              className="mt-14"
              ref={appImage}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
