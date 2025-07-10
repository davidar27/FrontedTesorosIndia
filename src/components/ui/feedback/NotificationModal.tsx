import React, { useEffect } from 'react';
import { ModalType } from '@/context/ModalContext';
import Button from '@/components/ui/buttons/Button';

interface NotificationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    showCloseButton?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    title,
    message,
    type,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000,
    showCloseButton = true,
}) => {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    const getModalStyles = () => {
        const baseStyles = 'bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up';

        switch (type) {
            case 'success':
                return `${baseStyles} border-l-4 border-green-500`;
            case 'error':
                return `${baseStyles} border-l-4 border-red-500`;
            case 'warning':
                return `${baseStyles} border-l-4 border-yellow-500`;
            case 'info':
                return `${baseStyles} border-l-4 border-blue-500`;
            default:
                return baseStyles;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                );
            case 'info':
                return (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-gray-800';
        }
    };

    const getButtonVariant = () => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'danger';
            case 'warning':
                return 'warning';
            case 'info':
                return 'primary';
            default:
                return 'primary';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={getModalStyles()}>
                <div className="flex flex-col items-center text-center">
                    {getIcon()}

                    <h3 className={`text-xl font-semibold mb-2 ${getTitleColor()}`}>
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {message}
                    </p>

                    {showCloseButton && (
                        <Button
                            variant={getButtonVariant()}
                            onClick={onClose}
                            className="min-w-[120px]"
                        >
                            Entendido
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal; 