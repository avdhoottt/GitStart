import { useRepo } from "../context/useInput";

const InputField = () => {
  const { repo, setRepo } = useRepo();

  return (
    <div className="w-full max-w-sm p-6 bg-black/50 rounded-lg shadow-lg border border-white/10">
      <input
        type="text"
        value={repo}
        className="w-full px-5 py-3 text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/50 transition-colors"
        placeholder="Enter GitHub repository URL"
        onChange={(e) => setRepo(e.target.value)}
      />
    </div>
  );
};

export default InputField;
