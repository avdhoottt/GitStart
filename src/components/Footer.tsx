const Footer = () => {
  return (
    <footer className="py-6 bg-black text-white/60 border-t border-white/5 relative">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#131313_1px,transparent_1px),linear-gradient(to_bottom,#131313_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_100%,#000_70%,transparent_100%)]"></div>

      <div className="container p-7 mx-auto relative z-10">
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="text-center">
            © 2024 GitStart Inc. Made with{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-red-500/20 blur-sm rounded-full animate-pulse"></span>
              <span className="relative">❤️</span>
            </span>{" "}
            by{" "}
            <a
              href="https://github.com/avdhoottt"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 transition-colors relative inline-block group"
            >
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              @avdhoottt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
