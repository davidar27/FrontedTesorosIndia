import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ArrowRight, Info } from 'lucide-react';
import { OnboardingMessage as OnboardingMessageType, OnboardingAction } from '../interfaces/OnboardingInterfaces';
import IATesorito from '@/assets/icons/IATesorito.webp';
import Picture from '@/components/ui/display/Picture';

interface OnboardingMessageProps {
    message: OnboardingMessageType;
    onAction: (action: OnboardingAction) => void;
    onClose: () => void;
    position?: 'top-right' | 'bottom-right' | 'center';
}

const OnboardingMessage: React.FC<OnboardingMessageProps> = ({
    message,
    onAction,
    onClose,
    position = 'bottom-right'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Mostrar con delay si está configurado
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, message.delay || 0);

        return () => clearTimeout(timer);
    }, [message.delay]);

    useEffect(() => {
        // Auto-cerrar si está configurado
        if (message.autoClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, message.delay || 10000);

            return () => clearTimeout(timer);
        }
    }, [message.autoClose, message.delay]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleAction = (action: OnboardingAction) => {
        onAction(action);
        if (action.action === 'dismiss') {
            handleClose();
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'center':
                return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            default:
                return 'bottom-4 right-4';
        }
    };

    const getMessageTypeStyles = () => {
        switch (message.type) {
            case 'welcome':
                return 'bg-gradient-to-r from-primary to-primary/80 text-white border-primary/20';
            case 'page_guide':
                return 'bg-blue-50 border-blue-200 text-blue-900';
            case 'feature_highlight':
                return 'bg-green-50 border-green-200 text-green-900';
            case 'interactive_help':
                return 'bg-purple-50 border-purple-200 text-purple-900';
            default:
                return 'bg-white border-gray-200 text-gray-900';
        }
    };

    const getIcon = () => {
        switch (message.type) {
            case 'welcome':
                return <Picture src={IATesorito} alt="Tesorito" className="w-8 h-8" />;
            case 'page_guide':
                return <Info className="w-6 h-6 text-blue-600" />;
            case 'feature_highlight':
                return <ArrowRight className="w-6 h-6 text-green-600" />;
            case 'interactive_help':
                return <MessageCircle className="w-6 h-6 text-purple-600" />;
            default:
                return <Info className="w-6 h-6" />;
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full`}>
            <div
                className={`
          relative p-4 rounded-lg shadow-2xl border-2 
          transform transition-all duration-300 ease-out
          ${getMessageTypeStyles()}
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
            >
                {/* Botón de cerrar */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-tight">
                            {message.title}
                        </h3>
                    </div>
                </div>

                {/* Contenido */}
                <div className="mb-4">
                    <p className="text-sm leading-relaxed">
                        {message.content}
                    </p>
                </div>

                {/* Acciones */}
                {message.actions && message.actions.length > 0 && (
                    <div className="space-y-2">
                        {message.actions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleAction(action)}
                                className={`
                  w-full px-3 py-2 text-sm rounded-lg transition-all duration-200
                  ${message.type === 'welcome'
                                        ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                                    }
                  hover:shadow-md active:scale-95
                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{action.label}</span>
                                    {action.description && (
                                        <span className="text-xs opacity-75">
                                            {action.description}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Indicador de progreso para auto-close */}
                {message.autoClose && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
                        <div
                            className="h-full bg-current opacity-30 transition-all duration-linear"
                            style={{
                                animation: `progress ${message.delay || 10000}ms linear forwards`
                            }}
                        />
                    </div>
                )}
            </div>

            <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
};

export default OnboardingMessage; 