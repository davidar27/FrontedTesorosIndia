// Componentes principales del chatbot
export { default as Chatbot } from './Chatbot';
export { default as ChatMessage } from './ChatMessage';
export { default as ChatbotNotification } from './ChatbotNotification';

// Componentes de opciones del chatbot
export { default as ChatbotOptions } from './components/ChatbotOptions';
export { default as ChatbotProductCards } from './components/ChatbotProductCards';
export { default as ChatbotItemCards } from './components/ChatbotItemCards';

// Componentes de onboarding
export { default as OnboardingProvider } from './components/OnboardingProvider';
export { default as OnboardingMessage } from './components/OnboardingMessage';

// Componentes de respuesta enriquecida
export { default as EnrichedResponse } from './components/EnrichedResponse';
export { default as ResponseCard } from './components/ResponseCard';

// Contexto
export { ChatbotProvider, useChatbot } from './ChatbotContext';

// Hooks
export { useOnboarding } from './hooks/useOnboarding';

// Utilidades
export { ResponseParser } from './utils/ResponseParser';

// Interfaces del chatbot
export type { 
  ChatMessage as ChatMessageType,
  IARequest,
  IARegisteredRequest,
  IAResponse,
  UserRole,
  CurrentUser,
  APIHistoryItem
} from './interfaces/IAInterfaces';

// Interfaces de opciones del chatbot
export type {
  ChatbotOption,
  ChatbotMenu,
  ChatbotState,
  ProductCategory,
  ChatbotProduct,
  ChatbotExperience,
  ChatbotPackage
} from './interfaces/ChatbotOptionsInterfaces';

// Interfaces de onboarding
export type {
  OnboardingMessage as OnboardingMessageType,
  OnboardingAction,
  OnboardingConfig,
  PageContext as OnboardingPageContext
} from './interfaces/OnboardingInterfaces';

// Servicios
export { aiService } from './services/AIService';
export { chatbotAuthService } from './services/AuthService';
export { ChatService } from './services/ChatService';
export { onboardingService } from './services/OnboardingService';
export { chatbotOptionsService } from './services/ChatbotOptionsService'; 