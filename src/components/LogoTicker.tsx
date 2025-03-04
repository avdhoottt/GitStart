import React, { useRef, useEffect, useState } from "react";
import acme from "../assets/images/acme.png";
import quantum from "../assets/images/quantum.png";
import echo from "../assets/images/echo.png";
import celestial from "../assets/images/celestial.png";
import pulse from "../assets/images/pulse.png";
import apex from "../assets/images/apex.png";
import { motion, useAnimationControls } from "framer-motion";

const images = [
  { src: acme, id: "acme" },
  { src: quantum, id: "quantum" },
  { src: echo, id: "echo" },
  { src: celestial, id: "celestial" },
  { src: pulse, id: "pulse" },
  { src: apex, id: "apex" },
];

const LogoTicker = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef(null);
  const controls = useAnimationControls();

  useEffect(() => {
    if (carousel.current) {
      // Get the width of the first set of images
      const firstSetWidth = carousel.current.scrollWidth / 2;
      setWidth(firstSetWidth);

      // Start animation after width is calculated
      controls.start({
        x: -width,
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        },
      });
    }
  }, [controls, width]);

  return (
    <div className="bg-black text-white py-[72px] sm:py-24">
      <div className="container p-7 mx-auto">
        <h2 className="text-xl text-center text-white/70">
          Trusted by world's most innovative teams
        </h2>
        <div className="relative mt-9 overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent z-10"></div>

          {/* Scrolling logos */}
          <motion.div
            ref={carousel}
            animate={controls}
            className="flex items-center gap-16"
          >
            {images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.id}
                className="h-8 w-auto flex-none"
              />
            ))}
            {images.map((image) => (
              <img
                key={`${image.id}-duplicate`}
                src={image.src}
                alt={image.id}
                className="h-8 w-auto flex-none"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
