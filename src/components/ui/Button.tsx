import React from 'react'
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
            className={`bg-${bgColor || 'primary'} hover:${hoverColor || 'bg-white'} text-white hover:text-primary font-bold hover:font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
            type={type}
            onClick={onClick}
        >            {children}
        </motion.button>
    );
};
// hover:bg-${hoverColor || 'white'}
export default Button;