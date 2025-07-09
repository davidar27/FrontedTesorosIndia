/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { axiosInstance } from '@/api/axiosInstance';
import { useAuth } from "@/context/AuthContext";
import { Review } from '@/features/experience/types/experienceTypes';
import { InappropriateContentError } from '@/types/inappropriateContent';
import { toast } from 'sonner';

interface RespondingTo {
    type: 'main' | 'response';
    reviewId: number;
    responseId?: number;
    userName: string;
}

export const useReviews = (setReviews: React.Dispatch<React.SetStateAction<Review[]>>, entity: string, experienceId?: number) => {
    const [isResponding, setIsResponding] = useState(false);
    const [respondingTo, setRespondingTo] = useState<RespondingTo | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [openOptionsId, setOpenOptionsId] = useState<number | null>(null);
    const [openResponseOptionsId, setOpenResponseOptionsId] = useState<number | null>(null);
    const [openNestedResponseOptionsId, setOpenNestedResponseOptionsId] = useState<number | null>(null);
    const [openNestedOptionsMap, setOpenNestedOptionsMap] = useState<Record<number, boolean>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editingComment, setEditingComment] = useState('');
    const { user } = useAuth();
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'comment' | 'response', id: number, parentId?: number } | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [inappropriateContentError, setInappropriateContentError] = useState<InappropriateContentError | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingComment, setReportingComment] = useState<{ id: number; text: string; userName: string } | null>(null);
    const [isReporting, setIsReporting] = useState(false);

    const handleOptionsClick = (reviewId: number) => {
        setOpenOptionsId(openOptionsId === reviewId ? null : reviewId);
    };

    const handleResponseOptionsClick = (responseId: number) => {
        setOpenResponseOptionsId(openResponseOptionsId === responseId ? null : responseId);
    };

    const handleNestedResponseOptionsClick = (responseId: number) => {
        setOpenNestedOptionsMap(prev => ({
            ...prev,
            [responseId]: !prev[responseId]
        }));
        setOpenOptionsId(null);
        setOpenResponseOptionsId(null);
    };

    const closeOptions = () => {
        setOpenOptionsId(null);
        setOpenResponseOptionsId(null);
        setOpenNestedResponseOptionsId(null);
        setOpenNestedOptionsMap({});
    };

    const handleDeleteComment = (reviewId: number) => {
        setDeleteTarget({ type: 'comment', id: reviewId });
        setShowDeleteConfirm(true);
        setOpenOptionsId(null);
    };

    const handleDeleteResponse = (responseId: number, parentReviewId: number) => {
        setDeleteTarget({ type: 'response', id: responseId, parentId: parentReviewId });
        setShowDeleteConfirm(true);
        setOpenResponseOptionsId(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsSubmitting(true);
        try {
            if (deleteTarget.type === 'comment') {
                await axiosInstance.delete(`/comentarios/${deleteTarget.id}`, { data: { user_id: user?.id } });
                setReviews(prev => prev.filter(r => r.review_id !== deleteTarget.id));
            } else {
                await axiosInstance.delete(`/comentarios/${deleteTarget.id}`, { data: { user_id: user?.id } });
                setReviews(prev =>
                    prev.map(r =>
                        r.review_id === deleteTarget.parentId
                            ? { ...r, responses: r.responses.filter(resp => resp.review_id !== deleteTarget.id) }
                            : r
                    )
                );
            }
            setDeleteSuccess(true);
            setTimeout(() => {
                setShowDeleteConfirm(false);
                setDeleteTarget(null);
                setDeleteSuccess(false);
            }, 1500);
        } catch (error) {
            console.error('Error deleting:', error);
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleEdit = (reviewId: number, currentComment: string) => {
        setEditingReviewId(reviewId);
        setEditingComment(currentComment);
        setIsEditing(true);
        setOpenOptionsId(null);
        setOpenResponseOptionsId(null);
        setOpenNestedResponseOptionsId(null);
        setOpenNestedOptionsMap({});
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingReviewId(null);
        setEditingComment('');
    };

    const handleSaveEdit = async () => {
        if (!editingReviewId || !editingComment.trim()) return;

        try {
            setIsSubmitting(true);
            await axiosInstance.put(`/comentarios/${editingReviewId}`, {
                user_id: user?.id,
                comment: editingComment.trim()
            });

            const updateCommentRecursively = (reviews: Review[]): Review[] => {
                return reviews.map(review => {
                    if (review.review_id === editingReviewId) {
                        return { ...review, comment: editingComment.trim() };
                    }
                    if (review.responses && review.responses.length > 0) {
                        return {
                            ...review,
                            responses: updateCommentRecursively(review.responses)
                        };
                    }
                    return review;
                });
            };

            setReviews(prevReviews => updateCommentRecursively(prevReviews));

            setIsEditing(false);
            setEditingReviewId(null);
            setEditingComment('');
        } catch (error: unknown) {
            console.error('Error updating review:', error);

            const data =
                error && typeof error === 'object' && 'response' in error && (error as any).response?.data
                    ? (error as any).response.data
                    : null;

            if (data) {
                // Si viene anidado (error es un objeto)
                if (data.success === false && data.error && typeof data.error === 'object') {
                    setInappropriateContentError(data.error);
                }
                // Si viene plano (error es un string)
                else if (
                    data.success === false &&
                    data.message &&
                    typeof data.error === 'string' &&
                    data.toxicCategories &&
                    data.suggestion &&
                    data.severity
                ) {
                    setInappropriateContentError({
                        success: false,
                        message: data.message,
                        error: data.error,
                        toxicCategories: data.toxicCategories,
                        suggestion: data.suggestion,
                        severity: data.severity,
                    });
                } else {
                    toast.error('Ocurrió un error al actualizar el comentario. Intenta nuevamente.');
                }
            } else {
                toast.error('Ocurrió un error al actualizar el comentario. Intenta nuevamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveComment = async () => {
        if (!respondingTo || !comment.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post('/comentarios', {
                user_id: user?.id,
                type: entity,
                entity_id: experienceId || 1,
                review: comment.trim(),
                parent_id: respondingTo.reviewId
            });

            const newResponse: Review = {
                review_id: Date.now(),
                userId: response.data.review.user_id,
                user_name: user?.name || 'Usuario',
                user_image: null,
                review_date: new Date().toISOString().split('T')[0],
                rating: 0,
                comment: response.data.review.review,
                responses: []
            };

            // Función recursiva para actualizar respuestas anidadas
            const updateResponsesRecursively = (reviews: Review[]): Review[] => {
                return reviews.map(review => {
                    if (review.review_id === respondingTo.reviewId) {
                        return {
                            ...review,
                            responses: [...(review.responses || []), newResponse]
                        };
                    }
                    // Buscar en respuestas anidadas
                    if (review.responses && review.responses.length > 0) {
                        return {
                            ...review,
                            responses: updateResponsesRecursively(review.responses)
                        };
                    }
                    return review;
                });
            };

            setReviews(prevReviews => updateResponsesRecursively(prevReviews));

            await new Promise(resolve => setTimeout(resolve, 800));

            setIsResponding(false);
            setRespondingTo(null);
            setComment('');
        } catch (error: unknown) {
            console.error('Error saving comment:', error);

            const data =
                error && typeof error === 'object' && 'response' in error && (error as any).response?.data
                    ? (error as any).response.data
                    : null;

            if (data) {
                if (data.success === false && data.error && typeof data.error === 'object') {
                    setInappropriateContentError(data.error);
                }
                else if (
                    data.success === false &&
                    data.message &&
                    typeof data.error === 'string' &&
                    data.toxicCategories &&
                    data.suggestion &&
                    data.severity
                ) {
                    setInappropriateContentError({
                        success: false,
                        message: data.message,
                        error: data.error,
                        toxicCategories: data.toxicCategories,
                        suggestion: data.suggestion,
                        severity: data.severity,
                    });
                } else {
                    toast.error('Ocurrió un error al enviar la respuesta. Intenta nuevamente.');
                }
            } else {
                toast.error('Ocurrió un error al enviar la respuesta. Intenta nuevamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRespond = (type: 'main' | 'response', reviewId: number, userName: string, responseId?: number) => {
        setRespondingTo({ type, reviewId, responseId, userName });
        setIsResponding(true);
        setComment('');
    };

    const handleCancelResponse = () => {
        setIsResponding(false);
        setRespondingTo(null);
        setComment('');
    };

    const handleViewAllReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    // Handlers for inappropriate content modal
    const handleCloseInappropriateContentModal = () => {
        setInappropriateContentError(null);
    };

    const handleRetryComment = () => {
        setInappropriateContentError(null);
        // Focus back to the comment textarea
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.focus();
        }
    };

    // Handlers for report modal
    const handleReportComment = (reviewId: number, commentText: string, userName: string) => {
        setReportingComment({ id: reviewId, text: commentText, userName });
        setShowReportModal(true);
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportingComment(null);
    };

    const handleSubmitReport = async (reportData: { type: string; reason: string }) => {
        if (!reportingComment) return;

        setIsReporting(true);
        try {
            await axiosInstance.post('/reportes-comentarios', {
                user_id: user?.id,
                review_id: reportingComment.id,
                report_type: reportData.type,
                reason: reportData.reason
            });

            toast.success('Reporte enviado correctamente');
            handleCloseReportModal();
        } catch (error: unknown) {
            console.error('Error submitting report:', error);
            toast.error('Error al enviar el reporte. Intenta nuevamente.');
        } finally {
            setIsReporting(false);
        }
    };

    return {
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
        handleDeleteComment,
        handleDeleteResponse,
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
        deleteTarget,
        deleteSuccess,
        inappropriateContentError,
        handleCloseInappropriateContentModal,
        handleRetryComment,
        showReportModal,
        reportingComment,
        isReporting,
        handleReportComment,
        handleCloseReportModal,
        handleSubmitReport
    };
};