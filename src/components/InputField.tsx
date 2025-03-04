import { useRepo } from "../context/useInput";

const InputField = ({
  className = "",
  type = "text",
  placeholder = "Enter Github Url",
}) => {
  const { repo, setRepo } = useRepo();

  return (
    <div className="w-full max-w-sm p-6 bg-black/50 rounded-lg shadow-lg border border-white/10">
      <input
        type={`${type}`}
        value={repo}
        className={`${className}`}
        placeholder={`${placeholder}`}
        onChange={(e) => setRepo(e.target.value)}
      />
    </div>
  );
};

export default InputField;
