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