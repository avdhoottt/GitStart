import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="py-3 text-center rainbow-gradient">
      <div className="container mx-auto">
        <p className="font-medium">
          <span className="hidden sm:inline">Introducing GitStart -</span>
          <Link to="/" className="underline underline-offset-4 font-medium">
            Explore the demo
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Banner;
