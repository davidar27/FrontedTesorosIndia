import React from 'react';
import { Edit3, MessageCircle, MoreVertical, Reply, Trash2 } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import { useAuth } from '@/context/AuthContext';

interface ReviewResponseProps {
    response: Review;
    onRespond: (type: 'response', reviewId: number, userName: string, responseId?: number) => void;
    onOptionsClick: () => void;
    isOptionsOpen: boolean;
    onCloseOptions: () => void;
    handleEdit: (reviewId: number, currentComment: string) => void;
    handleDeleteResponse: (responseId: number, parentReviewId: number) => void;
    parentReviewId: number;
    level?: number; 
    isResponding: boolean;
    respondingTo: { type: 'main' | 'response'; reviewId: number; responseId?: number; userName: string } | null;
    comment: string;
    onCommentChange: (value: string) => void;
    onCancelResponse: () => void;
    onSaveComment: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
    editingReviewId: number | null;
    editingComment: string;
    setEditingComment: (value: string) => void;
    handleCancelEdit: () => void;
    handleSaveEdit: () => void;
    onNestedOptionsClick?: (responseId: number) => void;
    isNestedOptionsOpen?: boolean;
    openNestedResponseOptionsId?: number | null;
    openNestedOptionsMap: Record<number, boolean>;
}

const ReviewResponse: React.FC<ReviewResponseProps> = ({ 
    response, 
    onRespond, 
    onOptionsClick, 
    isOptionsOpen, 
    onCloseOptions, 
    handleEdit, 
    handleDeleteResponse, 
    parentReviewId,
    level = 0,
    isResponding,
    respondingTo,
    comment,
    onCommentChange,
    onCancelResponse,
    onSaveComment,
    isSubmitting,
    isEditing,
    editingReviewId,
    editingComment,
    setEditingComment,
    handleCancelEdit,
    handleSaveEdit,
    onNestedOptionsClick,
    isNestedOptionsOpen,
    openNestedResponseOptionsId,
    openNestedOptionsMap
}) => {
    const { user } = useAuth();
    const indentClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : '';
    
    const currentIsOptionsOpen = level === 0 
        ? isOptionsOpen 
        : (openNestedOptionsMap?.[response.review_id] || isNestedOptionsOpen || false);
    const currentOnOptionsClick = level === 0 ? onOptionsClick : () => onNestedOptionsClick?.(response.review_id);
    
    return (
        <div className={`mb-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm ${indentClass}`}>
            <div className="flex items-center gap-2 mb-2">
                <Reply className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-sm text-gray-700">{response.user_name}</span>
                <span className="text-xs text-gray-500">{response.review_date}</span>
                {user?.id && response.userId && user.id === response.userId.toString() && (
                    <div className="relative">
                        <button
                            className="text-emerald-600 cursor-pointer hover:text-emerald-700 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                            onClick={currentOnOptionsClick}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {currentIsOptionsOpen && (
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
                                                handleEdit(response.review_id, response.comment);
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
                                                handleDeleteResponse(response.review_id, parentReviewId);
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
            {isEditing && editingReviewId === response.review_id ? (
                <div className="ml-6 space-y-3 bg-gray-50 p-3 rounded-lg border border-emerald-200">
                    <textarea
                        className="w-full p-3 rounded-lg border border-emerald-200 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                        rows={3}
                        value={editingComment}
                        onChange={(e) => setEditingComment(e.target.value)}
                        maxLength={300}
                        placeholder="Editar tu comentario..."
                    />
                    <div className="flex justify-between items-center">
                        <span className={`text-xs ${editingComment.length > 250 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {editingComment.length}/300 caracteres
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="text-gray-500 hover:text-gray-700 text-xs font-medium cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={editingComment.trim().length === 0 || isSubmitting}
                                className="bg-emerald-600 text-white text-xs font-medium cursor-pointer px-3 py-1 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                                onClick={handleSaveEdit}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-600 mb-3 ml-6">{response.comment}</p>
            )}
            
            {/* Botón de responder */}
            {level < 2 && ( // Limitar a máximo 3 niveles (0, 1, 2)
                <button
                    className="ml-6 text-emerald-600 hover:text-emerald-700 text-xs font-medium cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                    onClick={() => onRespond('response', response.review_id, response.user_name, response.review_id)}
                >
                    <MessageCircle className="w-3 h-3" />
                    Responder
                </button>
            )}

            {/* Formulario de respuesta */}
            {isResponding && respondingTo?.reviewId === response.review_id && (
                <div className="mt-3 ml-6 p-3 bg-gray-50 rounded-lg">
                    <textarea
                        className="w-full p-2 rounded border border-gray-200 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        rows={2}
                        placeholder={`Responder a ${respondingTo.userName}...`}
                        value={comment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        maxLength={300}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${comment.length > 250 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {comment.length}/300 caracteres
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="text-gray-500 hover:text-gray-700 text-xs font-medium cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                onClick={onCancelResponse}
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={comment.trim().length === 0 || isSubmitting}
                                className="bg-emerald-600 text-white text-xs font-medium cursor-pointer px-3 py-1 rounded hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                                onClick={onSaveComment}
                            >
                                {isSubmitting ? 'Enviando...' : 'Responder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Respuestas anidadas */}
            {response.responses && response.responses.length > 0 && (
                <div className="mt-3 space-y-2">
                    {response.responses.map((nestedResponse) => (
                        <ReviewResponse
                            key={nestedResponse.review_id}
                            response={nestedResponse}
                            onRespond={onRespond}
                            onOptionsClick={onOptionsClick}
                            isOptionsOpen={isOptionsOpen}
                            onCloseOptions={onCloseOptions}
                            handleEdit={handleEdit}
                            handleDeleteResponse={handleDeleteResponse}
                            parentReviewId={response.review_id}
                            level={level + 1}
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
                            isNestedOptionsOpen={openNestedOptionsMap?.[nestedResponse.review_id] || false}
                            openNestedResponseOptionsId={openNestedResponseOptionsId}
                            openNestedOptionsMap={openNestedOptionsMap}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewResponse;