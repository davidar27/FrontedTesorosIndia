import React, { useState } from 'react';
import { Star, StarHalf, ShoppingCart, Filter, Search } from 'lucide-react';

// Mock image - en tu proyecto real usarías la importación de imagen
const imgCafe = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop";

interface Product {
    id: number;
    name: string;
    price: string | number;
    image: string;
    category: string;
    rating: number;
    description?: string;
    discount?: number;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onToggleFavorite?: (productId: number) => void;
    isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={i}
                    fill="currentColor"
                    stroke="none"
                    size={16}
                    className="text-amber-400"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarHalf
                    key="half"
                    fill="currentColor"
                    stroke="none"
                    size={16}
                    className="text-amber-400"
                />
            );
        }

        return stars;
    };

    return (
        <div
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${isHovered ? 'scale-105' : 'scale-100'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
        

           
            {/* Imagen del producto */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-8 h-64">
                <div className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`} />

                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                )}

                <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-all duration-700 transform ${isHovered ? 'scale-110 rotate-3' : 'scale-100'
                        } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6 space-y-4">
                {/* Categoría */}
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-semibold rounded-full">
                    {product.category}
                </span>

                {/* Nombre del producto */}
                <h3 className="font-bold text-gray-800 text-xl leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                    {product.name}
                </h3>

                {/* Descripción */}
                {product.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-500 text-sm">({product.rating})</span>
                </div>

                {/* Precio y botón */}
                <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                        {product.discount && (
                            <p className="text-gray-400 line-through text-sm">
                                ${(typeof product.price === 'string' ?
                                    parseInt(product.price.replace(/[^\d]/g, '')) :
                                    product.price
                                )}
                            </p>
                        )}
                        <p className="text-gray-900 font-bold text-xl">
                            {typeof product.price === 'string' ? product.price : `$${product.price.toLocaleString()}`}
                        </p>
                    </div>

                    <button
                        onClick={() => onAddToCart?.(product)}
                        className={`bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 ${isHovered ? 'translate-x-0 opacity-100' : ''
                            }`}
                    >
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">Agregar</span>
                    </button>
                </div>
            </div>

            {/* Efecto de brillo en hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full transition-transform duration-1000 ${isHovered ? 'translate-x-full' : ''
                }`} />
        </div>
    );
};

const categories = [
    { id: 'all', name: 'Todos', count: 12 },
    { id: 'cafe', name: 'Café', count: 8 },
    { id: 'comida', name: 'Comida', count: 4 },
    { id: 'bebidas', name: 'Bebidas', count: 6 },
    { id: 'postres', name: 'Postres', count: 3 }
];

const products: Product[] = [
    {
        id: 1,
        name: "Café Especial Cafetalero Premium",
        price: "6.500",
        image: imgCafe,
        category: "Café",
        rating: 4.5,
        description: "Café de alta calidad con notas florales y frutales, cultivado en las montañas colombianas.",
        discount: 15
    },
    {
        id: 2,
        name: "Café Especial Cafetalero Artesanal",
        price: "8.200",
        image: imgCafe,
        category: "Café",
        rating: 4.8,
        description: "Proceso artesanal único que resalta los sabores naturales del grano."
    },
    {
        id: 3,
        name: "Café Orgánico Supremo",
        price: "12.000",
        image: imgCafe,
        category: "Café",
        rating: 5.0,
        description: "Certificado orgánico, comercio justo y sostenible.",
        discount: 20
    },
    {
        id: 4,
        name: "Blend Especial de la Casa",
        price: "7.800",
        image: imgCafe,
        category: "Café",
        rating: 4.3,
        description: "Mezcla perfecta de granos arábigos seleccionados."
    }
];

export default function ProductList() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' ||
            product.category.toLowerCase() === categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

   

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 pt-20">
            {/* Header con búsqueda */}
            <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Nuestros Productos
                            </h1>
                            <p className="text-gray-600 mt-2">Descubre nuestra selección de cafés premium</p>
                        </div>

                        {/* Barra de búsqueda */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                        </div>

                        {/* Botón de filtros móvil */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden bg-emerald-500 text-white rounded-2xl px-6 py-3 flex items-center gap-2 hover:bg-emerald-600 transition-colors"
                        >
                            <Filter size={20} />
                            Filtros
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de categorías */}
                    <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 sticky top-32">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                                Categorías
                            </h2>
                            <ul className="space-y-3">
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${selectedCategory === cat.id
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                                                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105'
                                                }`}
                                        >
                                            <span className="font-medium">{cat.name}</span>
                                            <span className={`text-sm px-2 py-1 rounded-full ${selectedCategory === cat.id
                                                    ? 'bg-white/20'
                                                    : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                                                }`}>
                                                {cat.count}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </aside>

                    {/* Grid de productos */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">☕</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
                                <p className="text-gray-500">Intenta cambiar los filtros o el término de búsqueda</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <p className="text-gray-600">
                                        Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                           
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}








