import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
                {children}
        </motion.button>
    );
};
export default Button;