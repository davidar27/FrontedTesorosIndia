import React from 'react';
import Picture from '@/components/ui/display/Picture';

interface CircularLogoProps {
    src: string;
    alt: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
    offsetY?: number | string;
    bgColor?: string;
    borderColor?: string;
    shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const sizeMap = {
    sm: 80,
    md: 100,
    lg: 120,
    xl: 144,
};

const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: '',
};

const CircularLogo: React.FC<CircularLogoProps> = ({
    src,
    alt,
    className = '',
    size = 'md',
    bgColor = 'bg-white',
    shadow = 'md',
}) => {
    const sizeValue = typeof size === 'number' ? size : sizeMap[size];
    const shadowClass = shadowMap[shadow];

    return (
        <div
            className={`absolute top-[10px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden ${bgColor} ${shadowClass} p-1.5 ${className}`}
            style={{
                width: `${sizeValue}px`,
                height: `${sizeValue}px`,
            }}
        >
            <Picture
                src={src}
                alt={alt}
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default CircularLogo;