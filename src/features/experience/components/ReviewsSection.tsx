import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import { useReviews } from '@/features/experience/hooks/useReviews';
import RatingSummary, { RatingStats } from '@/features/experience/components/reviews/RatingSummary';
import ReviewsList from '@/features/experience/components/reviews/ReviewsList';
import InappropriateContentModal from '@/components/ui/feedback/InappropriateContentModal';

interface ReviewsSectionProps {
    reviews: Review[];
    stats?: RatingStats;
    isVisible?: boolean;
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
    experienceId?: number;
    entity: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    reviews,
    stats,
    isVisible = true,
    setReviews,
    experienceId,
    entity
}) => {
    const {
        isResponding,
        respondingTo,
        comment,
        setComment,
        isSubmitting,
        showAllReviews,
        openOptionsId,
        openResponseOptionsId,
        openNestedResponseOptionsId,
        openNestedOptionsMap,
        handleSaveComment,
        handleRespond,
        handleCancelResponse,
        handleViewAllReviews,
        handleOptionsClick,
        handleResponseOptionsClick,
        handleNestedResponseOptionsClick,
        closeOptions,
        showDeleteConfirm,
        cancelDelete,
        confirmDelete,
        handleEdit,
        handleCancelEdit,
        handleSaveEdit,
        isEditing,
        editingReviewId,
        editingComment,
        setEditingComment,
        handleDeleteComment,
        handleDeleteResponse,
        deleteSuccess,
        deleteTarget,
        inappropriateContentError,
        handleCloseInappropriateContentModal,
        handleRetryComment
    } = useReviews(setReviews, entity, experienceId);



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

                <RatingSummary reviews={reviews} stats={stats} />


                <ReviewsList
                    reviews={reviews}
                    showAllReviews={showAllReviews}
                    onOptionsClick={handleOptionsClick}
                    onResponseOptionsClick={handleResponseOptionsClick}
                    onNestedOptionsClick={handleNestedResponseOptionsClick}
                    isResponding={isResponding}
                    respondingTo={respondingTo}
                    comment={comment}
                    onCommentChange={setComment}
                    onRespond={handleRespond}
                    onCancelResponse={handleCancelResponse}
                    onSaveComment={handleSaveComment}
                    isSubmitting={isSubmitting}
                    onViewAllReviews={handleViewAllReviews}
                    openOptionsId={openOptionsId}
                    openResponseOptionsId={openResponseOptionsId}
                    openNestedResponseOptionsId={openNestedResponseOptionsId}
                    openNestedOptionsMap={openNestedOptionsMap}
                    onCloseOptions={closeOptions}
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteResponse={handleDeleteResponse}
                    handleEdit={handleEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEdit={handleSaveEdit}
                    isEditing={isEditing}
                    editingReviewId={editingReviewId}
                    editingComment={editingComment}
                    setEditingComment={setEditingComment}
                />

                {/* Modal de confirmación para eliminar */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                            {deleteSuccess ? (
                                // Estado de éxito
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¡{deleteTarget?.type === 'response' ? 'Respuesta' : 'Comentario'} eliminado!
                                    </h3>
                                    <p className="text-gray-600">
                                        El {deleteTarget?.type === 'response' ? 'respuesta' : 'comentario'} ha sido eliminado exitosamente.
                                    </p>
                                </div>
                            ) : (
                                // Estado de confirmación
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <Trash2 className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                ¿Eliminar {deleteTarget?.type === 'response' ? 'respuesta' : 'comentario'}?
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Esta acción no se puede deshacer
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-6">
                                        {deleteTarget?.type === 'response'
                                            ? 'Tu respuesta será eliminada permanentemente.'
                                            : 'Tu comentario y todas las respuestas asociadas serán eliminados permanentemente.'
                                        }
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={cancelDelete}
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Eliminando...
                                                </>
                                            ) : (
                                                'Eliminar'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Inappropriate Content Modal */}
            <InappropriateContentModal
                error={inappropriateContentError}
                onClose={handleCloseInappropriateContentModal}
                onRetry={handleRetryComment}
            />
        </section>
    );
};

export default ReviewsSection;