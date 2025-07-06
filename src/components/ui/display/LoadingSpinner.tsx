import clsx from 'clsx';
import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type SpinnerPosition = 'center' | 'inline' | 'overlay';

export interface LoadingSpinnerProps {
    message?: string;
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    position?: SpinnerPosition;
    show?: boolean;
    className?: string;
    containerClassName?: string;
    messageClassName?: string;
    speed?: 'slow' | 'normal' | 'fast';
    overlayBg?: string;
}

// Configuraciones de tamaños
const sizeConfig: Record<SpinnerSize, { spinner: string; text: string; border: string }> = {
    xs: { spinner: 'h-4 w-4', text: 'text-xs', border: 'border-2' },
    sm: { spinner: 'h-6 w-6', text: 'text-sm', border: 'border-2' },
    md: { spinner: 'h-8 w-8', text: 'text-base', border: 'border-[3px]' },
    lg: { spinner: 'h-12 w-12', text: 'text-lg', border: 'border-4' },
    xl: { spinner: 'h-16 w-16', text: 'text-xl', border: 'border-4' }
};

// Configuraciones de variantes de color
const variantConfig: Record<SpinnerVariant, string> = {
    primary: 'border-gray-200 border-t-primary',
    secondary: 'border-gray-200 border-t-gray-600',
    success: 'border-gray-200 border-t-green-600',
    error: 'border-gray-200 border-t-red-600',
    warning: 'border-gray-200 border-t-yellow-600'
};

// Configuraciones de velocidad
const speedConfig: Record<NonNullable<LoadingSpinnerProps['speed']>, string> = {
    slow: 'animate-spin [animation-duration:2s]',
    normal: 'animate-spin [animation-duration:1s]',
    fast: 'animate-spin [animation-duration:0.5s]'
};

// Configuraciones de posición
const positionConfig: Record<SpinnerPosition, string> = {
    center: 'flex flex-col items-center justify-center min-h-[200px]',
    inline: 'flex items-center gap-2',
    overlay: 'fixed inset-0 flex flex-col items-center justify-center z-50'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Cargando...",
    size = 'md',
    variant = 'primary',
    position = 'center',
    show = true,
    className = '',
    containerClassName = '',
    messageClassName = '',
    speed = 'normal',
    overlayBg = 'bg-white/80 backdrop-blur-sm',
}) => {
    // No renderizar si show es false
    if (!show) return null;

    const sizeClasses = sizeConfig[size];
    const variantClasses = variantConfig[variant];
    const speedClass = speedConfig[speed];
    const positionClass = positionConfig[position];

    // Clases del spinner
    const spinnerClasses = clsx(
        sizeClasses.spinner,
        sizeClasses.border,
        variantClasses,
        speedClass,
        'rounded-full',
        className
    );

    // Clases del contenedor según la posición
    const containerClasses = clsx(
        positionClass,
        position === 'overlay' && overlayBg,
        containerClassName
    );

    // Clases del mensaje
    const messageClasses = clsx(
        sizeClasses.text,
        'text-gray-600 font-medium',
        position === 'inline' ? 'ml-2' : 'mt-3',
        messageClassName
    );

    return (
        <div className={containerClasses}>
            <div className={spinnerClasses} />
            {message && (
                <p className={messageClasses}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;