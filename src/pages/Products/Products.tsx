import ProductCard from "@/components/products/ProductCard";
import imgCafe from "@/assets/images/cafetalero-bolsa-sola-tag.webp"
const categories = ["Café", "Comida", "Comida", "Comida"];

const products = [
    {
        name: "Café Especial Cafetalero",
        price: "$6.500",
        image: imgCafe
    },
    // ... puedes agregar más productos
];

export default function ProductList() {
    return (
        <div className="flex flex-col  responsive-padding-x bg-gray-50 min-h-screen py-40">
            <aside className="w-full md:w-1/5 mb-6 md:mb-0 md:mr-6">
                <h2 className="text-green-600 font-semibold text-lg mb-4">Categorías</h2>
                <ul className="space-y-2">
                    {categories.map((cat, i) => (
                        <li key={i} className="text-gray-700 hover:text-green-700 cursor-pointer">
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="min-h-screen bg-gray-100 py-8 px-4">
                <h1 className="text-2xl font-bold text-center text-green-700 mb-8">Nuestros Productos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>

        

        </div>


    );
}
