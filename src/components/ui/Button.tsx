import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, className, type }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={className}
            type={type}
        >
                {children}
        </motion.button>
    );
};
export default Button;