// Componentes principales del chatbot
export { default as Chatbot } from './Chatbot';
export { default as ChatMessage } from './ChatMessage';
export { default as ChatbotNotification } from './ChatbotNotification';

// Componentes de opciones del chatbot
export { default as ChatbotOptions } from './components/ChatbotOptions';
export { default as ChatbotProductCards } from './components/ChatbotProductCards';
export { default as ChatbotItemCards } from './components/ChatbotItemCards';
export { default as ChatbotCategoryCards } from './components/ChatbotCategoryCards';
export { default as IntentRedirectButton } from './components/IntentRedirectButton';
export { default as GuidedContentInChat } from './components/GuidedContentInChat';

// Componentes de respuesta enriquecida
export { default as EnrichedResponse } from './components/EnrichedResponse';

// Contexto
export { ChatbotProvider, useChatbot } from './ChatbotContext';

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

// Servicios
export { aiService } from './services/AIService';
export { chatbotAuthService } from './services/AuthService';
export { ChatService } from './services/ChatService';
export { chatbotOptionsService } from './services/ChatbotOptionsService';
export type { DetectedIntent, IntentFromBackend } from './services/IntentDetectionService'; 