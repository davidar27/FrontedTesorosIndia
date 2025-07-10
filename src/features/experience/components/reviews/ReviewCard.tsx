import React from 'react';
import { Edit3, MessageCircle, MoreVertical, Send, Trash2, X, Flag } from 'lucide-react';
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
    onReportComment?: (reviewId: number, commentText: string, userName: string) => void;
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
    setEditingComment,
    onReportComment
}) => {
    const { user } = useAuth();
    const convertRatingToFiveScale = (rating: number): number => rating / 2;

    return (
        <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 md:p-6 hover:bg-gray-100 transition-all duration-300">
            <div className="flex gap-2 sm:gap-3 md:gap-4">
                {/* Avatar - Responsive sizing */}
                <div className="flex-shrink-0">
                    <Avatar
                        name={review.user_name}
                        src={review.user_image || ''}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header con info del usuario - Stack en mobile, flex en desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                {review.user_name}
                            </span>
                            <div className="flex items-center gap-2">
                                <StarRating rating={convertRatingToFiveScale(review.rating)} />
                                <span className="text-xs sm:text-sm text-gray-500 sm:hidden">
                                    {review.review_date}
                                </span>
                            </div>
                        </div>

                        {/* Fecha visible solo en desktop */}
                        <span className="text-sm text-gray-500 hidden sm:block">
                            {review.review_date}
                        </span>
                    </div>

                    {/* Botones de opciones - Responsive layout */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {/* Opciones del usuario propietario */}
                        {user?.id && review.userId && user.id === review.userId.toString() && (
                            <div className="relative">
                                <button
                                    className="text-emerald-600 cursor-pointer hover:text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                                    onClick={onOptionsClick}
                                >
                                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Opciones</span>
                                </button>

                                {isOptionsOpen && (
                                    <>
                                        {/* Overlay para cerrar al hacer click fuera */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={onCloseOptions}
                                        />

                                        {/* Menú responsive */}
                                        <div className="absolute right-0 top-full mt-2 w-48 sm:w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                                            <div className="py-2">
                                                <button
                                                    className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group cursor-pointer"
                                                    onClick={() => {
                                                        handleEdit(review.review_id, review.comment);
                                                        onCloseOptions();
                                                    }}
                                                >
                                                    <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 flex-shrink-0" />
                                                    <span className="font-medium">Editar comentario</span>
                                                </button>

                                                <div className="h-px bg-gray-100 mx-2" />

                                                <button
                                                    className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group cursor-pointer"
                                                    onClick={() => {
                                                        handleDeleteComment(review.review_id);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600 flex-shrink-0" />
                                                    <span className="font-medium">Eliminar comentario</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Botón de reportar */}
                        {user && user?.role !== 'observador' && review.comment && (
                            <button
                                className="text-gray-500 hover:text-red-600 text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-red-50 transition-colors"
                                onClick={() => onReportComment?.(review.review_id, review.comment, review.user_name)}
                            >
                                <Flag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">Reportar comentario</span>
                                <span className="sm:hidden">Reportar</span>
                            </button>
                        )}
                    </div>

                    {/* Contenido del comentario - Responsive */}
                    {isEditing && editingReviewId === review.review_id ? (
                        <div className="space-y-3">
                            <textarea
                                className="w-full p-3 rounded-lg border border-emerald-200 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white text-sm sm:text-base"
                                rows={3}
                                value={editingComment}
                                onChange={(e) => setEditingComment(e.target.value)}
                                maxLength={300}
                            />

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <span className={`text-xs ${editingComment.length > 250 ? 'text-amber-600' : 'text-gray-500'}`}>
                                    {editingComment.length}/300 caracteres
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                        onClick={handleCancelEdit}
                                    >
                                        <X className="w-3 h-3" />
                                        Cancelar
                                    </button>

                                    <button
                                        disabled={editingComment.trim().length === 0 || isSubmitting}
                                        className="bg-emerald-600 text-white text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                        onClick={handleSaveEdit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span className="hidden sm:inline">Enviando...</span>
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
                    ) : (
                        <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base break-words">
                            {review.comment}
                        </p>
                    )}

                    {/* Responses - Responsive padding */}
                    {review.responses && review.responses.length > 0 && (
                        <div className="mt-4 pl-2 sm:pl-4 border-l-2 border-emerald-200">
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
                        <>
                            {user && user?.role !== 'observador' && review.comment && (
                                <button
                                    className="mt-2 text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                                    onClick={() => onRespond('main', review.review_id, review.user_name)}
                                >
                                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">Responder al comentario</span>
                                    <span className="sm:hidden">Responder</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;