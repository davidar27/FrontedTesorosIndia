import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from './interfaces/IAInterfaces';
import { aiService } from './services/AIService';
import { chatbotAuthService } from './services/AuthService';
import { ChatService } from './services/ChatService';
import { ChatbotMenu, ChatbotState, ChatbotOption, ChatbotProduct, ChatbotExperience, ChatbotPackage } from './interfaces/ChatbotOptionsInterfaces';
import { chatbotOptionsService } from './services/ChatbotOptionsService';

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  currentMenu: ChatbotMenu | null;
  chatbotState: ChatbotState;
  currentProducts: ChatbotProduct[];
  currentExperiences: ChatbotExperience[];
  currentPackages: ChatbotPackage[];
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  handleOptionClick: (option: ChatbotOption) => void;
  handleProductClick: (product: ChatbotProduct) => void;
  handleExperienceClick: (experience: ChatbotExperience) => void;
  handlePackageClick: (pkg: ChatbotPackage) => void;
  goBack: () => void;
  showMainMenu: () => void;
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
  const [currentMenu, setCurrentMenu] = useState<ChatbotMenu | null>(null);
  const [chatbotState, setChatbotState] = useState<ChatbotState>({
    currentMenu: 'main_menu',
    breadcrumb: ['Menú Principal']
  });
  const [currentProducts, setCurrentProducts] = useState<ChatbotProduct[]>([]);
  const [currentExperiences, setCurrentExperiences] = useState<ChatbotExperience[]>([]);
  const [currentPackages, setCurrentPackages] = useState<ChatbotPackage[]>([]);
  
  const authContext = useAuth();

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

  // Mostrar menú principal al abrir el chat
  const showMainMenu = useCallback(async () => {
    setIsLoading(true);
    try {
      const mainMenu = chatbotOptionsService.getMainMenu();
      setCurrentMenu(mainMenu);
      setChatbotState({
        currentMenu: 'main_menu',
        breadcrumb: ['Menú Principal']
      });
    } catch (error) {
      console.error('Error loading main menu:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejar clic en opción
  const handleOptionClick = useCallback(async (option: ChatbotOption) => {
    setIsLoading(true);
    try {
      switch (option.action) {
        case 'show_categories': {
          const categoriesMenu = await chatbotOptionsService.getCategoriesMenu();
          setCurrentMenu(categoriesMenu);
          setChatbotState(prev => ({
            ...prev,
            currentMenu: 'categories_menu',
            breadcrumb: [...prev.breadcrumb, 'Categorías']
          }));
          break;
        }

        case 'show_products': {
          if (option.value) {
            const products = await chatbotOptionsService.getProductsByCategory(option.value);
            setCurrentProducts(products);
            setCurrentMenu(null);
            setChatbotState(prev => ({
              ...prev,
              currentMenu: 'products_display',
              selectedCategory: option.value,
              breadcrumb: [...prev.breadcrumb, 'Productos']
            }));
          }
          break;
        }

        case 'show_experiences': {
          const experiences = await chatbotOptionsService.getExperiences();
          setCurrentExperiences(experiences);
          setCurrentMenu(null);
          setChatbotState(prev => ({
            ...prev,
            currentMenu: 'experiences_display',
            breadcrumb: [...prev.breadcrumb, 'Experiencias']
          }));
          break;
        }

        case 'show_packages': {
          const packages = await chatbotOptionsService.getPackages();
          setCurrentPackages(packages);
          setCurrentMenu(null);
          setChatbotState(prev => ({
            ...prev,
            currentMenu: 'packages_display',
            breadcrumb: [...prev.breadcrumb, 'Paquetes']
          }));
          break;
        }

        case 'navigate':
          if (option.value) {
            window.location.href = option.value;
          }
          break;

        case 'custom':
          if (option.value === 'open_free_chat') {
            setCurrentMenu(null);
            setChatbotState(prev => ({
              ...prev,
              currentMenu: 'free_chat',
              breadcrumb: [...prev.breadcrumb, 'Chat Libre']
            }));
            setMessages([]);
          }
          break;

        case 'go_back':
          goBack();
          break;
      }
    } catch (error) {
      console.error('Error handling option click:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goBack = useCallback(async () => {
    setIsLoading(true);
    try {
      if (chatbotState.breadcrumb.length === 1 && chatbotState.breadcrumb[0] === 'Menú Principal') {
        return;
      }

      const newBreadcrumb = [...chatbotState.breadcrumb];
      newBreadcrumb.pop();

      if (newBreadcrumb.length === 1 && newBreadcrumb[0] === 'Menú Principal') {
        const mainMenu = chatbotOptionsService.getMainMenu();
        setCurrentMenu(mainMenu);
        setChatbotState({
          currentMenu: 'main_menu',
          breadcrumb: ['Menú Principal']
        });
        setMessages([]);
        setCurrentProducts([]);
        setCurrentExperiences([]);
        setCurrentPackages([]);
      } else if (newBreadcrumb.length > 0 && newBreadcrumb[newBreadcrumb.length - 1] === 'Categorías') {
        const categoriesMenu = await chatbotOptionsService.getCategoriesMenu();
        setCurrentMenu(categoriesMenu);
        setChatbotState(prev => ({
          ...prev,
          currentMenu: 'categories_menu',
          breadcrumb: newBreadcrumb
        }));
        setCurrentProducts([]);
      } else if (newBreadcrumb.length > 0 && newBreadcrumb[newBreadcrumb.length - 1] === 'Productos') {
        const categoriesMenu = await chatbotOptionsService.getCategoriesMenu();
        setCurrentMenu(categoriesMenu);
        setChatbotState(prev => ({
          ...prev,
          currentMenu: 'categories_menu',
          breadcrumb: newBreadcrumb
        }));
        setCurrentProducts([]);
      } else {
        const mainMenu = chatbotOptionsService.getMainMenu();
        setCurrentMenu(mainMenu);
        setChatbotState({
          currentMenu: 'main_menu',
          breadcrumb: ['Menú Principal']
        });
        setMessages([]);
        setCurrentProducts([]);
        setCurrentExperiences([]);
        setCurrentPackages([]);
      }
    } catch (error) {
      console.error('Error going back:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatbotState.breadcrumb]);

  // Manejar clic en producto
  const handleProductClick = useCallback((product: ChatbotProduct) => {
    window.location.href = product.url;
  }, []);

  // Manejar clic en experiencia
  const handleExperienceClick = useCallback((experience: ChatbotExperience) => {
    window.location.href = experience.url;
  }, []);

  // Manejar clic en paquete
  const handlePackageClick = useCallback((pkg: ChatbotPackage) => {
    window.location.href = pkg.url;
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

  // Mostrar menú principal cuando se abre el chat
  useEffect(() => {
    if (isOpen && !currentMenu && chatbotState.currentMenu === 'main_menu') {
      showMainMenu();
    }
  }, [isOpen, currentMenu, chatbotState.currentMenu, showMainMenu]);

  const value: ChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    currentMenu,
    chatbotState,
    currentProducts,
    currentExperiences,
    currentPackages,
    toggleChat,
    sendMessage,
    clearMessages,
    handleOptionClick,
    handleProductClick,
    handleExperienceClick,
    handlePackageClick,
    goBack,
    showMainMenu,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 