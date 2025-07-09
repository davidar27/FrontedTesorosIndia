import React from 'react';
import { ArrowRight } from 'lucide-react';

interface IntentRedirectButtonProps {
    message: string;
    buttonText: string;
    onClick: () => void;
    isLoading?: boolean;
}

const IntentRedirectButton: React.FC<IntentRedirectButtonProps> = ({
    message,
    buttonText,
    onClick,
    isLoading = false
}) => {
    return (
        <div className="space-y-3">
            {/* Mensaje del bot */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                    {message}
                </p>
            </div>

            {/* Botón de redirección */}
            <button
                onClick={() => {
                    setTimeout(() => {
                        onClick();
                    }, 100);
                }}
                disabled={isLoading}
                className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
                <span className="font-medium">{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default IntentRedirectButton; 