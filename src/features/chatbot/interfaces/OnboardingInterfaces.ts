export interface PageContext {
  currentPage: string;
  pageTitle: string;
  pageDescription: string;
  userRole: UserRole;
  isAuthenticated: boolean;
}

export interface OnboardingMessage {
  id: string;
  type: 'welcome' | 'page_guide' | 'feature_highlight' | 'interactive_help';
  title: string;
  content: string;
  actions?: OnboardingAction[];
  autoClose?: boolean;
  delay?: number;
}

export interface OnboardingAction {
  id: string;
  label: string;
  action: 'navigate' | 'explain' | 'dismiss' | 'custom';
  value?: string;
  description?: string;
}

export interface OnboardingConfig {
  enabled: boolean;
  delay: number; // segundos antes de mostrar el mensaje
  autoShow: boolean;
  maxMessages: number;
  userPreferences: {
    skipOnboarding: boolean;
    showPageGuides: boolean;
    showFeatureHighlights: boolean;
  };
}

export type UserRole = 'cliente' | 'emprendedor' | 'administrador' | 'observador';

export interface OnboardingProvider {
  getWelcomeMessage(context: PageContext): Promise<OnboardingMessage>;
  getPageGuide(context: PageContext): Promise<OnboardingMessage>;
  getFeatureHighlights(context: PageContext): Promise<OnboardingMessage[]>;
  shouldShowOnboarding(context: PageContext): boolean;
} 