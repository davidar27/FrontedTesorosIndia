/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage } from './IAInterfaces';
import { DetectedIntent } from '../services/IntentDetectionService';

export interface ChatbotOption {
    id: string;
    label: string;
    type: 'main_menu' | 'category' | 'product' | 'experience' | 'package' | 'back' | 'custom';
    action: 'navigate' | 'show_categories' | 'show_products' | 'show_experiences' | 'show_packages' | 'go_back' | 'custom';
    value?: string;
    icon?: string;
    description?: string;
}

export interface ChatbotMenu {
    id: string;
    title: string;
    options: ChatbotOption[];
    isMainMenu?: boolean;
}

export interface ChatbotState {
    currentMenu: string;
    selectedCategory?: string;
    selectedProduct?: string;
    selectedExperience?: string;
    selectedPackage?: string;
    breadcrumb: string[];
}

export interface ProductCategory {
    id: number;
    name: string;
    description?: string;
    productCount?: number;
}

export interface ChatbotProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category: string;
    url: string;
    salesRank?: number; // Ranking de ventas (para productos más vendidos)
    totalSold?: number; // Cantidad total vendida (para productos más vendidos)
}

export interface ChatbotExperience {
    id: number;
    name: string;
    description?: string;
    price?: number;
    image?: string;
    location?: string;
    url: string;
}

export interface ChatbotPackage {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    duration?: string;
    url: string;
}

export interface ChatbotContextType {
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
    customData: any[];
    showCustomData: 'top_products' | 'total_income' | null;
    setCustomData: React.Dispatch<React.SetStateAction<any[]>>;
    setShowCustomData: React.Dispatch<React.SetStateAction<'top_products' | 'total_income' | null>>;
} 