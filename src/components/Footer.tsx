import INsta from "../assets/icons/insta.svg";
import Xsocial from "../assets/icons/x-social.svg";
import YouTube from "../assets/icons/youtube.svg";

const Footer = () => {
  return (
    <footer className="py-5 bg-black text-white/60 border-t border-right/20">
      <div className="container p-7 mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="text-center">
            © 2024 GitStart Inc. Made with ❤️ by @avdhoottt
          </div>
          <ul className="flex justify-center gap-2.5">
            <li>
              <INsta />
            </li>
            <li>
              <YouTube />
            </li>
            <li>
              <Xsocial />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
