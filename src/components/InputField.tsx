import { useRepo } from "../context/useInput";

const InputField = ({
  className = "",
  type = "text",
  placeholder = "Enter Github repo Url",
}) => {
  const { repo, setRepo } = useRepo();

  return (
    <div className="w-full relative">
      <input
        type={`${type}`}
        value={repo}
        className={`${className} w-full text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder-white/40 transition-all duration-300`}
        placeholder={`${placeholder}`}
        onChange={(e) => setRepo(e.target.value)}
      />
    </div>
  );
};

export default InputField;
