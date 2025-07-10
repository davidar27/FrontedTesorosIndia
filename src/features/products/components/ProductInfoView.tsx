import { ShoppingCart, Share2, Plus, Minus, Edit, Trash2 } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import StarRating from '@/features/experience/components/reviews/StarRating';
import Button from '@/components/ui/buttons/Button';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';

interface ProductInfoViewProps {
    product: ProductDetail;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    isAddingToCart: boolean;
    canManageProducts: boolean;
    onEditClick: () => void;
    onDeleteProduct?: () => void;
}

const ProductInfoView = ({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    isAddingToCart,
    canManageProducts,
    onEditClick,
    onDeleteProduct,
}: ProductInfoViewProps) => {
    const handleShare = () => {
        navigator.share?.({
            title: product.name,
            url: window.location.href
        });
    };

    return (
        <div className="bg-white p-7 space-y-4 rounded-lg">
            {/* Etiquetas y botón de edición */}
            <div className="flex items-center flex-col md:flex-row justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {product.category || 'Sin categoría'}
                    </span>
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                            ¡Solo quedan {product.stock}!
                        </span>
                    )}
                </div>

                {canManageProducts && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEditClick}
                            className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Editar producto"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </button>
                        {onDeleteProduct && (
                            <button
                                onClick={onDeleteProduct}
                                className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Eliminar producto"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Calificación */}
            <div className="flex items-center gap-2">
                <StarRating rating={product.rating / 2} />
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
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                        aria-label="Reducir cantidad"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= product.stock}
                        aria-label="Aumentar cantidad"
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
                    {isAddingToCart ? 'Añadiendo...' : product.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}
                </Button>

                <Button
                    onClick={handleShare}
                    className="p-3"
                    aria-label="Compartir producto"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default ProductInfoView;