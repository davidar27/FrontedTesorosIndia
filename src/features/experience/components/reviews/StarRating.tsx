import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
    const convertRatingToFiveScale = (rating: number): number => {
        return rating > 5 ? rating / 2 : rating;
    };

    const fiveScaleRating = convertRatingToFiveScale(rating);

    return (
        <div className="flex">
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1;
                const isFullStar = fiveScaleRating >= starValue;
                const isHalfStar = fiveScaleRating >= starValue - 0.5 && fiveScaleRating < starValue;

                return (
                    <div key={index} className="relative inline-block">
                        <Star className="w-4 h-4 text-gray-300" />
                        <div
                            className={`absolute inset-0 overflow-hidden ${isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'
                                }`}
                        >
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;