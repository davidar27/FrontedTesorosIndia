import React from 'react';

interface AnimatedTitleProps {
    title: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
    mdAlign?: 'left' | 'center' | 'right'; 
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    underlineWidth?: 'sm' | 'md' | 'lg';
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
    title,
    color = '#00A650',
    align = 'center',
    mdAlign = 'left', 
    size = 'xl',
    className = '',
    underlineWidth = 'md'
}) => {
    const sizeClasses = {
        sm: 'text-2xl md:text-3xl',
        md: 'text-3xl md:text-4xl',
        lg: 'text-4xl md:text-5xl',
        xl: 'text-4xl md:text-5xl'
    };

    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    const underlineWidthClasses = {
        sm: 'w-1/6 group-hover:w-1/4',
        md: 'w-1/6 group-hover:w-1/3',
        lg: 'w-1/6 group-hover:w-1/2'
    };

    return (
        <div className={`group ${alignClasses[align]} md:${alignClasses[mdAlign]} ${className}`}>
            <h2
                className={`${sizeClasses[size]}  font-bold transform transition-all duration-300 group-hover:-translate-y-1`}
                style={{ color }}
            >
                {title}
                <span
                    className={`block h-1 mt-3 transition-all duration-500 ${underlineWidthClasses[underlineWidth]} ${align === 'center' ? 'mx-auto' : 'ml-0'}`}
                    style={{ backgroundColor: color }}
                ></span>
            </h2>
        </div>
    );
};

export default AnimatedTitle;