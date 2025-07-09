import React from 'react';
import { ChatbotOption } from '../interfaces/ChatbotOptionsInterfaces';

interface ChatbotOptionsProps {
    options: ChatbotOption[];
    onOptionClick: (option: ChatbotOption) => void;
    isLoading?: boolean;
}

const ChatbotOptions: React.FC<ChatbotOptionsProps> = ({ 
    options, 
    onOptionClick, 
    isLoading = false 
}) => {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {options.map((option) => {
                // No mostrar botones de volver si no hay opciones válidas
                if (option.type === 'back' && options.length <= 1) {
                    return null;
                }
                
                return (
                    <button
                        key={option.id}
                        onClick={() => onOptionClick(option)}
                        className={`
                            w-full p-3 text-left rounded-lg border-2 transition-all duration-200
                            hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                            ${option.type === 'back' 
                                ? 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700' 
                                : 'bg-white border-primary/20 hover:border-primary/40 text-gray-800'
                            }
                            ${option.type === 'main_menu' 
                                ? 'hover:bg-primary/5' 
                                : ''
                            }
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                                {option.icon && (
                                    <span className="text-lg flex-shrink-0">
                                        {option.icon}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                        {option.label}
                                    </div>
                                    {option.description && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {option.type !== 'back' && (
                                <span className="text-gray-400 text-sm">
                                    →
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ChatbotOptions; 