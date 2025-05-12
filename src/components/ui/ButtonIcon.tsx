import React from 'react'
import { motion } from 'framer-motion';

interface ButtonIconProps {
    label?: string;
    className?: string;
    url?: string;
    children: React.ReactNode;
    target?: string;
    onClick?: () => void;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ label, className, url, children, target, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            onClick={onClick}

        >
            <a
                aria-label={label}
                className={className}
                href={url ? url : '#'}
                target={target ? target : '_self'}
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </motion.button>
    );
};
export default ButtonIcon;