import Eco from "../assets/icons/ecosystem.svg";
import Feature from "./Feature";

const Features = () => {
  const features = [
    {
      title: "Instant Repository Analysis",
      description:
        "Simply paste any GitHub repository URL and GitStart automatically generates comprehensive setup instructions tailored for beginners.",
    },
    {
      title: "Collaboration Guides",
      description:
        "Understand project structure, contribution guidelines, and best practices for seamless collaboration with project maintainers.",
    },
    {
      title: "Development Environment Setup",
      description:
        "Get step-by-step instructions to configure your local environment with all dependencies and tools required by the project.",
    },
  ];
  return (
    <div className="bg-black text-white py-[72px] sm:py-24">
      <div className="container mx-auto ">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">
          Everything You Need
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="text-center mt-5 m-4 text-xl text-white/70">
            Enjoy customizable lists, team work tools, and smart tracking all in
            one place. Set tasks, get reminders, and see your progress simply
            and quickly.
          </p>
        </div>
        <div className="mt-16 m-4 flex flex-col sm:flex-row gap-4">
          {features.map(({ title, description }) => (
            <Feature title={title} description={description} key={title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
