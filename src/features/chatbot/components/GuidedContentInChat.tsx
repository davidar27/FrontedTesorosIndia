import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatbotProductCards from './ChatbotProductCards';
import ChatbotItemCards from './ChatbotItemCards';
import ChatbotCategoryCards from './ChatbotCategoryCards';
import { ChatbotProduct, ChatbotExperience, ChatbotPackage, ProductCategory } from '../interfaces/ChatbotOptionsInterfaces';

interface GuidedContentInChatProps {
    type: 'experiences' | 'products' | 'packages';
    products?: ChatbotProduct[];
    experiences?: ChatbotExperience[];
    packages?: ChatbotPackage[];
    categories?: ProductCategory[];
    onProductClick: (product: ChatbotProduct) => void;
    onExperienceClick: (experience: ChatbotExperience) => void;
    onPackageClick: (pkg: ChatbotPackage) => void;
    onCategoryClick?: (category: ProductCategory) => void;
    onBackToChat: () => void;
    onBackToCategories?: () => void;
}

const GuidedContentInChat: React.FC<GuidedContentInChatProps> = ({
    type,
    products = [],
    experiences = [],
    packages = [],
    categories = [],
    onProductClick,
    onExperienceClick,
    onPackageClick,
    onCategoryClick,
    onBackToChat,
    onBackToCategories
}) => {
    const getTitle = () => {
        switch (type) {
            case 'experiences':
                return 'Experiencias Culturales';
            case 'products':
                return products.length > 0 ? 'Productos de la Categoría' : 'Categorías de Productos';
            case 'packages':
                return 'Paquetes Turísticos';
            default:
                return 'Contenido';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'experiences':
                return '🌟';
            case 'products':
                return '🛍️';
            case 'packages':
                return '🎒';
            default:
                return '📋';
        }
    };

    const getItems = () => {
        switch (type) {
            case 'experiences':
                return experiences;
            case 'products':
                // Si hay productos, mostrar productos. Si no, mostrar categorías
                return products.length > 0 ? products : categories;
            case 'packages':
                return packages;
            default:
                return [];
        }
    };

    const items = getItems();
    const isShowingProducts = type === 'products' && products.length > 0;

    return (
        <div className="space-y-4">
            {/* Header del contenido guiado */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getIcon()}</span>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">
                                {getTitle()}
                            </h3>
                            <p className="text-xs text-gray-600">
                                {items.length} {
                                    type === 'experiences' ? (items.length > 1 ? 'experiencias' : 'experiencia') : 
                                    type === 'products' ? (isShowingProducts ? (items.length > 1 ? 'productos' : 'producto') : (items.length > 1 ? 'categorías' : 'categoría')) : 
                                    (items.length > 1 ? 'paquetes' : 'paquete')
                                } disponibles
                            </p>
                        </div>
                    </div>
                    
                    {/* Botón para volver al chat libre o a categorías */}
                    <button
                        onClick={() => {
                            if (isShowingProducts && onBackToCategories) {
                                onBackToCategories();
                            } else {
                                onBackToChat();
                            }
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:shadow-md font-medium"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">
                            {isShowingProducts ? 'Elegir otra categoría' : 'Ver más opciones'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Contenido específico según el tipo */}
            {type === 'products' && categories.length > 0 && (
                <ChatbotCategoryCards
                    categories={categories}
                    onCategoryClick={onCategoryClick!}
                />
            )}

            {type === 'products' && products.length > 0 && (
                <ChatbotProductCards
                    products={products}
                    onProductClick={onProductClick}
                />
            )}

            {type === 'experiences' && experiences.length > 0 && (
                <ChatbotItemCards
                    items={experiences}
                    onItemClick={(item) => {
                        if ('location' in item) {
                            onExperienceClick(item);
                        }
                    }}
                    type="experience"
                />
            )}

            {type === 'packages' && packages.length > 0 && (
                <ChatbotItemCards
                    items={packages}
                    onItemClick={(item) => {
                        if ('duration' in item) {
                            onPackageClick(item);
                        }
                    }}
                    type="package"
                />
            )}

            {/* Mensaje si no hay contenido */}
            {items.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-white/60 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-2">📭</div>
                    <p className="text-sm">
                        No hay {
                            type === 'experiences' ? 'experiencias' : 
                            type === 'products' ? (isShowingProducts ? 'productos' : 'categorías') : 
                            'paquetes'
                        } disponibles en este momento
                    </p>
                </div>
            )}

            {/* Separador visual */}
            <div className="flex items-center space-x-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="text-xs text-gray-400 px-2">
                    Haz clic en "{isShowingProducts ? 'Elegir otra categoría' : 'Ver más opciones'}" para continuar
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
        </div>
    );
};

export default GuidedContentInChat; 