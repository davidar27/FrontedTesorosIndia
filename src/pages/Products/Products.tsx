import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import { ProductsApi } from "@/services/home/products";
import { CategoriesApi } from "@/services/home/categories";
import { usePageContext } from "@/context/PageContext";

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const { searchValue } = usePageContext();
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchValue || null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataProducts: any = await ProductsApi.getProducts() || [];
                const dataCategories: any = await CategoriesApi.getCategories() || [];
                setProducts(dataProducts);
                setCategories(dataCategories);
            }
            catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const normalizeText = (text: string) => {
            return text.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        };
        let filtered = [...products];
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category === selectedCategory
            );
        }
        if (searchValue) {
            const normalizedSearch = normalizeText(searchValue);
            filtered = filtered.filter(product =>
                normalizeText(product.name).includes(normalizedSearch)
            );
        }
        setFilteredProducts(filtered);
    }, [searchValue, selectedCategory, products]);


    return (
        <div className="responsive-padding-x pt-30 bg-gradient-to-b from-white to-green-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnimatedTitle
                        title="Nuestros Productos Artesanales" align="center" mdAlign="center" />
                </motion.h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filtro de categorías */}
                    <motion.aside
                        className="w-full md:w-64 bg-white p-6 rounded-xl shadow-sm sticky top-24 h-fit"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-green-700 font-bold text-xl mb-6 pb-2 border-b border-green-100">
                            Categorías
                        </h2>
                        <ul className="space-y-3">
                            <li
                                className={`text-gray-700 px-3 py-2 rounded-lg cursor-pointer transition-all ${!selectedCategory ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-green-50'}`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Todos los productos
                            </li>
                            {categories.map((cat) => (
                                <li
                                    key={cat.id}
                                    className={`text-gray-700 px-3 py-2 rounded-lg cursor-pointer transition-all ${selectedCategory === cat.name ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-green-50'}`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    </motion.aside>

                    {/* Lista de productos */}
                    <div className="flex-1">
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
                                <p className="text-gray-500">No hay productos en esta categoría</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}