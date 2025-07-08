import React from 'react';
import { useChatbot } from '@/features/chatbot/ChatbotContext';

interface ChatbotNotificationProps {
    className?: string;
}

const ChatbotNotification: React.FC<ChatbotNotificationProps> = ({ className = '' }) => {
    const { isOpen, messages } = useChatbot();

    // Solo mostrar notificación si el chat está cerrado y hay mensajes
    if (isOpen || messages.length === 0) {
        return null;
    }

    return (
        <div className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center ${className}`}>
            <span className="text-xs text-white font-bold">
                {messages.length > 9 ? '9+' : messages.length}
            </span>
        </div>
    );
};

export default ChatbotNotification; 