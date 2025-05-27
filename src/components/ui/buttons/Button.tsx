import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    bgColor?: string;
    hoverColor?: string;
    textColor?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    type = "button",
    bgColor = "bg-primary",
    hoverColor = "hover:bg-white",
    textColor = "text-white",
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
                "font-semibold py-2 px-4 rounded transition-colors cursor-pointer shadow-lg border-2 border-primary",
                bgColor,
                hoverColor,
                textColor,
                "hover:text-primary",
                className
            )}
        >
            {children}
        </motion.button>
    );
};

export default Button;
