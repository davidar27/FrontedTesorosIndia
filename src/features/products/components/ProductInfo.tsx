// components/ProductInfo.tsx
import { ShoppingCart, Share2, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { formatPrice } from '@/utils/formatPrice';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import StarRating from '@/features/products/components/StarRating';

interface ProductInfoProps {
    product: ProductDetail;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    isAddingToCart: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    isAddingToCart
}) => {
    const handleShare = () => {
        navigator.share?.({
            title: product.name,
            url: window.location.href
        });
    };

    return (
        <div className="bg-white rounded-2xl p-7 shadow-sm space-y-4">
            {/* Etiquetas */}
            <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {product.category || 'Sin categoría'}
                </span>
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                        ¡Solo quedan {product.stock}!
                    </span>
                )}
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Calificación */}
            <div className="flex items-center gap-2">
                <StarRating
                    rating={product.rating / 2}
                    reviewCount={product.reviews?.length || 0}
                />
            </div>

            {/* Precio */}
            <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600">
                    {formatPrice(Number(product.price))}
                </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Información de experiencia */}
            {product.name_experience && (
                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800">De la Experiencia:</h3>
                    <p className="text-green-700">{product.name_experience}</p>
                    {product.location && (
                        <p className="text-green-600 text-sm">{product.location}</p>
                    )}
                </div>
            )}

            {/* Selector de cantidad */}
            <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={() => onQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <span className="text-gray-500 text-sm">
                    {product.stock} disponibles
                </span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
                <Button
                    onClick={onAddToCart}
                    disabled={isAddingToCart || product.stock <= 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                </Button>

                <Button
                    onClick={handleShare}
                    className="p-3"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default ProductInfo;