import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <div className="flex">
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1;
                const isFullStar = rating >= starValue;
                const isHalfStar = rating >= starValue - 0.5 && rating < starValue;

                return (
                    <div key={index} className="relative inline-block">
                        <Star className={`${sizeClasses[size]} text-gray-300`} />
                        <div
                            className={`absolute inset-0 overflow-hidden ${isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'
                                }`}
                        >
                            <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;