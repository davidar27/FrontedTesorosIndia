import React from 'react';
import { Reply, X, Send } from 'lucide-react';

interface ResponseFormProps {
    userName: string;
    responseType: 'main' | 'response';
    comment: string;
    onCommentChange: (value: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
    userName,
    responseType,
    comment,
    onCommentChange,
    onCancel,
    onSubmit,
    isSubmitting,
}) => {
    const getResponseTypeLabel = (type: 'main' | 'response') => {
        return type === 'main' ? 'comentario' : 'respuesta';
    };

    return (
        <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Reply className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                    Respondiendo {getResponseTypeLabel(responseType)} de {userName}
                </span>
            </div>

            <div className="space-y-3">
                <textarea
                    className="w-full p-3 rounded-lg border border-emerald-200 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                    rows={3}
                    placeholder={`Escribe tu respuesta a ${userName}...`}
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    maxLength={300}
                />

                <div className="flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0">
                    <span className={`text-xs ${comment.length > 250 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {comment.length}/300 caracteres
                    </span>

                    <div className="flex gap-2">
                        <button
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={onCancel}
                        >
                            <X className="w-3 h-3" />
                            Cancelar
                        </button>

                        <button
                            disabled={comment.trim().length === 0 || isSubmitting}
                            className="bg-emerald-600 text-white text-sm font-medium cursor-pointer flex items-center gap-1 px-4 md:py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={onSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3" />
                                    Publicar respuesta
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseForm;