import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from './interfaces/IAInterfaces';
import { aiService } from './services/AIService';
import { chatbotAuthService } from './services/AuthService';
import { ChatService } from './services/ChatService';

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  
  const authContext = useAuth();

  // Inicializar servicios cuando el contexto de auth esté disponible
  useEffect(() => {
    if (authContext) {
      chatbotAuthService.setAuthContext(authContext);
      const service = new ChatService(aiService, chatbotAuthService);
      setChatService(service);
    }
  }, [authContext]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatService) {
      console.error('Chat service not initialized');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(text, messages);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chatService, messages]);

  const value: ChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    toggleChat,
    sendMessage,
    clearMessages,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 