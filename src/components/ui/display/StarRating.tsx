// import React from 'react';
// import { Star } from 'lucide-react';

// interface StarRatingProps {
//     rating: number; // Rating in 1-10 scale from database
//     size?: 'sm' | 'md' | 'lg';
//     showValue?: boolean;
//     className?: string;
// }

// const StarRating: React.FC<StarRatingProps> = ({ 
//     rating, 
//     size = 'md', 
//     showValue = false,
//     className = ''
// }) => {
//     // Convert rating from 1-10 scale to 1-5 scale
//     const convertRatingToFiveScale = (rating: number): number => {
//         return (rating / 2);
//     };

//     // Get star size classes
//     const getStarSize = () => {
//         switch (size) {
//             case 'sm': return 'w-3 h-3';
//             case 'lg': return 'w-6 h-6';
//             default: return 'w-4 h-4';
//         }
//     };

//     // Render stars with support for half stars
//     const renderStars = (rating: number) => {
//         // Convert from 1-10 to 1-5 scale if needed
//         const fiveScaleRating = rating > 5 ? convertRatingToFiveScale(rating) : rating;
//         const starSize = getStarSize();
        
//         return Array.from({ length: 5 }, (_, index) => {
//             const starValue = index + 1;
//             const isFullStar = fiveScaleRating >= starValue;
//             const isHalfStar = fiveScaleRating >= starValue - 0.5 && fiveScaleRating < starValue;
            
//             return (
//                 <div key={index} className="relative inline-block">
//                     {/* Background star (always gray) */}
//                     <Star className={`${starSize} text-gray-300`} />
                    
//                     {/* Foreground star (colored based on rating) */}
//                     <div 
//                         className={`absolute inset-0 overflow-hidden ${
//                             isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'
//                         }`}
//                     >
//                         <Star className={`${starSize} fill-amber-400 text-amber-400`} />
//                     </div>
//                 </div>
//             );
//         });
//     };

//     const fiveScaleRating = convertRatingToFiveScale(rating);

//     return (
//         <div className={`flex items-center gap-2 ${className}`}>
//             <div className="flex">
//                 {renderStars(rating)}
//             </div>
//             {showValue && (
//                 <span className="text-sm font-medium text-gray-700">
//                     {fiveScaleRating.toFixed(1)}
//                 </span>
//             )}
//         </div>
//     );
// };

// export default StarRating; 