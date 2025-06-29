import React from 'react';
import { ShoppingCart, Plus, Trash2, Heart, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import { Product } from '@/features/experience/types/experienceTypes';

interface ProductsSectionProps {
    products: Product[];
    editProducts: Product[];
    isEditMode: boolean;
    permissions: {
        canManageProducts: boolean;
    };
    onAddProduct?: (product: Product) => void;
    onRemoveProduct?: (productId: number) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
    products,
    editProducts,
    isEditMode,
    permissions
}) => {
    const displayProducts = isEditMode ? editProducts : products;

    return (
        <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Nuestros Productos</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {isEditMode && permissions.canManageProducts && (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Agregar Producto
                            </button>
                        )}
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 group">
                            Ver todos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="relative w-full max-w-6xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayProducts.map((product) => (
                            <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {isEditMode && permissions.canManageProducts && (
                                            <button className="p-2 bg-red-500/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        )}
                                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
                                            <Heart className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {formatPrice(product.price)}
                                        </span>
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 group">
                                            <ShoppingCart className="w-4 h-4" />
                                            <span className="hidden sm:inline">Agregar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {displayProducts.length === 0 && (
                        <div className="text-center text-gray-600 py-8">
                            No hay productos disponibles para esta experiencia
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;