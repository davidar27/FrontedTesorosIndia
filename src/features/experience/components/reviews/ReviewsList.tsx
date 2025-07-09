import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import ReviewCard from './ReviewCard';

interface ReviewsListProps {
    reviews: Review[];
    showAllReviews: boolean;
    onOptionsClick: (reviewId: number) => void;
    onResponseOptionsClick: (responseId: number) => void;
    onNestedOptionsClick: (responseId: number) => void;
    isResponding: boolean;
    respondingTo: { type: 'main' | 'response'; reviewId: number; responseId?: number; userName: string } | null;
    comment: string;
    onCommentChange: (value: string) => void;
    onRespond: (type: 'main' | 'response', reviewId: number, userName: string, responseId?: number) => void;
    onCancelResponse: () => void;
    onSaveComment: () => void;
    isSubmitting: boolean;
    onViewAllReviews: () => void;
    openOptionsId: number | null;
    openResponseOptionsId: number | null;
    openNestedResponseOptionsId: number | null;
    openNestedOptionsMap: Record<number, boolean>;
    onCloseOptions: () => void;
    handleDeleteComment: (reviewId: number) => void;
    handleDeleteResponse: (responseId: number, parentReviewId: number) => void;
    handleEdit: (reviewId: number, currentComment: string) => void;
    handleCancelEdit: () => void;
    handleSaveEdit: () => void;
    isEditing: boolean;
    editingReviewId: number | null;
    editingComment: string;
    setEditingComment: (value: string) => void;
    onReportComment?: (reviewId: number, commentText: string, userName: string) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
    reviews,
    showAllReviews,
    onOptionsClick,
    onResponseOptionsClick,
    onNestedOptionsClick,
    isResponding,
    respondingTo,
    comment,
    onCommentChange,
    onRespond,
    onCancelResponse,
    onSaveComment,
    isSubmitting,
    onViewAllReviews,
    openOptionsId,
    openResponseOptionsId,
    openNestedResponseOptionsId,
    openNestedOptionsMap,
    onCloseOptions,
    handleDeleteComment,
    handleDeleteResponse,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    isEditing,
    editingReviewId,
    editingComment,
    setEditingComment,
    onReportComment
    
}) => {

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">
                {showAllReviews ? 'Todas las opiniones' : 'Opiniones recientes'}
            </h3>
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                <ReviewCard
                    key={review.review_id}
                    review={review}
                    onOptionsClick={() => onOptionsClick(review.review_id)}
                    onResponseOptionsClick={onResponseOptionsClick}
                    onNestedOptionsClick={onNestedOptionsClick}
                    isResponding={isResponding}
                    respondingTo={respondingTo}
                    comment={comment}
                    onCommentChange={onCommentChange}
                    onRespond={onRespond}
                    onCancelResponse={onCancelResponse}
                    onSaveComment={onSaveComment}
                    isSubmitting={isSubmitting}
                    isOptionsOpen={openOptionsId === review.review_id}
                    openResponseOptionsId={openResponseOptionsId}
                    openNestedResponseOptionsId={openNestedResponseOptionsId}
                    openNestedOptionsMap={openNestedOptionsMap}
                    onCloseOptions={onCloseOptions}
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteResponse={handleDeleteResponse}
                    handleEdit={handleEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEdit={handleSaveEdit}
                    isEditing={isEditing}
                    editingReviewId={editingReviewId}
                    editingComment={editingComment}
                    setEditingComment={setEditingComment}
                    onReportComment={onReportComment}
                />
            ))}

            {reviews.length > 3 && (
                <div className="text-center pt-6 border-t border-gray-200">
                    <button
                        className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto group px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                        onClick={onViewAllReviews}
                    >
                        {showAllReviews ? 'Ver menos opiniones' : 'Ver todas las opiniones'}
                        <ArrowRight className={`w-4 h-4 transition-transform ${showAllReviews ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;