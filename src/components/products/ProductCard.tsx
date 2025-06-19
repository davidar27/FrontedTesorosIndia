import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/buttons/Button";
import { getImageUrl } from '@/features/admin/adminHelpers';
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category?: string;
  experience_id?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating / 2);
    const hasHalfStar = product.rating % 2 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} fill="currentColor" stroke="none" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<div key="half-star" className="relative inline-block" style={{ width: 18, height: 18 }}>
        <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 9, height: 18 }}>
          <Star fill="currentColor" stroke="currentColor" size={18} className="absolute left-0" />
        </div>
        <div className="absolute right-0 top-0 overflow-hidden" style={{ width: 9, height: 18 }}>
          <Star fill="none" stroke="currentColor" size={18} className="absolute right-0" />
        </div>
      </div>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} fill="none" stroke="currentColor" size={18} />);
    }

    return stars;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      whileHover={{ y: -5 }}
    >
      <div className="relative flex items-center justify-center h-48 w-full rounded-t-2xl overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product.image) || ''}
          alt={product.name}
          className="w-fit h-fit object-contain mx-auto pt-4 rounded-t-2xl "
        />
      </div>

      <div className="p-5 flex flex-col items-center gap-2">
        <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 ">
          {product.name}
        </h3>
        {product.category && (
          <span className=" bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
        <div className="flex justify-center items-center text-yellow-400">
          {renderStars()}
        </div>
        <p className="text-gray-800 font-bold text-lg">${product.price} COP</p>
        <div className="flex items-center justify-between">
          <Button type="button">
            Añadir al carrito
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;