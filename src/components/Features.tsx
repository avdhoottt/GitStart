import { useEffect, useRef } from "react";
import {
  Compass,
  Terminal,
  Database,
  GitBranch,
  FileCode,
  SquareTerminal,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useInView,
} from "framer-motion";

const Feature = ({
  title,
  description,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: any;
  delay?: number;
}) => {
  const offsetX = useMotionValue(-100);
  const offsetY = useMotionValue(-100);
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;
  const border = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!border.current) return;
      const rect = border.current?.getBoundingClientRect();
      offsetX.set(e.x - rect?.x);
      offsetY.set(e.y - rect?.y);
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay }}
      className="border border-white/10 p-6 text-left rounded-xl relative bg-white/[0.03] backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 border-2 border-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
        }}
        ref={border}
      ></motion.div>

      <div className="flex items-center mb-6">
        <div className="relative mr-4 group-hover:scale-110 transition-transform duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md opacity-0 group-hover:opacity-70 transition duration-300 blur"></div>
          <div className="relative flex h-12 w-12 bg-black text-blue-400 justify-center items-center rounded-md border border-white/10 z-10">
            <Icon size={24} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="font-bold tracking-tight text-white text-xl group-hover:text-white/90">
          {title}
        </h3>
      </div>

      <p className="text-white/60 group-hover:text-white/80">{description}</p>

      <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm">Learn more</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1"
        >
          <path
            d="M6.5 3.5L11 8L6.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Instant Repository Analysis",
      description:
        "Simply paste any GitHub repository URL and GitStart automatically generates comprehensive setup instructions tailored for beginners.",
      icon: GitBranch,
    },
    {
      title: "Dependency Mapping",
      description:
        "Automatically identify and map all dependencies required by the project, with detailed installation instructions for each.",
      icon: Database,
    },
    {
      title: "Code Structure Insights",
      description:
        "Get a clear overview of the codebase structure and architecture to better understand how components interact.",
      icon: FileCode,
    },
    {
      title: "Collaboration Guides",
      description:
        "Understand project structure, contribution guidelines, and best practices for seamless collaboration with project maintainers.",
      icon: Compass,
    },
    {
      title: "Development Environment Setup",
      description:
        "Get step-by-step instructions to configure your local environment with all dependencies and tools required by the project.",
      icon: Terminal,
    },
    {
      title: "Custom Workflow Support",
      description:
        "Adapt to project-specific workflows and processes with customized guides that match the repository's requirements.",
      icon: SquareTerminal,
    },
  ];

  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, {
    once: true,
    margin: "-100px 0px",
  });

  return (
    <div
      id="features"
      className="bg-black text-white py-[72px] sm:py-24 relative"
    >
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]">
        <div className="absolute top-0 -left-[25%] right-0 bottom-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(105,90,205,0.1),transparent)]"></div>
        <div className="absolute bottom-0 -right-[25%] left-0 top-1/2 bg-[radial-gradient(circle_800px_at_0%_80%,rgba(59,130,246,0.1),transparent)]"></div>
      </div>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          ref={titleRef}
          className="max-w-2xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white/80">
            Supercharge your open-source contributions
          </div>

          <h2 className="text-center font-bold text-4xl md:text-5xl tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/75">
              Everything You Need
            </span>
          </h2>

          <p className="text-center text-lg text-white/60">
            GitStart gives you all the tools needed to understand, set up, and
            contribute to any open-source project efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, description, icon }, idx) => (
            <Feature
              title={title}
              description={description}
              icon={icon}
              key={title}
              delay={idx * 0.1}
            />
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a href="/" className="relative inline-block group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
            <button className="relative bg-black py-3 px-8 rounded-lg font-medium border border-white/10 backdrop-blur-sm transition-colors z-10">
              See it in action
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
