import { Star, Eye, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../../components/ui/buttons/Button";
import { getImageUrl } from '@/utils/getImageUrl';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import { formatPrice } from "@/utils/formatPrice";

export interface Product {
  id: number;
  name: string;
  name_product?: string;
  price: string;
  image: string;
  rating: number;
  category?: string;
  experience_id?: number;
  stock: number;
  priceWithTax: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { handleAddToCart } = useCart();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user || user.role !== "cliente") {
      setShowLoginModal(true);
      return;
    }

    setIsAddingToCart(true);
    try {
      await handleAddToCart({
        service_id: product.id,
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        stock: product.stock,
        priceWithTax: Number(product.priceWithTax),
        image: product.image,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

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
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        whileHover={{ y: -5 }}
      >
        <div className="relative flex items-center justify-center h-48 w-full rounded-t-2xl overflow-hidden bg-gray-100 group">
          <img
            src={getImageUrl(product.image) || ''}
            alt={product.name}
            className="w-fit h-fit object-contain mx-auto pt-4 rounded-t-2xl"
          />

          {/* Overlay mejorado con múltiples opciones */}
          <div className="absolute inset-0 bg-black/80 flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 group-hover:flex md:group-hover:flex transition-all duration-300 z-10 touch:opacity-100 touch:flex">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <Button
                onClick={() => navigate(`/productos/${product.id}/detalles`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
              >
                <Eye className="w-4 h-4" />
                Ver detalles
              </Button>
              {/* Indicador de stock bajo */}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-yellow-300 text-xs font-medium bg-yellow-600/20 px-2 py-1 rounded-full">
                  ¡Solo quedan {product.stock}!
                </span>
              )}
            </motion.div>
          </div>
        </div>

        <div className="p-5 flex flex-col items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 text-center">
            {product.name}
          </h3>

          {product.category && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}

          <div className="flex justify-center items-center text-yellow-400">
            {
              product.rating > 0 ? renderStars() : <p>Sin calificación</p>
            }
          </div>

          <p className="text-gray-800 font-bold text-lg">{formatPrice(product.priceWithTax)}</p>

          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              onClick={handleAdd}
              disabled={isAddingToCart || product.stock <= 0}
              className={`flex-1 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? 'Añadiendo...' : product.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}
            </Button>
          </div>
        </div>

        <ConfirmDialog
          open={showLoginModal}
          title="¡Hola! Para agregar al carrito, ingresa a tu cuenta"
          description="Debes iniciar sesión para poder añadir productos al carrito."
          confirmText="Iniciar sesión"
          cancelText="Cerrar"
          onConfirm={() => navigate('/auth/iniciar-sesion')}
          onCancel={() => setShowLoginModal(false)}
        />
      </motion.div>
    </>
  );
};

export default ProductCard;