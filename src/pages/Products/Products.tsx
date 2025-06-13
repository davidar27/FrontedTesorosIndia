import ProductCard from "@/components/products/ProductCard";
import imgCafe from "@/assets/images/cafetalero-bolsa-sola-tag.webp";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedTitle from "@/components/ui/display/AnimatedTitle";
import { ProductsApi } from "@/services/home/products";

const categories = ["Café", "Miel", "Artesanías", "Productos Orgánicos"];

const products = [
    {
        id: 1,
        name: "Café Especial Cafetalero",
        price: "$6.500",
        image: imgCafe,
        rating: 4.5,
        category: "Café"
    },
    {
        id: 2,
        name: "Café Premium Reserva",
        price: "$16.500",
        image: imgCafe,
        rating: 5,
        category: "Café"
    },
    {
        id: 3,
        name: "Miel de Abejas Nativas",
        price: "$8.200",
        image: imgCafe,
        rating: 4,
        category: "Miel"
    },
    {
        id: 4,
        name: "Chocolate Artesanal",
        price: "$12.000",
        image: imgCafe,
        rating: 4.5,
        category: "Productos Orgánicos"
    },
];

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const dataProducts: any = await ProductsApi.getProducts() || [];

                console.log(dataProducts);

                setProducts(dataProducts);
            }
            catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchProducts();
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

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
                            {categories.map((cat, i) => (
                                <li
                                    key={i}
                                    className={`text-gray-700 px-3 py-2 rounded-lg cursor-pointer transition-all ${selectedCategory === cat ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-green-50'}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
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