import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import StarRating from '@/features/experience/components/reviews/StarRating';
export interface RatingStats {
    rating: string;
    total: number;
    percent_5: string;
    percent_4: string;
    percent_3: string;
    percent_2: string;
    percent_1: string;
}


interface RatingSummaryProps {
    reviews: Review[];
    stats?: RatingStats;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ reviews, stats }) => {
    const averageRating = stats
        ? parseFloat(stats.rating) / 2
        : reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length / 2
            : 0;

    const totalReviews = stats?.total || reviews.length;

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
                                <StarRating rating={averageRating} />
                            </div>
                            <div className="text-gray-600">
                                {totalReviews} valoraciones
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        let percentage = 0;
                        if (stats) {
                            const percentKey = `percent_${rating}` as keyof RatingStats;
                            const percentValue = stats[percentKey];
                            percentage = parseFloat(percentValue as string) || 0;
                        }

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