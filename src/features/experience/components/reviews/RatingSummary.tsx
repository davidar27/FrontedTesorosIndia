import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import StarRating from '@/features/experience/components/reviews/StarRating';

interface RatingSummaryProps {
    reviews: Review[];
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ reviews }) => {
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length / 2
        : 0;

    const convertRatingToFiveScale = (rating: number): number => {
        return rating / 2;
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="text-5xl font-bold text-gray-800">
                            {averageRating.toFixed(1)}
                        </div>
                        <div>
                            <div className="flex mb-2">
                                <StarRating rating={Math.round(averageRating)} />
                            </div>
                            <div className="text-gray-600">
                                {reviews.length} valoraciones
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(() => {
                            const convertedRating = convertRatingToFiveScale(averageRating * 2);
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
                                    />
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
    );
};

export default RatingSummary;