import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    bgColor?: string;
    hoverBg?: string;
    textColor?: string;
    hoverTextColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    type = "button",
    bgColor = "bg-primary",
    textColor = "text-white",
    hoverBg = "hover:bg-transparent",
    hoverTextColor = "hover:text-primary",
    borderColor = "border-primary",
    hoverBorderColor = "hover:border-primary",
    onClick,
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            type={type}
            onClick={onClick}

            className={clsx(
                "font-semibold py-2 px-4 rounded transition-colors  shadow-lg border-2 border-primary cursor-pointer",
                bgColor,
                textColor,
                hoverBg,
                hoverTextColor,
                borderColor,
                hoverBorderColor,
                className
            )}
        >
            {children}
        </motion.button>
    );
};

export default Button;
