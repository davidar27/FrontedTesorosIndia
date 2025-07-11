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
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';

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
  customData: unknown[];
  showCustomData: 'top_products' | 'total_income' | null;
  setCustomData: React.Dispatch<React.SetStateAction<unknown[]>>;
  setShowCustomData: React.Dispatch<React.SetStateAction<'top_products' | 'total_income' | null>>;
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
  const [customData, setCustomData] = useState<unknown[]>([]);
  const [showCustomData, setShowCustomData] = useState<'top_products' | 'total_income' | null>(null);

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

  const showMainMenu = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await chatService?.getCurrentUser();
      const userRole = currentUser?.role || 'observador';
      const mainMenu = chatbotOptionsService.getMainMenu(userRole);
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
  }, [chatService]);

  const goBack = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await chatService?.getCurrentUser();
      const userRole = currentUser?.role || 'observador';
      const mainMenu = chatbotOptionsService.getMainMenu(userRole);
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
  }, [chatService]);

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
          data: response.data // <-- ahora permitido por la interfaz
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        // Respuesta normal sin redirección
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date()
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
          } else if (option.value === 'show_top_products') {
            const currentUser = await chatService?.getCurrentUser();
            const userId = currentUser?.id?.toString() || '';
            const topProducts = await chatbotOptionsService.getTopProducts(userId);
            setCurrentProducts(topProducts);
            setCurrentMenu(null);
            setChatbotState(prev => ({
              ...prev,
              currentMenu: 'top_products_display',
              breadcrumb: [...prev.breadcrumb, 'Productos Más Vendidos']
            }));
          } else if (option.value === 'show_total_income') {
            const currentUser = await chatService?.getCurrentUser();
            const userId = currentUser?.id?.toString() || '';
            const response = await chatbotOptionsService.getTotalIncome(userId);
            setCustomData([response]);
            setShowCustomData('total_income');
            setCurrentMenu(null);
            setChatbotState(prev => ({
              ...prev,
              currentMenu: 'total_income_display',
              breadcrumb: [...prev.breadcrumb, 'Total de Ingresos']
            }));
          } else if (option.value === 'generate_report') {
            const currentUser = await chatService?.getCurrentUser();
            const userId = currentUser?.id || '';
            if (userId) {
                setIsLoading(true);
                try {
                    // Usa axiosInstance para la petición
                    const response = await (await import('@/api/axiosInstance')).axiosInstance.get(`/IA/reportes/descargar?userId=${userId}`, {
                        responseType: 'blob'
                    });
                    const blob = response.data;
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = 'informe_experiencia.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(downloadUrl);
                    // Mensaje de éxito en el chat
                    const botMessage: ChatMessage = {
                        id: Date.now().toString(),
                        text: '¡El informe PDF se ha descargado correctamente!',
                        sender: 'bot',
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, botMessage]);
                } catch {
                    await sendMessage('Ocurrió un error al descargar el informe.');
                } finally {
                    setIsLoading(false);
                }
            }
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
  }, [goBack, sendMessage]);



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

        case 'show_top_products': {
          const currentUser = await chatService?.getCurrentUser();
          const userId = currentUser?.id?.toString() || '';
          const topProducts = await chatbotOptionsService.getTopProducts(userId);
          setCurrentProducts(topProducts);
          setCurrentMenu(null);
          setChatbotState(prev => ({
            ...prev,
            currentMenu: 'top_products_display',
            breadcrumb: [...prev.breadcrumb, 'Productos Más Vendidos']
          }));
          break;
        }
        case 'show_top_products_by_experience': {
          const lastBotMsg = messages.filter(m => m.sender === 'bot').slice(-1)[0];
          if (lastBotMsg && Array.isArray(lastBotMsg.data)) {
            setCustomData(lastBotMsg.data);
            setShowCustomData('top_products');
          }
          break;
        }
        case 'show_total_income_by_experience': {
          const lastBotMsg = messages.filter(m => m.sender === 'bot').slice(-1)[0];
          if (lastBotMsg && Array.isArray(lastBotMsg.data)) {
            setCustomData(lastBotMsg.data);
            setShowCustomData('total_income');
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error handling intent redirect:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showGuidedContentInChat, messages]);

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
    customData,
    showCustomData,
    setCustomData,
    setShowCustomData,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      {showCustomData === 'top_products' && customData.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-gray-800">Top 3 productos más vendidos</h4>
          <ul>
            {customData.map((item, idx) => {
              const prod = item as { product_id: number; product_name: string; total_sold: string };
              return (
                <li key={prod.product_id} className="p-2 border-b">
                  <span className="font-semibold">{idx + 1}. {prod.product_name}</span>
                  <span className="ml-2 text-gray-600">Vendidos: {prod.total_sold}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {chatbotState.currentMenu === 'total_income_display' && showCustomData === 'total_income' && customData.length > 0 && (
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-yellow-50 to-amber-100 rounded-xl p-4 shadow-sm border border-yellow-200">
            <h3 className="font-bold text-gray-800 text-base mb-2">
              💰 Total de dinero ingresado
            </h3>
            <p className="text-lg text-gray-700 font-semibold mb-1">
              {(customData[0] as { experienceName: string }).experienceName}
            </p>
            <p className="text-2xl text-green-700 font-bold mb-2">
              {formatPrice((customData[0] as { totalIncome: string | number }).totalIncome as number) }
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mx-auto"></div>
          </div>
          <button
            onClick={() => goBack()}
            className="w-full p-3 text-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md hover:border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al menú principal</span>
          </button>
        </div>
      )}
    </ChatbotContext.Provider>
  );
}; 