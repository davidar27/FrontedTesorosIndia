import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    fixed?: boolean;
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
    to,
    className = '',
    iconClassName = '',
    position = 'top-left',
    color = 'currentColor',
    hoverColor = 'gray-700',
    size = 'md',
    onClick,
    fixed = false,
}) => {
    const navigate = useNavigate();
    const positionClasses = positionMap[position];
    const sizeClass = sizeMap[size];

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick();
            return;
        }
        
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`${fixed ? 'fixed' : 'absolute'} ${positionClasses} text-${color} hover:text-${hoverColor} transition-colors duration-200 ${className} cursor-pointer`}
            aria-label="Regresar"
        >
            <ChevronLeft className={`${sizeClass} ${iconClassName}`} />
        </button>
    );
};

export default BackButton;