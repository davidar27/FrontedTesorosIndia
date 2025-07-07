import React from 'react';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { SpinnerVariant } from '@/components/ui/display/LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'disabled' | 'cancel';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    messageLoading?: string;
    variantLoading?: string;
}


const BUTTON_VARIANTS = {
    primary: 'bg-green-500 border-2 border-green-500 hover:bg-white  hover:text-green-500 hover:border-green-500 hover:border-2 text-white disabled:bg-green-50 disabled:text-green-400 disabled:border-green-500',
    secondary: 'bg-blue-200 border-2 border-blue-200 hover:bg-white  hover:text-blue-400 hover:border-blue-500 hover:border-2 text-blue-500 disabled:bg-blue-50 disabled:text-blue-400 disabled:border-blue-500',
    danger: 'bg-red-100 border-2 border-red-100 hover:bg-red-200 text-red-700 disabled:bg-red-50 disabled:text-red-400',
    success: 'bg-green-100 hover:bg-green-200 border-green-100 text-green-700 disabled:bg-green-50 disabled:text-green-400',
    warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 disabled:bg-yellow-50 disabled:text-yellow-400',
    disabled: 'bg-gray-500 border-2 border-gray-500 hover:bg-white  hover:text-gray-500 hover:border-gray-500 hover:border-2 text-white disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-500',
    cancel: 'text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors bg-gray-100',
};




export default function Button({
    children,
    className = '',
    variant = 'primary',
    fullWidth = false,
    loading = false,
    icon,
    messageLoading = '',
    variantLoading = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                transition-all duration-200 font-medium text-sm
                ${BUTTON_VARIANTS[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <LoadingSpinner
                    size='xs'
                    position='inline'
                    message={messageLoading}
                    variant={variantLoading as SpinnerVariant}
                />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}
