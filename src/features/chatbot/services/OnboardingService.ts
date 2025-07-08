import {
    OnboardingProvider,
    PageContext,
    OnboardingMessage,
    OnboardingAction,
    OnboardingConfig
} from '../interfaces/OnboardingInterfaces';
import { aiService } from './AIService';

export class OnboardingService implements OnboardingProvider {
    private config: OnboardingConfig = {
        enabled: true,
        delay: 5, // 5 segundos
        autoShow: true,
        maxMessages: 3,
        userPreferences: {
            skipOnboarding: false,
            showPageGuides: true,
            showFeatureHighlights: true
        }
    };

    async getWelcomeMessage(context: PageContext): Promise<OnboardingMessage> {
        const prompt = `
      Eres Tesorito, el asistente virtual de Tesoros India. 
      
      Contexto del usuario:
      - Página actual: ${context.currentPage}
      - Rol: ${context.userRole}
      - Autenticado: ${context.isAuthenticated ? 'Sí' : 'No'}
      
      Genera un mensaje de bienvenida amigable y contextual que:
      1. Se presente como Tesorito
      2. Explique brevemente qué puede hacer
      3. Ofrezca ayuda específica según la página actual
      4. Sea conciso (máximo 2-3 frases)
      5. Tenga un tono cálido y acogedor
      
      Responde solo con el mensaje, sin formato adicional.
    `;

        try {
            const response = await aiService.getResponse({
                prompt,
                history: []
            });

            return {
                id: `welcome-${Date.now()}`,
                type: 'welcome',
                title: '¡Hola! Soy Tesorito 👋',
                content: response.text,
                actions: this.getWelcomeActions(context),
                autoClose: false,
                delay: 0
            };
        } catch  {
            return this.getDefaultWelcomeMessage(context);
        }
    }

    async getPageGuide(context: PageContext): Promise<OnboardingMessage> {
        const prompt = `
      Eres Tesorito, el asistente virtual de Tesoros India.
      
      Contexto:
      - Página: ${context.currentPage}
      - Título: ${context.pageTitle}
      - Descripción: ${context.pageDescription}
      - Rol del usuario: ${context.userRole}
      
      Genera una guía breve y útil para esta página específica que:
      1. Explique qué se puede hacer en esta página
      2. Mencione las características principales
      3. Ofrezca consejos útiles
      4. Sea específica para el rol del usuario
      5. Sea concisa (máximo 3-4 frases)
      
      Responde solo con el mensaje, sin formato adicional.
    `;

        try {
            const response = await aiService.getResponse({
                prompt,
                history: []
            });

            return {
                id: `guide-${Date.now()}`,
                type: 'page_guide',
                title: `Guía de ${context.pageTitle}`,
                content: response.text,
                actions: this.getPageGuideActions(context),
                autoClose: true,
                delay: 10000 // 10 segundos
            };
        } catch {
            return this.getDefaultPageGuide(context);
        }
    }

    async getFeatureHighlights(context: PageContext): Promise<OnboardingMessage[]> {
        const features = this.getPageFeatures(context.currentPage);

        return features.map((feature, index) => ({
            id: `feature-${index}-${Date.now()}`,
            type: 'feature_highlight',
            title: feature.title,
            content: feature.description,
            actions: feature.actions,
            autoClose: true,
            delay: 8000 // 8 segundos
        }));
    }

    shouldShowOnboarding(context: PageContext): boolean {
        if (!this.config.enabled) return false;
        if (this.config.userPreferences.skipOnboarding) return false;

        // No mostrar en páginas de autenticación
        if (context.currentPage.includes('/auth/')) return false;

        // No mostrar en páginas de error
        if (context.currentPage.includes('/error/')) return false;

        return true;
    }

