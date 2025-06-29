import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
    averageRating: number;
    isVisible?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    reviews,
    averageRating,
    isVisible = true
}) => {
    const convertRatingToFiveScale = (rating: number): number => {
        return (rating / 2);
    };

    const renderStars = (rating: number) => {
        const fiveScaleRating = rating > 5 ? convertRatingToFiveScale(rating) : rating;

        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFullStar = fiveScaleRating >= starValue;
            const isHalfStar = fiveScaleRating >= starValue - 0.5 && fiveScaleRating < starValue;

            return (
                <div key={index} className="relative inline-block">
                    <Star className="w-4 h-4 text-gray-300" />
                    <div
                        className={`absolute inset-0 overflow-hidden ${isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'}`}
                    >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                </div>
            );
        });
    };

    if (!isVisible) return null;

    return (
        <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Valoraciones</h2>
                </div>

                {/* Rating Summary */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <div className="text-5xl font-bold text-gray-800">
                                    {averageRating.toFixed(1)}
                                </div>
                                <div>
                                    <div className="flex mb-2">
                                        {renderStars(Math.round(averageRating))}
                                    </div>
                                    <div className="text-gray-600">
                                        {reviews.length} valoraciones
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = reviews.filter(r => {
                                    const convertedRating = convertRatingToFiveScale(r.rating);
                                    return Math.round(convertedRating) === rating;
                                }).length;
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                                return (
                                    <div key={rating} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-4">{rating}</span>
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Opiniones recientes</h3>
                    {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                            <div className="flex gap-4">
                                <img
                                    src={review.avatar}
                                    alt={review.userName}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-gray-800">{review.userName}</span>
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                        Responder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {reviews.length > 3 && (
                        <div className="text-center">
                            <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto group">
                                Ver todas las opiniones
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;