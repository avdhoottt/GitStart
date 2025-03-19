import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const items = [
  {
    questions: "How does GitStart analyze repositories?",
    answer:
      "GitStart scans repository files, documentation, and configuration to identify setup requirements and contribution processes automatically.",
  },
  {
    questions: "Is GitStart free to use?",
    answer:
      "Yes, GitStart is free for individual contributors. We also offer team plans for organizations managing multiple contributors.",
  },
  {
    questions: "Does GitStart work with private repositories?",
    answer:
      "Yes, GitStart can analyze private repositories as long as you have access permissions.",
  },
  {
    questions: "Can GitStart help with non-GitHub repositories?",
    answer:
      "Currently, GitStart focuses on GitHub repositories, with plans to support GitLab and Bitbucket in future updates.",
  },
];

const AccordionItem = ({
  questions,
  answer,
}: {
  questions: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="py-7 border-b border-white/10 cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center">
        <span className="flex-1 text-lg font-medium tracking-tight group-hover:text-white transition-colors">
          {questions}
        </span>
        <div className="relative">
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full opacity-0 ${
              isOpen ? "opacity-70" : "group-hover:opacity-40"
            } transition duration-300 blur`}
          ></div>
          {isOpen ? (
            <Minus
              size={20}
              color="white"
              strokeWidth={1.5}
              className="relative"
            />
          ) : (
            <Plus
              size={20}
              color="white"
              strokeWidth={1.5}
              className="relative"
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "16px",
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            className="text-white/60"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="bg-black text-white py-[72px] sm:py-24 relative">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#131313_1px,transparent_1px),linear-gradient(to_bottom,#131313_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]">
        <div className="absolute top-[20%] -right-[25%] left-0 bottom-0 bg-[radial-gradient(circle_800px_at_100%_20%,rgba(105,90,205,0.1),transparent)]"></div>
      </div>

      <div className="container p-7 mx-auto relative z-10">
        <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
            Frequently asked questions
          </span>
        </h2>
        <div className="mt-12 max-w-[648px] mx-auto relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-lg opacity-70 blur-xl"></div>
          <div className="relative bg-white/5 rounded-lg border border-white/10 p-6 backdrop-blur-sm">
            {items.map(({ questions, answer }) => (
              <AccordionItem
                questions={questions}
                answer={answer}
                key={questions}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
