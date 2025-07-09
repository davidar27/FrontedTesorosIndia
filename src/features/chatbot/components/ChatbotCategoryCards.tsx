import React from 'react';
import { ProductCategory } from '../interfaces/ChatbotOptionsInterfaces';

interface ChatbotCategoryCardsProps {
    categories: ProductCategory[];
    onCategoryClick: (category: ProductCategory) => void;
}

const ChatbotCategoryCards: React.FC<ChatbotCategoryCardsProps> = ({ 
    categories, 
    onCategoryClick 
}) => {
    if (categories.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No hay categorías disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {categories.map((category) => (
                <div
                    key={category.id}
                    onClick={() => onCategoryClick(category)}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                    <div className="flex space-x-3">
                        {/* Icono de categoría */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-md flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>

                        {/* Información de la categoría */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {category.name}
                            </h4>
                            
                            {category.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {category.description}
                                </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {category.productCount || 0} productos
                                </span>
                                <span className="text-xs text-emerald-600 font-medium">
                                    Ver productos →
                                </span>
                            </div>
                        </div>

                        {/* Flecha */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-gray-400 text-sm">→</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatbotCategoryCards; 