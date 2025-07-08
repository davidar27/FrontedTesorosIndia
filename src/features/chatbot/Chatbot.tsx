import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import IATesorito from '@/assets/icons/IATesorito.webp';
import ChatMessage from '@/features/chatbot/ChatMessage';
import ChatbotNotification from '@/features/chatbot/ChatbotNotification';
import { ChatbotProvider, useChatbot } from '@/features/chatbot/ChatbotContext';
import Picture from '../../components/ui/display/Picture';
import './styles/responseCards.css';

interface ChatbotProps {
    className?: string;
}

const ChatbotComponent: React.FC<ChatbotProps> = ({ className = '' }) => {
    const { isOpen, toggleChat, messages, sendMessage, isLoading } = useChatbot();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Picture src={IATesorito} alt="Tesoros India" className="w-12 h-12 text-white" />
                            <div>
                                <h3 className="font-semibold text-sm">Tesorito</h3>
                                <p className="text-xs text-white/80">Asistente virtual</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm">
                                <p>¡Hola! Soy Tesorito, tu asistente virtual de Tesoros India.</p>
                                <p className="mt-1">¿En qué puedo ayudarte hoy?</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <ChatMessage key={index} message={message} />
                            ))
                        )}
                        {isLoading && (
                            <div className="flex items-center space-x-2 text-gray-500">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-xs">Escribiendo...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative"
                >
                    <Picture src={IATesorito} alt="Tesoros India" className="w-12 h-12" />

                    <ChatbotNotification />
                </button>
            )}
        </div>
    );
};

// Wrapper component that provides the context
const Chatbot: React.FC<ChatbotProps> = (props) => {
    return (
        <ChatbotProvider>
            <ChatbotComponent {...props} />
        </ChatbotProvider>
    );
};

export default Chatbot; 