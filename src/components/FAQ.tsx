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
      className="py-7 border-b border-white/30"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center ">
        <span className="flex-1 text-lg font-bold">{questions}</span>
        {isOpen ? (
          <Minus size={24} color="white" strokeWidth={2} />
        ) : (
          <Plus size={24} color="white" strokeWidth={2} />
        )}
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
    <div className="bg-black text-white bg-gradient-to-b from-[#5d2ca8] to-black py-[72px] sm:py-24">
      <div className="container p-7 mx-auto">
        <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tighter">
          Frequently asked questions
        </h2>
        <div className="mt-12 max-w-[648px] mx-auto">
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
  );
};

export default FAQ;
