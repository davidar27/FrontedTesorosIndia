import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageContext } from '@/context/PageContext';
import useAuth from '@/context/useAuth';
import { 
  OnboardingMessage, 
  OnboardingAction, 
  PageContext as OnboardingPageContext 
} from '../interfaces/OnboardingInterfaces';
import { onboardingService } from '../services/OnboardingService';

export const useOnboarding = () => {
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasShownPageGuide, setHasShownPageGuide] = useState(false);
  
  const location = useLocation();
  const { pageInfo } = usePageContext();
  const authContext = useAuth();

  // Crear contexto de página para el onboarding
  const createPageContext = useCallback((): OnboardingPageContext => {
    return {
      currentPage: location.pathname,
      pageTitle: pageInfo?.title || 'Tesoros India',
      pageDescription: pageInfo?.description || 'Descubre las maravillas de la India',
      userRole: authContext.user?.role || 'observador',
      isAuthenticated: authContext.isAuthenticated || false
    };
  }, [location.pathname, pageInfo, authContext]);

  // Verificar si debe mostrar onboarding
  const shouldShowOnboarding = useCallback(() => {
    const context = createPageContext();
    return onboardingService.shouldShowOnboarding(context);
  }, [createPageContext]);

  // Mostrar mensaje de bienvenida
  const showWelcomeMessage = useCallback(async () => {
    if (hasShownWelcome) return;

    const context = createPageContext();
    const welcomeMessage = await onboardingService.getWelcomeMessage(context);
    
    setMessages(prev => [...prev, welcomeMessage]);
    setHasShownWelcome(true);
    setIsActive(true);
  }, [createPageContext, hasShownWelcome]);

  // Mostrar guía de página
  const showPageGuide = useCallback(async () => {
    if (hasShownPageGuide) return;

    const context = createPageContext();
    const pageGuide = await onboardingService.getPageGuide(context);
    
    setMessages(prev => [...prev, pageGuide]);
    setHasShownPageGuide(true);
    setIsActive(true);
  }, [createPageContext, hasShownPageGuide]);

  // Mostrar highlights de características
  const showFeatureHighlights = useCallback(async () => {
    const context = createPageContext();
    const features = await onboardingService.getFeatureHighlights(context);
    
    setMessages(prev => [...prev, ...features]);
    setIsActive(true);
  }, [createPageContext]);

  // Manejar acciones de los mensajes
  const handleMessageAction = useCallback((action: OnboardingAction) => {
    switch (action.action) {
      case 'navigate':
        if (action.value) {
          window.location.href = action.value;
        }
        break;
      
      case 'explain':
        // Aquí podrías abrir el chat con una explicación específica
        console.log('Explicar:', action.value);
        break;
      
      case 'custom':
        if (action.value === 'open_chat') {
          // Aquí podrías abrir el chat
          console.log('Abrir chat');
        }
        break;
      
      case 'dismiss':
        // El mensaje se cierra automáticamente
        break;
      
      default:
        console.log('Acción no manejada:', action);
    }
  }, []);

  // Cerrar mensaje específico
  const closeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // Si no hay más mensajes, desactivar onboarding
    if (messages.length <= 1) {
      setIsActive(false);
    }
  }, [messages.length]);

  // Cerrar todos los mensajes
  const closeAllMessages = useCallback(() => {
    setMessages([]);
    setIsActive(false);
  }, []);

  // Inicializar onboarding cuando cambia la página
  useEffect(() => {
    if (!shouldShowOnboarding()) return;
    
    // Mostrar mensaje de bienvenida después de 5 segundos
    const welcomeTimer = setTimeout(() => {
      showWelcomeMessage();
    }, 5000);

    // Mostrar guía de página después de 8 segundos
    const guideTimer = setTimeout(() => {
      showPageGuide();
    }, 8000);

    // Mostrar highlights después de 12 segundos
    const featuresTimer = setTimeout(() => {
      showFeatureHighlights();
    }, 12000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(guideTimer);
      clearTimeout(featuresTimer);
    };
  }, [location.pathname, shouldShowOnboarding, showWelcomeMessage, showPageGuide, showFeatureHighlights]);

  // Limpiar mensajes cuando cambia la página
  useEffect(() => {
    setMessages([]);
    setIsActive(false);
    setHasShownPageGuide(false);
  }, [location.pathname]);

  return {
    messages,
    isActive,
    handleMessageAction,
    closeMessage,
    closeAllMessages,
    showWelcomeMessage,
    showPageGuide,
    showFeatureHighlights
  };
}; 