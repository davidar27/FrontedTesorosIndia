import { Review } from "../types/experienceTypes";

export const convertRatingToFiveScale = (rating: number): number => {
    return rating > 5 ? rating / 2 : rating;
};

export const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return convertRatingToFiveScale(sum / reviews.length);
};
