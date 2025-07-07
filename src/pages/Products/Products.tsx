import ProductCard from "@/features/products/components/ProductCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import { ProductsApi } from "@/services/home/products";
import { CategoriesApi } from "@/services/home/categories";
import { usePageContext } from "@/context/PageContext";
import { Product } from "@/features/products/components/ProductCard";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";
import { ExperiencesApi } from "@/services/home/experiences";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FilterSidebarContent from "@/features/products/components/FilterSidebarContent";
import { X } from "lucide-react";
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
    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get("search") || "";
    const navigate = useNavigate();
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        category: null,
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
                    ProductsApi.getProducts(searchParam || undefined),
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
    }, [searchParam]);

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
            filtered = filtered.filter(product => {
                const experience = experiences.find(e => e.id === product.experience_id);
                return experience?.name_experience === filters.experience;
            })
        }

        // Filtrar por precio
        filtered = filtered.filter(product => {
            const price = Number(product.price || product.priceWithTax) || 0;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });

        // Filtrar por calificación
        if (filters.rating) {
            filtered = filtered.filter(product =>
                product.rating >= filters.rating!
            );
        }

        // Filtrar por búsqueda
        const effectiveSearch = searchParam || searchValue;
        if (effectiveSearch) {
            const normalizedSearch = normalizeText(effectiveSearch);
            filtered = filtered.filter(product => {
                const name = product.name || '';
                const experience_id = product.experience_id || '';
                return normalizeText(name).includes(normalizedSearch) || normalizeText(experience_id.toString()).includes(normalizedSearch);
            });
        }

        // Ordenar resultados
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price': {
                    const priceA = Number(a.price || a.priceWithTax) || 0;
                    const priceB = Number(b.price || b.priceWithTax) || 0;
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
    }, [searchParam, searchValue, filters, products, experiences]);

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

                {/* Botón para mostrar filtros en mobile */}


                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de filtros para desktop */}
                    <motion.aside
                        className="hidden lg:block w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm sticky top-24 h-fit"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FilterSidebarContent
                            filters={filters}
                            categories={categories}
                            experiences={experiences}
                            handleFilterChange={handleFilterChange}
                            clearFilters={clearFilters}
                            searchParam={searchParam}
                            navigate={navigate}
                        />
                    </motion.aside>

                    {/* Panel de filtros para mobile */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 lg:hidden">
                            <motion.div
                                className="bg-white w-11/12 max-w-sm p-6 rounded-xl shadow-lg relative"
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="absolute top-1 right-1 text-gray-500 hover:text-green-600"
                                    aria-label="Cerrar filtros"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                                <FilterSidebarContent
                                    filters={filters}
                                    categories={categories}
                                    experiences={experiences}
                                    handleFilterChange={handleFilterChange}
                                    clearFilters={clearFilters}
                                    searchParam={searchParam}
                                    navigate={navigate}
                                />
                            </motion.div>
                        </div>
                    )}

                    {/* Lista de productos */}
                    <div className="flex-1 space-y-4 z-10">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">
                                Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                            </p>
                            <div className="lg:hidden flex justify-end items-center">
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow"
                                >
                                    Filtros
                                </button>
                            </div>
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