import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ProductsApi, deleteProduct } from '@/services/product/productServie';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import ProductHeader from '@/features/products/components/ProductHeader';
import ProductImageGallery from '@/features/products/components/ProductImageGallery';
import ProductInfo from '@/features/products/components/ProductInfo';

import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import ProductNotFound from '@/features/products/components/ProductNotFound';
import { ProductDetail as ProductDetailType } from '@/features/products/types/ProductDetailTypes';
import CTASection from '@/features/experience/components/CTASection';
import ReviewsSection from '@/features/experience/components/ReviewsSection';
import { Review } from '@/features/experience/types/experienceTypes';
import { CategoriesApi } from '@/services/home/categories';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { handleAddToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState<ProductDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const productData = await ProductsApi.getProductById(parseInt(id));
                const categories = await CategoriesApi.getCategories();
                setReviews(productData.reviews || []);
                setProduct(productData);
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCartAction = async () => {
        if (!user || user.role !== "cliente") {
            setShowLoginModal(true);
            return;
        }

        if (!product) return;

        setIsAddingToCart(true);
        try {
            await handleAddToCart({
                service_id: product.product_id,
                product_id: product.product_id,
                name: product.name,
                price: Number(product.price),
                quantity: quantity,
                stock: product.stock,
                priceWithTax: Number(product.priceWithTax),
                image: product.image,
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (product) {
            setQuantity(Math.max(1, Math.min(product.stock, newQuantity)));
        }
    };

    const handleProductUpdate = (updatedProduct: ProductDetailType) => {
        setProduct(updatedProduct);
        setIsEditing(false);
    };

    const handleEditModeChange = (editing: boolean) => {
        setIsEditing(editing);
    };

    const handleDeleteProduct = async () => {
        if (!product) return;

        setIsDeleting(true);
        try {
            await deleteProduct(product.product_id);
            toast.success('Producto eliminado correctamente');
            // Redirigir a la página de productos
            navigate('/productos');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error al eliminar el producto');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!product) {
        return <ProductNotFound onGoBack={() => navigate('/productos')} />;
    }

    return (
        <div className="bg-gray-50 responsive-padding-y">
            <ProductHeader
                product={product}
                onGoBack={() => navigate(-2)}
            />

            <div className="container mx-auto responsive-padding-x py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProductImageGallery
                            product={product}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                            isEditing={isEditing}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProductInfo
                            product={product}
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                            onAddToCart={handleAddToCartAction}
                            isAddingToCart={isAddingToCart}
                            categories={categories}
                            canManageProducts={user?.role === 'emprendedor'}
                            onProductUpdate={handleProductUpdate}
                            onEditModeChange={handleEditModeChange}
                            onDeleteProduct={() => setShowDeleteConfirm(true)}
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <ReviewsSection
                        reviews={reviews}
                        stats={product.stats}
                        setReviews={setReviews}
                        entity="producto"
                        experienceId={product.product_id}
                    />

                    <CTASection
                        product={product}
                        isProduct={true}
                        setReviews={setReviews}
                    />
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

            <ConfirmDialog
                open={showDeleteConfirm}
                title="¿Eliminar producto?"
                description={`¿Estás seguro de que quieres eliminar "${product.name}"? Esta acción cambiará el estado del producto a inactivo.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                onConfirm={handleDeleteProduct}
                onCancel={() => setShowDeleteConfirm(false)}
                loading={isDeleting}
                className='!backdrop-blur-none bg-black/60'
            />
        </div>
    );
};

export default ProductDetail;