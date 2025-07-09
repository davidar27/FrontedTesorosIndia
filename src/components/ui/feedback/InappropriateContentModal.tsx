import React from 'react';
import { AlertTriangle, X, Lightbulb } from 'lucide-react';

interface InappropriateContentError {
    success: false;
    message: string;
    error: string;
    toxicCategories: string[];
    suggestion: string;
    severity: 'low' | 'medium' | 'high';
}

interface InappropriateContentModalProps {
    error: InappropriateContentError | null;
    onClose: () => void;
    onRetry: () => void;
}

const InappropriateContentModal: React.FC<InappropriateContentModalProps> = ({
    error,
    onClose,
    onRetry
}) => {
    if (!error) return null;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-amber-600';
            case 'low':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'spanish_profanity': 'Lenguaje inapropiado en español',
            'english_profanity': 'Lenguaje inapropiado en inglés',
            'hate_speech': 'Discurso de odio',
            'harassment': 'Acoso',
            'spam': 'Spam',
            'inappropriate_content': 'Contenido inapropiado'
        };
        return labels[category] || category;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeverityColor(error.severity).split(' ')[1]}`}>
                            <AlertTriangle className={`w-6 h-6 ${getSeverityIcon(error.severity)}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Contenido no permitido
                            </h3>
                            <p className="text-sm text-gray-600">
                                Nivel: {error.severity === 'high' ? 'Alto' : error.severity === 'medium' ? 'Medio' : 'Bajo'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Error Message */}
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                        {error.message}
                    </p>
                    <div className={`p-3 rounded-lg border ${getSeverityColor(error.severity)}`}>
                        <p className="text-sm font-medium">
                            Detalles del problema:
                        </p>
                        <p className="text-sm mt-1">
                            {error.error}
                        </p>
                    </div>
                </div>

                {/* Categories */}
                {error.toxicCategories.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Categorías detectadas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {error.toxicCategories.map((category, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                    {getCategoryLabel(category)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggestion */}
                {error.suggestion && (
                    <div className="mb-6">
                        <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-emerald-800 mb-1">
                                    Sugerencia:
                                </p>
                                <p className="text-sm text-emerald-700">
                                    Considera usar: <span className="font-medium">"{error.suggestion.trim()}"</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Entendido
                    </button>
                    <button
                        onClick={onRetry}
                        className="flex-1 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        Editar comentario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InappropriateContentModal; 