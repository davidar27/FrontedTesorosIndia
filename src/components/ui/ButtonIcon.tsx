import React from "react";
import { motion } from "framer-motion";

interface ButtonIconProps {
  label?: string;
  className?: string;
  url?: string;
  children: React.ReactNode;
  target?: string;
  textColor?: string;
  hoverColor?: string;
  px?: string;
  onClick?: () => void;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  label,
  className = "",
  url,
  children,
  target = "_self",
  textColor = "text-white",
  hoverColor = "hover:text-hover-primary",
  onClick,
}) => {
  const combinedClass = `text-sm  py-1 rounded flex items-center gap-2 transition-colors ${textColor} ${hoverColor} ${className}`;

  const MotionTag = motion(url ? "a" : "button");

  return (
    <MotionTag
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      onClick={onClick}
      href={url}
      target={url ? target : undefined}
      rel={url ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={combinedClass}
    >
      {children}
    </MotionTag>
  );
};

export default ButtonIcon;
