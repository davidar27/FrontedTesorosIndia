import { Star, StarHalf } from "lucide-react"; // Asegúrate de tener `lucide-react` instalado

interface Product {
  name: string;
  price: string | number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-[#fffaf4] rounded-2xl shadow-sm p-4 text-center max-w-xs mx-auto">
      <img
        src={product.image}
        alt={product.name}
        className="w-40 h-40 object-contain mx-auto mb-4"
      />

      {/* Nombre */}
      <h3 className="font-semibold text-gray-800 text-lg mb-1">
        {product.name}
      </h3>

      {/* Estrellas */}
      <div className="flex justify-center items-center text-yellow-400 mb-2">
        <Star fill="currentColor" stroke="none" size={18} />
        <Star fill="currentColor" stroke="none" size={18} />
        <Star fill="currentColor" stroke="none" size={18} />
        <Star fill="currentColor" stroke="none" size={18} />
        <StarHalf fill="currentColor" stroke="none" size={18} />
      </div>

      {/* Precio */}
      <p className="text-gray-800 font-medium">
        A partir de <span className="font-semibold">{product.price}</span>
      </p>
    </div>
  );
};

export default ProductCard;
