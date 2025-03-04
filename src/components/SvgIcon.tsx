import React from "react";

type SvgIconProps = {
  src: string;
  alt: string;
  className?: string;
};

const SvgIcon: React.FC<SvgIconProps> = ({
  src,
  alt,
  className = "w-6 h-6",
}) => {
  return <img src={src} alt={alt} className={className} />;
};

export default SvgIcon;
