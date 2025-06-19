import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import { ProductsApi } from "@/services/home/products";
import { CategoriesApi } from "@/services/home/categories";
import { usePageContext } from "@/context/PageContext";
import { Product } from "@/components/products/ProductCard";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";
import { ExperiencesApi } from "@/services/home/experiences";

interface Category {
    id: number;
    name: string;
}

interface FilterState {
    category: string | null;
    experience: string | null;
    priceRange: {
        min: number;
        max: number;
    };
    rating: number | null;
    sortBy: 'name' | 'price' | 'rating';
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const { searchValue } = usePageContext();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [filters, setFilters] = useState<FilterState>({
        category: searchValue || null,
        experience: null,
        priceRange: { min: 0, max: 1000000 },
        rating: null,
        sortBy: 'name'
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [dataProducts, dataCategories, dataExperiences] = await Promise.all([
                    ProductsApi.getProducts(),
                    CategoriesApi.getCategories(),
                    ExperiencesApi.getExperiences()
                ]);
                
                setProducts(dataProducts || []);
                setCategories(dataCategories || []);
                setExperiences(dataExperiences || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const normalizeText = (text: string) => {
            return text.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        };

        let filtered = [...products];

        // Filtrar por categoría
        if (filters.category) {
            filtered = filtered.filter(product => 
                product.category === filters.category
            );
        }

        // Filtrar por experiencia (si los productos tienen relación con experiencias)
        if (filters.experience) {
            filtered = filtered.filter(product =>{
                const experience = experiences.find(e => e.id === product.experience_id);
                return experience?.name_experience === filters.experience;
            })
        }

        // Filtrar por precio
        filtered = filtered.filter(product => {
            const price = typeof product.price === 'string' 
                ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
                : Number(product.price) || 0;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });

        // Filtrar por calificación
        if (filters.rating) {
            filtered = filtered.filter(product => 
                product.rating >= filters.rating!
            );
        }

        // Filtrar por búsqueda
        if (searchValue) {
            const normalizedSearch = normalizeText(searchValue);
            filtered = filtered.filter(product => {
                const name = product.name || '';
                return normalizeText(name).includes(normalizedSearch);
            });
        }

        // Ordenar resultados
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price': {
                    const priceA = typeof a.price === 'string' 
                        ? parseFloat(a.price.replace(/[^\d.-]/g, '')) 
                        : Number(a.price) || 0;
                    const priceB = typeof b.price === 'string' 
                        ? parseFloat(b.price.replace(/[^\d.-]/g, '')) 
                        : Number(b.price) || 0;
                    return priceA - priceB;
                }
                case 'rating': {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                }
                default: { // name
                    const nameA = a.name || '';
                    const nameB = b.name || '';
                    return nameA.localeCompare(nameB);
                }
            }
        });

        setFilteredProducts(filtered);
    }, [searchValue, filters, products, experiences]);

    const handleFilterChange = (key: keyof FilterState, value: string | number | null | { min: number; max: number }) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: null,
            experience: null,
            priceRange: { min: 0, max: 1000000 },
            rating: null,
            sortBy: 'name'
        });
    };

    if (isLoading) {
        return (
            <div className="responsive-padding-x pt-30 bg-gradient-to-b from-white to-green-50 min-h-screen py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="responsive-padding-x pt-30 bg-gradient-to-b from-white to-green-50 min-h-screen py-16">
            <div className="mx-auto">
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnimatedTitle
                        title="Nuestros Productos Artesanales" align="center" mdAlign="center" />
                </motion.h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de filtros mejorado */}
                    <motion.aside
                        className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm sticky top-24 h-fit"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-green-100">
                            <h2 className="text-green-700 font-bold text-xl">Filtros</h2>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-green-600 hover:text-green-800 underline"
                            >
                                Limpiar
                            </button>
                        </div>

                        {/* Categorías */}
                        <div className="mb-6">
                            <h3 className="text-green-700 font-semibold mb-3">Categorías</h3>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={!filters.category}
                                        onChange={() => handleFilterChange('category', null)}
                                        className="mr-2 text-green-600"
                                    />
                                    <span className="text-gray-700">Todas las categorías</span>
                                </label>
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.name}
                                            checked={filters.category === cat.name}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="mr-2 text-green-600"
                                        />
                                        <span className="text-gray-700">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Experiencias */}
                        <div className="mb-6">
                            <h3 className="text-green-700 font-semibold mb-3">Experiencias</h3>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="experience"
                                        checked={!filters.experience}
                                        onChange={() => handleFilterChange('experience', null)}
                                        className="mr-2 text-green-600"
                                    />
                                    <span className="text-gray-700">Todas las experiencias</span>
                                </label>
                                {experiences.map((experience) => (
                                    <label key={experience.id} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={experience.name_experience}
                                            checked={filters.experience === experience.name_experience}
                                            onChange={(e) => handleFilterChange('experience', e.target.value)}
                                            className="mr-2 text-green-600"
                                        />
                                        <span className="text-gray-700">{experience.name_experience}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rango de precio */}
                        <div className="mb-6">
                            <h3 className="text-green-700 font-semibold mb-3">Rango de precio</h3>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Mín"
                                        value={filters.priceRange.min}
                                        onChange={(e) => handleFilterChange('priceRange', {
                                            ...filters.priceRange,
                                            min: Number(e.target.value) || 0
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Máx"
                                        value={filters.priceRange.max}
                                        onChange={(e) => handleFilterChange('priceRange', {
                                            ...filters.priceRange,
                                            max: Number(e.target.value) || 1000000
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Calificación */}
                        <div className="mb-6">
                            <h3 className="text-green-700 font-semibold mb-3">Calificación mínima</h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={rating}
                                            checked={filters.rating === rating}
                                            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                                            className="mr-2 text-green-600"
                                        />
                                        <span className="text-gray-700">
                                            {rating}+ estrellas
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Ordenar por */}
                        <div className="mb-6">
                            <h3 className="text-green-700 font-semibold mb-3">Ordenar por</h3>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="name">Nombre</option>
                                <option value="price">Precio</option>
                                <option value="rating">Calificación</option>
                            </select>
                        </div>
                    </motion.aside>

                    {/* Lista de productos */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <p className="text-gray-500 mb-2">No se encontraron productos</p>
                                <p className="text-sm text-gray-400">
                                    Intenta ajustar los filtros o realizar una búsqueda diferente
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}