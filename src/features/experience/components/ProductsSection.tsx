import React from 'react';
import { ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { Product } from '@/features/products/components/ProductCard';
import ProductCard from '@/features/products/components/ProductCard';
import { useNavigate, useParams } from 'react-router-dom';

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
    permissions,
}) => {
    const displayProducts = isEditMode ? editProducts : products;
    const navigate = useNavigate();
    const { experience_id } = useParams();
    return (
        <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl py-6 px-8">
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
                        <button
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 group cursor-pointer"
                            onClick={() => navigate(`/productos/?search=${experience_id}`)}
                        >
                            Ver todos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="relative w-full max-w-6xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">

                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
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