import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    bgColor?: string;
    hoverColor?: string;    
    onClick?: React.MouseEventHandler<HTMLButtonElement>; 
}

const Button: React.FC<ButtonProps> = ({ children, className, type, bgColor, hoverColor, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            className={`bg-${bgColor || 'green-600'} hover:bg-${hoverColor || 'green-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};
export default Button;