import React from 'react';
import { Edit3, MessageCircle, MoreVertical, Send, Trash2, X } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/display/Avatar';
import StarRating from './StarRating';
import ResponseForm from './ResponseForm';
import ReviewResponse from './ReviewResponse';

interface ReviewCardProps {
    review: Review;
    onOptionsClick: () => void;
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
    isOptionsOpen: boolean;
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
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
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
    isOptionsOpen,
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
    setEditingComment
}) => {
    const { user } = useAuth();
    const convertRatingToFiveScale = (rating: number): number => rating / 2;


    return (
        <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300">
            <div className="flex gap-4">
                <Avatar
                    name={review.user_name}
                    src={review.user_image || ''}
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-800">{review.user_name}</span>
                            <StarRating rating={convertRatingToFiveScale(review.rating)} />
                            {user?.id && review.userId && user.id === review.userId.toString() && (
                                <div className="relative">
                                    <button
                                        className="text-emerald-600 cursor-pointer hover:text-emerald-700 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                                        onClick={onOptionsClick}
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    {isOptionsOpen && (
                                        <>
                                            {/* Overlay para cerrar al hacer click fuera */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={onCloseOptions}
                                            />

                                            {/* Menú */}
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                                                <div className="py-2">
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group cursor-pointer"
                                                        onClick={() => {
                                                            handleEdit(review.review_id, review.comment);
                                                            onCloseOptions();
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                                                        <span className="font-medium">Editar comentario</span>
                                                    </button>

                                                    <div className="h-px bg-gray-100 mx-2" />

                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group cursor-pointer"
                                                        onClick={() => {
                                                            handleDeleteComment(review.review_id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                                                        <span className="font-medium">Eliminar comentario</span>
                                                    </button>
                                                </div>

                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-gray-500">{review.review_date}</span>
                    </div>
                    {isEditing && editingReviewId === review.review_id ? (
                        <>
                            <div className="space-y-3">
                                <textarea
                                    className="w-full p-3 rounded-lg border border-emerald-200 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                                    rows={3}
                                    value={editingComment}
                                    onChange={(e) => setEditingComment(e.target.value)}
                                    maxLength={300}
                                />

                                <div className="flex justify-between items-center">
                                    <span className={`text-xs ${editingComment.length > 250 ? 'text-amber-600' : 'text-gray-500'}`}>
                                        {editingComment.length}/300 caracteres
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            className="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                            onClick={handleCancelEdit}
                                        >
                                            <X className="w-3 h-3" />
                                            Cancelar
                                        </button>

                                        <button
                                            disabled={editingComment.trim().length === 0 || isSubmitting}
                                            className="bg-emerald-600 text-white text-sm font-medium cursor-pointer flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                            onClick={handleSaveEdit}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-3 h-3" />
                                                    Guardar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                    )}

                    {/* Responses */}
                    {review.responses && review.responses.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-emerald-200">
                            {review.responses.map((response) => (
                                <ReviewResponse
                                    key={response.review_id}
                                    response={response}
                                    onRespond={onRespond}
                                    onOptionsClick={() => onResponseOptionsClick(response.review_id)}
                                    isOptionsOpen={openResponseOptionsId === response.review_id}
                                    onCloseOptions={onCloseOptions}
                                    handleEdit={handleEdit}
                                    handleDeleteResponse={handleDeleteResponse}
                                    parentReviewId={review.review_id}
                                    level={0}
                                    isResponding={isResponding}
                                    respondingTo={respondingTo}
                                    comment={comment}
                                    onCommentChange={onCommentChange}
                                    onCancelResponse={onCancelResponse}
                                    onSaveComment={onSaveComment}
                                    isSubmitting={isSubmitting}
                                    isEditing={isEditing}
                                    editingReviewId={editingReviewId}
                                    editingComment={editingComment}
                                    setEditingComment={setEditingComment}
                                    handleCancelEdit={handleCancelEdit}
                                    handleSaveEdit={handleSaveEdit}
                                    onNestedOptionsClick={onNestedOptionsClick}
                                    isNestedOptionsOpen={openNestedOptionsMap[response.review_id] || false}
                                    openNestedResponseOptionsId={openNestedResponseOptionsId}
                                    openNestedOptionsMap={openNestedOptionsMap}
                                />
                            ))}
                        </div>
                    )}

                    {/* Response Form */}
                    {isResponding && respondingTo?.reviewId === review.review_id ? (
                        <ResponseForm
                            userName={respondingTo.userName}
                            responseType={respondingTo.type}
                            comment={comment}
                            onCommentChange={onCommentChange}
                            onCancel={onCancelResponse}
                            onSubmit={onSaveComment}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <button
                            className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                            onClick={() => onRespond('main', review.review_id, review.user_name)}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Responder al comentario
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;