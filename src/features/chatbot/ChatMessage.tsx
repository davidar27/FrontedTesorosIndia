import React from 'react';
import { ChatMessage as ChatMessageType } from '@/features/chatbot/interfaces/IAInterfaces';
import EnrichedResponse from './components/EnrichedResponse';

interface ChatMessageProps {
    message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    const formattedTime = message.timestamp.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
            >
                {isUser ? (
                    // Mensaje del usuario - solo texto
                    <p className="text-sm leading-relaxed">{message.text}</p>
                ) : (
                    // Mensaje del bot - puede ser enriquecido
                    <EnrichedResponse response={message.text} />
                )}
                
                <p
                    className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'
                        }`}
                >
                    {formattedTime}
                </p>
            </div>
        </div>
    );
};

export default ChatMessage; 