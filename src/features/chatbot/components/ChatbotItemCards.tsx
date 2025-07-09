import React from 'react';
import { ChatbotExperience, ChatbotPackage } from '../interfaces/ChatbotOptionsInterfaces';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { formatPrice } from '@/utils/formatPrice';

interface ChatbotItemCardsProps {
    items: (ChatbotExperience | ChatbotPackage)[];
    onItemClick: (item: ChatbotExperience | ChatbotPackage) => void;
    type: 'experience' | 'package';
}

const ChatbotItemCards: React.FC<ChatbotItemCardsProps> = ({
    items,
    onItemClick,
    type
}) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p className="text-sm">
                    No hay {type === 'experience' ? 'experiencias' : 'paquetes'} disponibles
                </p>
            </div>
        );
    }

    const getBadge = (item: ChatbotExperience | ChatbotPackage) => {
        if (type === 'experience') {
            const exp = item as ChatbotExperience;
            return exp.location ? `📍 ${exp.location}` : undefined;
        } else {
            const pkg = item as ChatbotPackage;
            return pkg.duration ? `⏱️ ${pkg.duration}` : undefined;
        }
    };

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                    <div className="flex space-x-3">
                        {/* Imagen */}
                        <div className="flex-shrink-0 w-16 h-16">
                            <Picture
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>

                        {/* Información */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {item.name}
                            </h4>

                            {item.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                {item.price && (
                                    <span className="text-sm font-bold text-primary">
                                        {formatPrice(item.price)}
                                    </span>
                                )}
                                {getBadge(item) && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {getBadge(item)}
                                    </span>
                                )}
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

export default ChatbotItemCards; 