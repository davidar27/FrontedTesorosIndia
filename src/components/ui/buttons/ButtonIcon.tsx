/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonIconProps {
  label?: string;
  className?: string;
  url?: string;
  children: React.ReactNode;
  target?: string;
  textColor?: string;
  hoverColor?: string;
  disabled?: boolean;
  px?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  label,
  className = "",
  url,
  children,
  target = "_self",
  textColor = "text-white",
  hoverColor = "hover:text-primary-hover",
  type = "button",
  disabled = false,
  title,
  onClick,
}) => {
  const baseClasses = clsx(
    "text-sm py-1 rounded flex items-center gap-2 transition-colors cursor-pointer",
    textColor,
    hoverColor,
    type === "submit" && "bg-primary",
    className
  );

  const commonProps = {
    className: baseClasses,
    "aria-label": label,
    onClick,
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: "easeInOut" },
    disabled,
    title,
  };

  return url ? (
    <motion.a
      {...commonProps as any}
      href={url}
      target={target}
      rel="noopener noreferrer"
    >
      {children}
    </motion.a>
  ) : (
    <motion.button {...commonProps as any} type="button">
      {children}
    </motion.button>
  );
};

export default ButtonIcon;