    private getWelcomeActions(context: PageContext): OnboardingAction[] {
        const actions: OnboardingAction[] = [
            {
                id: 'explore',
                label: 'Explorar el sitio',
                action: 'explain',
                value: 'explore',
                description: 'Te explico cómo navegar por Tesoros India'
            },
            {
                id: 'chat',
                label: 'Chatear conmigo',
                action: 'custom',
                value: 'open_chat',
                description: 'Abrir el chat para hacer preguntas'
            }
        ];

        // Agregar acciones específicas según la página
        if (context.currentPage === '/') {
            actions.push({
                id: 'experiences',
                label: 'Ver experiencias',
                action: 'navigate',
                value: '/experiencias',
                description: 'Explorar experiencias culturales'
            });
        }

        return actions;
    }

    private getPageGuideActions(context: PageContext): OnboardingAction[] {
        const actions: OnboardingAction[] = [
            {
                id: 'dismiss',
                label: 'Entendido',
                action: 'dismiss',
                description: 'Cerrar este mensaje'
            }
        ];

        // Agregar acciones específicas según la página
        switch (context.currentPage) {
            case '/experiencias':
                actions.push({
                    id: 'filter',
                    label: 'Aprender a filtrar',
                    action: 'explain',
                    value: 'filter_experiences',
                    description: 'Te explico cómo filtrar experiencias'
                });
                break;
            case '/productos':
                actions.push({
                    id: 'search',
                    label: 'Aprender a buscar',
                    action: 'explain',
                    value: 'search_products',
                    description: 'Te explico cómo buscar productos'
                });
                break;
        }

        return actions;
    }

    private getPageFeatures(page: string): Array<{
        title: string;
        description: string;
        actions: OnboardingAction[];
    }> {
        const features: Record<string, Array<{
            title: string;
            description: string;
            actions: OnboardingAction[];
        }>> = {
            '/': [
                {
                    title: 'Experiencias Únicas',
                    description: 'Descubre actividades culturales auténticas de la India',
                    actions: [{ id: 'learn', label: 'Saber más', action: 'explain', value: 'experiences' }]
                },
                {
                    title: 'Productos Artesanales',
                    description: 'Encuentra productos únicos y tradicionales',
                    actions: [{ id: 'learn', label: 'Saber más', action: 'explain', value: 'products' }]
                }
            ],
            '/experiencias': [
                {
                    title: 'Filtros Inteligentes',
                    description: 'Filtra por categoría, precio y ubicación',
                    actions: [{ id: 'learn', label: 'Aprender', action: 'explain', value: 'filters' }]
                }
            ],
            '/productos': [
                {
                    title: 'Búsqueda Avanzada',
                    description: 'Encuentra productos específicos fácilmente',
                    actions: [{ id: 'learn', label: 'Aprender', action: 'explain', value: 'search' }]
                }
            ]
        };

        return features[page] || [];
    }

    private getDefaultWelcomeMessage(context: PageContext): OnboardingMessage {
        return {
            id: `welcome-default-${Date.now()}`,
            type: 'welcome',
            title: '¡Hola! Soy Tesorito 👋',
            content: `¡Bienvenido a Tesoros India! Soy tu guía virtual y estoy aquí para ayudarte a descubrir las maravillas culturales de la India. ¿En qué puedo ayudarte hoy?`,
            actions: this.getWelcomeActions(context),
            autoClose: false,
            delay: 0
        };
    }

    private getDefaultPageGuide(context: PageContext): OnboardingMessage {
        return {
            id: `guide-default-${Date.now()}`,
            type: 'page_guide',
            title: `Guía de ${context.pageTitle}`,
            content: `En esta página puedes explorar y descubrir todo lo que Tesoros India tiene para ofrecer. ¡No dudes en preguntarme si necesitas ayuda!`,
            actions: this.getPageGuideActions(context),
            autoClose: true,
            delay: 10000
        };
    }

    // Métodos para configurar el servicio
    updateConfig(newConfig: Partial<OnboardingConfig>) {
        this.config = { ...this.config, ...newConfig };
    }

    getUserPreferences() {
        return this.config.userPreferences;
    }

    updateUserPreferences(preferences: Partial<OnboardingConfig['userPreferences']>) {
        this.config.userPreferences = { ...this.config.userPreferences, ...preferences };
    }
}

// Instancia singleton
export const onboardingService = new OnboardingService(); 