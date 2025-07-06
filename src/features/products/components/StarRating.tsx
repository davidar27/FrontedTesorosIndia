import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    reviewCount: number;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount, size = 20 }) => {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Estrellas completas
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    fill="currentColor"
                    stroke="none"
                    size={size}
                />
            );
        }

        // Estrella media
        if (hasHalfStar) {
            stars.push(
                <div
                    key="half-star"
                    className="relative inline-block"
                    style={{ width: size, height: size }}
                >
                    <div
                        className="absolute left-0 top-0 overflow-hidden"
                        style={{ width: size / 2, height: size }}
                    >
                        <Star
                            fill="currentColor"
                            stroke="currentColor"
                            size={size}
                            className="absolute left-0"
                        />
                    </div>
                    <div
                        className="absolute right-0 top-0 overflow-hidden"
                        style={{ width: size / 2, height: size }}
                    >
                        <Star
                            fill="none"
                            stroke="currentColor"
                            size={size}
                            className="absolute right-0"
                        />
                    </div>
                </div>
            );
        }

        // Estrellas vacías
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    fill="none"
                    stroke="currentColor"
                    size={size}
                />
            );
        }

        return stars;
    };

    if (rating === 0) {
        return (
            <div className="flex justify-center items-center text-yellow-400">
                <p>Sin calificación</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center text-yellow-400">
                {renderStars()}
            </div>
            <span className="text-gray-600">({rating.toFixed(1)})</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
                {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
            </span>
        </>
    );
};

export default StarRating;