import React, { ReactNode } from 'react';

interface LabelProps {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const Label: React.FC<LabelProps> = ({
    htmlFor,
    children,
    className = '',
    required = false,
    disabled = false,
    size = 'md',
    color = 'primary',
}) => {
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const colorClasses = {
        primary: 'text-gray-900 dark:text-gray-700',
        secondary: 'text-blue-600 dark:text-blue-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <label
            htmlFor={htmlFor}
            className={`block font-medium mb-1 ${sizeClasses[size]} ${colorClasses[color]} ${disabledClasses} ${className}`}
        >   
            
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

export default Label;