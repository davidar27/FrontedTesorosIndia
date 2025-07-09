import React from 'react';
import { ChatbotProduct } from '../interfaces/ChatbotOptionsInterfaces';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { formatPrice } from '@/utils/formatPrice';

interface ChatbotProductCardsProps {
    products: ChatbotProduct[];
    onProductClick: (product: ChatbotProduct) => void;
}

const ChatbotProductCards: React.FC<ChatbotProductCardsProps> = ({ 
    products, 
    onProductClick 
}) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No hay productos disponibles en esta categoría</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {products.map((product) => (
                <div
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                    <div className="flex space-x-3">
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0 w-16 h-16">
                            <Picture
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {product.name}
                            </h4>
                            
                            {product.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {product.description}
                                </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-bold text-primary">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {product.category}
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

export default ChatbotProductCards; 