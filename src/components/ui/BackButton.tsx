import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
    to?: string;
    className?: string;
    iconClassName?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
    hoverColor?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
};

const positionMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
};

const BackButton: React.FC<BackButtonProps> = ({
    to = '/',
    className = '',
    iconClassName = '',
    position = 'top-left',
    color = 'currentColor',
    hoverColor = 'gray-700',
    size = 'md',
    onClick,
}) => {
    const positionClasses = positionMap[position];
    const sizeClass = sizeMap[size];

    return (
        <Link
            to={to}
            className={`absolute ${positionClasses} text-${color} hover:text-${hoverColor} transition duration-200 ${className}`}
            onClick={onClick}
            aria-label="Regresar"
        >
            <ChevronLeft className={`${sizeClass} ${iconClassName}`} />
        </Link>
    );
};

export default BackButton;