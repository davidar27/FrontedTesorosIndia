import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

interface ButtonIconProps {
    label: string;
    className?: string;
    url?: string;
    children: React.ReactNode;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ label, className, url, children }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <a
                aria-label={label}
                className={className}
                href={url ? url : '#'}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </motion.button>
    );
};
export default ButtonIcon;