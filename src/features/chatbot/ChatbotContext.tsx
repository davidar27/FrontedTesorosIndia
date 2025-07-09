import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from './interfaces/IAInterfaces';
import { aiService } from './services/AIService';
import { chatbotAuthService } from './services/AuthService';
import { ChatService } from './services/ChatService';
import { ChatbotMenu, ChatbotState, ChatbotOption, ChatbotProduct, ChatbotExperience, ChatbotPackage, ProductCategory } from './interfaces/ChatbotOptionsInterfaces';
import { chatbotOptionsService } from './services/ChatbotOptionsService';
import { DetectedIntent } from './services/IntentDetectionService';

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  currentMenu: ChatbotMenu | null;
  chatbotState: ChatbotState;
  currentProducts: ChatbotProduct[];
  currentExperiences: ChatbotExperience[];
  currentPackages: ChatbotPackage[];
  currentCategories: ProductCategory[];
  detectedIntent: DetectedIntent | null;
  showGuidedContent: boolean;
  guidedContentType: 'experiences' | 'products' | 'packages' | null;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  handleOptionClick: (option: ChatbotOption) => void;
  handleProductClick: (product: ChatbotProduct) => void;
  handleExperienceClick: (experience: ChatbotExperience) => void;
  handlePackageClick: (pkg: ChatbotPackage) => void;
  handleCategoryClick: (category: ProductCategory) => void;
  handleIntentRedirect: (redirectTo: string) => void;
  showGuidedContentInChat: (type: 'experiences' | 'products' | 'packages') => void;
  hideGuidedContent: () => void;
  goBack: () => void;
  showMainMenu: () => void;
  backToCategories: () => void;
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
  const [currentCategories, setCurrentCategories] = useState<ProductCategory[]>([]);
  const [detectedIntent, setDetectedIntent] = useState<DetectedIntent | null>(null);
  const [showGuidedContent, setShowGuidedContent] = useState(false);
  const [guidedContentType, setGuidedContentType] = useState<'experiences' | 'products' | 'packages' | null>(null);

  const authContext = useAuth();
  const navigate = useNavigate();

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
  const goBack = useCallback(async () => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error('Error going back:', error);
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
            // Opción 1: Navegación interna (mantiene el estado)
            try {
              setIsOpen(false);
              navigate(option.value);
            } catch {
              // Opción 2: Nueva pestaña como fallback
              window.open(option.value, '_blank');
            }
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
  }, [goBack]);



  // Manejar clic en producto
  const handleProductClick = useCallback((product: ChatbotProduct) => {    
    // Opción 1: Navegación interna (mantiene el estado)
    try {
      setIsOpen(false);
      navigate(product.url);
    } catch {
      // Opción 2: Nueva pestaña como fallback
      window.open(product.url, '_blank');
    }
  }, [navigate]);

  // Manejar clic en experiencia
  const handleExperienceClick = useCallback((experience: ChatbotExperience) => {    
    try {
      setIsOpen(false);
      navigate(experience.url);
    } catch {
      window.open(experience.url, '_blank');
    }
  }, [navigate]);

  // Manejar clic en categoría
  const handleCategoryClick = useCallback(async (category: ProductCategory) => {
    try {
      const products = await chatbotOptionsService.getProductsByCategory(category.id.toString());
      setCurrentProducts(products);
      setShowGuidedContent(true);
      setGuidedContentType('products');
      setCurrentCategories([]); // Limpiar categorías
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, []);

  // Manejar clic en paquete
  const handlePackageClick = useCallback((pkg: ChatbotPackage) => {
    // Opción 1: Navegación interna (mantiene el estado)
    try {
      setIsOpen(false);
      navigate(pkg.url);
    } catch {
      // Opción 2: Nueva pestaña como fallback
      window.open(pkg.url, '_blank');
    }
  }, [navigate]);

  // Mostrar contenido guiado dentro del chat
  const showGuidedContentInChat = useCallback(async (type: 'experiences' | 'products' | 'packages') => {
    setIsLoading(true);
    try {
      setShowGuidedContent(true);
      setGuidedContentType(type);
      setDetectedIntent(null);

      switch (type) {
        case 'experiences': {
          const experiences = await chatbotOptionsService.getExperiences();
          setCurrentExperiences(experiences);
          break;
        }
        case 'products': {
          // Para productos, cargar categorías como contenido guiado
          const categories = await chatbotOptionsService.getProductCategories();
          setCurrentCategories(categories);
          break;
        }
        case 'packages': {
          const packages = await chatbotOptionsService.getPackages();
          setCurrentPackages(packages);
          break;
        }
      }
      
      // Mantener el estado como 'free_chat' para experiencias y paquetes
      if (type === 'experiences' || type === 'packages') {
        setChatbotState(prev => ({
          ...prev,
          currentMenu: 'free_chat'
        }));
      }
    } catch (error) {
      console.error('❌ Error showing guided content:', error);
      // En caso de error, limpiar el estado
      setShowGuidedContent(false);
      setGuidedContentType(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ocultar contenido guiado y volver al chat libre con mensaje contextual
  const hideGuidedContent = useCallback(() => {
    
    // Generar mensaje contextual basado en el tipo de contenido que se estaba mostrando
    let contextualMessage = '';
    
    switch (guidedContentType) {
      case 'experiences':
        contextualMessage = '¡Qué bueno que te interesen las experiencias culturales! ¿Te gustaría que te muestre también nuestros productos artesanales o paquetes turísticos completos? También puedes preguntarme cualquier cosa sobre Tesoros de la India.';
        break;
      case 'products':
        contextualMessage = '¡Excelente! Los productos artesanales son muy especiales. ¿Te gustaría explorar nuestras experiencias culturales o paquetes turísticos que incluyen estas artesanías? También puedes preguntarme cualquier cosa sobre Tesoros de la India.';
        break;
      case 'packages':
        contextualMessage = '¡Genial! Los paquetes turísticos son una excelente opción. ¿Te gustaría ver las experiencias individuales que incluyen estos paquetes o nuestros productos artesanales? También puedes preguntarme cualquier cosa sobre Tesoros de la India.';
        break;
      default:
        contextualMessage = '¡Perfecto! ¿En qué más puedo ayudarte? Puedes explorar experiencias culturales, productos artesanales, paquetes turísticos o preguntarme cualquier cosa sobre Tesoros de la India.';
    }

    // Crear mensaje del bot con sugerencias
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: contextualMessage,
      sender: 'bot',
      timestamp: new Date(),
    };

    // Agregar el mensaje contextual a la conversación
    setMessages(prev => [...prev, botMessage]);

    // Limpiar el contenido guiado
    setShowGuidedContent(false);
    setGuidedContentType(null);
    setCurrentMenu(null);
    setCurrentProducts([]);
    setCurrentExperiences([]);
    setCurrentPackages([]);
    setDetectedIntent(null);
    setChatbotState(prev => ({
      ...prev,
      currentMenu: 'free_chat',
      breadcrumb: prev.breadcrumb.filter(item => item !== 'Categorías' && item !== 'Productos' && item !== 'Experiencias' && item !== 'Paquetes')
    }));
  }, [guidedContentType]);

  // Volver a mostrar categorías desde productos
  const backToCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // Cargar categorías de nuevo
      const categories = await chatbotOptionsService.getProductCategories();
      setCurrentCategories(categories);
      setCurrentProducts([]); // Limpiar productos
      setShowGuidedContent(true);
      setGuidedContentType('products');
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejar redirección de intención detectada
  const handleIntentRedirect = useCallback(async (redirectTo: string) => {
    setIsLoading(true);
    try {
      // Limpiar intención detectada
      setDetectedIntent(null);

      // Ejecutar la lógica directamente según el tipo de redirección
      switch (redirectTo) {
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
          // Para productos, mostrar categorías como contenido guiado
          await showGuidedContentInChat('products');
          break;
        }

        case 'show_experiences': {
          await showGuidedContentInChat('experiences');
          break;
        }

        case 'show_packages': {
          await showGuidedContentInChat('packages');
          break;
        }
      }
    } catch (error) {
      console.error('Error handling intent redirect:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showGuidedContentInChat]);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatService) {
      console.error('Chat service not initialized');
      return;
    }

    // Ocultar contenido guiado cuando el usuario envía un nuevo mensaje
    // PERO solo si hay contenido guiado visible y no estamos cargando
    if (showGuidedContent && guidedContentType && !isLoading) {
      setShowGuidedContent(false);
      setGuidedContentType(null);
      setCurrentProducts([]);
      setCurrentExperiences([]);
      setCurrentPackages([]);
      setDetectedIntent(null);
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
      // Usar el servicio de IA que ahora puede detectar intención
      const response = await chatService.sendMessage(text, messages);
      
      if (response.intent && response.intent.confidence >= 0.7) {
        // Si la IA detecta una intención clara, mostrar botón de redirección
        setDetectedIntent(response.intent);
        
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        // Respuesta normal sin redirección
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      }
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

  // Limpiar contenido guiado cuando se cambia de modo
  // PERO solo si no estamos mostrando contenido guiado activamente
  useEffect(() => {
    
    if (chatbotState.currentMenu === 'free_chat' && showGuidedContent && !isLoading && !guidedContentType) {
      setShowGuidedContent(false);
      setGuidedContentType(null);
      setCurrentProducts([]);
      setCurrentExperiences([]);
      setCurrentPackages([]);
      setDetectedIntent(null);
    }
  }, [chatbotState.currentMenu, showGuidedContent, isLoading, guidedContentType]);

  const value: ChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    currentMenu,
    chatbotState,
    currentProducts,
    currentExperiences,
    currentPackages,
    currentCategories,
    detectedIntent,
    showGuidedContent,
    guidedContentType,
    toggleChat,
    sendMessage,
    clearMessages,
    handleOptionClick,
    handleProductClick,
    handleExperienceClick,
    handlePackageClick,
    handleCategoryClick,
    handleIntentRedirect,
    showGuidedContentInChat,
    hideGuidedContent,
    goBack,
    showMainMenu,
    backToCategories,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 