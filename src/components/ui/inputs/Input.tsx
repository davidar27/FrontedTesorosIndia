import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FieldValidation from '../forms/FieldValidation';
import { useState } from 'react';

type InputVariant = 'default' | 'error' | 'success' | 'disabled';
type InputSize = 'sm' | 'md' | 'lg';

interface ValidationRule {
    message: string;
    isValid: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    variant?: InputVariant;
    inputSize?: InputSize;
    fullWidth?: boolean;
    rightElement?: ReactNode;
    validationRules?: ValidationRule[];
    showValidation?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            variant = 'default',
            inputSize = 'md',
            fullWidth = true,
            type,
            rightElement,
            validationRules,
            showValidation = false,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        const variantClasses = {
            default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
            disabled: 'bg-gray-100 cursor-not-allowed',
        };

        const sizeClasses = {
            sm: 'py-1 px-2 text-sm',
            md: 'py-2 px-3 text-base',
            lg: 'py-3 px-4 text-lg',
        };

        const widthClass = fullWidth ? 'w-full' : '';

        const finalClassName = `${widthClass} ${sizeClasses[inputSize]} ${variantClasses[variant]} border rounded-md shadow-sm focus:outline-none focus:ring-1 disabled:opacity-70 pr-10 ${className}`;

        return (
            <div className="relative">
                <input
                    ref={ref}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={finalClassName}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
                {rightElement && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                        {rightElement}
                    </div>
                )}
                {validationRules && (
                    <FieldValidation
                        value={props.value?.toString() || ''}
                        rules={validationRules}
                        showValidation={showValidation}
                    />
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;