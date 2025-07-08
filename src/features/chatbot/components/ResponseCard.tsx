import React from 'react';
import { ExternalLink, Package, MapPin, ShoppingBag } from 'lucide-react';
import { ParsedItem } from '../utils/ResponseParser';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';

interface ResponseCardProps {
    item: ParsedItem;
    className?: string;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ item, className = '' }) => {
    const navigate = useNavigate();

    const getIcon = () => {
        switch (item.type) {
            case 'package':
                return <Package className="w-4 h-4" />;
            case 'experience':
                return <MapPin className="w-4 h-4" />;
            case 'product':
                return <ShoppingBag className="w-4 h-4" />;
            default:
                return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getTypeLabel = () => {
        switch (item.type) {
            case 'package':
                return 'Paquete';
            case 'experience':
                return 'Experiencia';
            case 'product':
                return 'Producto';
            default:
                return 'Item';
        }
    };

    const getTypeColor = () => {
        switch (item.type) {
            case 'package':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'experience':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'product':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleClick = () => {
        navigate(item.url);
    };

    console.log(item);
    
    return (
        <div
            onClick={handleClick}
            className={`
        relative w-full rounded-lg border-2 cursor-pointer
        transition-all duration-200 hover:shadow-md hover:scale-105
        bg-white hover:bg-gray-50 overflow-hidden
        ${className}
      `}
        >
            {/* Badge de tipo */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border z-10 ${getTypeColor()}`}>
                <div className="flex items-center space-x-1">
                    {getIcon()}
                    <span>{getTypeLabel()}</span>
                </div>
            </div>

            {/* Imagen - ocupando todo el ancho */}
            <div className="w-full h-48">
                <Picture
                    src={item.image ? getImageUrl(item.image) : null}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    icon={
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            {getIcon()}
                        </div>
                    }
                />
            </div>

            {/* Contenido debajo de la imagen */}
            <div className="p-4">
                {/* Nombre */}
                <h4 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                </h4>

                {/* Descripción */}
                {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {item.description}
                    </p>
                )}

                {/* Botón de acción */}
                <button
                    className="w-full px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/80 transition-colors font-medium"
                >
                    Ver detalles
                </button>
            </div>
        </div>
    );
};

export default ResponseCard; 