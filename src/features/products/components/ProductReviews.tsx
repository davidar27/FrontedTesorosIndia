import { motion } from 'framer-motion';
import Avatar from '@/components/ui/display/Avatar';
import { ProductDetail, Review } from '@/features/products/types/ProductDetailTypes';
import StarRating from '@/features/products/components/StarRating';

interface ProductReviewsProps {
    product: ProductDetail;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
    if (!product.reviews || product.reviews.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Reseñas</h3>
                <div className="text-center text-gray-500">
                    <p>No hay reseñas para este producto.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
        >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reseñas</h3>
            <div className="space-y-4">
                {product.reviews.map((review) => (
                    <ReviewItem key={review.review_id} review={review} reviewCount={product.reviews?.length || 0} />
                ))}
            </div>
        </motion.div>
    );
};

interface ReviewItemProps {
    review: Review;
    reviewCount: number;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, reviewCount }) => {
    return (
        <div className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-center gap-3 mb-2">
                <Avatar
                    src={review.user_image || ''}
                    name={review.user_name}
                    size={40}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{review.user_name}</span>
                        <div className="flex items-center text-yellow-400">
                            <StarRating rating={review.rating / 2} reviewCount={reviewCount} size={16} />
                        </div>
                    </div>
                    <span className="text-gray-400 text-xs">
                        {review.review_date}
                    </span>
                </div>
            </div>
            {review.review && (
                <p className="text-gray-600 text-sm ml-13">{review.review}</p>
            )}
        </div>
    );
};

export default ProductReviews;