import React from 'react';
import { CheckCircle, X, Shield } from 'lucide-react';

interface ReportAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    commentText?: string;
    userName?: string;
}

const ReportAnalysisModal: React.FC<ReportAnalysisModalProps> = ({
    isOpen,
    onClose,
    commentText,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Reporte enviado
                            </h3>
                            <p className="text-sm text-gray-600">
                                Gracias por tu reporte
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

                {/* Comentario reportado */}
                {commentText && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Comentario reportado:
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            "{commentText.length > 80 ? `${commentText.substring(0, 80)}...` : commentText}"
                        </p>
                    </div>
                )}

                {/* Mensaje de confirmación */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Tu reporte ha sido recibido
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                            Hemos recibido tu reporte y lo evaluaremos cuidadosamente. 
                            Nuestro equipo revisará el contenido y tomará las medidas necesarias 
                            para mantener una comunidad segura y respetuosa.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>¿Qué pasa ahora?</strong><br />
                            El comentario será revisado y, si es necesario, se tomarán las medidas apropiadas.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportAnalysisModal; 