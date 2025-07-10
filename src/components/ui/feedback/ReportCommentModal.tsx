import React, { useState } from 'react';
import { X, Send, Flag } from 'lucide-react';

interface ReportCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reportData: { type: string; reason: string }) => void;
    isSubmitting: boolean;
    commentText?: string;
    userName?: string;
}

const REPORT_TYPES = [
    { value: 'inappropriate_content', label: 'Contenido inapropiado' },
    { value: 'abusive_comment', label: 'Comentario abusivo' },
    { value: 'spam', label: 'Spam' },
    { value: 'hate_speech', label: 'Discurso de odio' },
    { value: 'harassment', label: 'Acoso' },
    { value: 'false_information', label: 'Información falsa' },
    { value: 'other', label: 'Otro' }
];

const ReportCommentModal: React.FC<ReportCommentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    commentText,
    userName
}) => {
    const [reportType, setReportType] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState<{ type?: string; reason?: string }>({});

    const handleSubmit = () => {
        const newErrors: { type?: string; reason?: string } = {};

        if (!reportType.trim()) {
            newErrors.type = 'Selecciona un tipo de reporte';
        }

        if (!reason.trim()) {
            newErrors.reason = 'El motivo es obligatorio';
        } else if (reason.trim().length < 10) {
            newErrors.reason = 'El motivo debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit({ type: reportType, reason: reason.trim() });
        }
    };

    const handleClose = () => {
        setReportType('');
        setReason('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Flag className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Reportar comentario
                            </h3>
                            <p className="text-sm text-gray-600">
                                Ayúdanos a mantener la comunidad segura
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comentario que se está reportando */}
                {commentText && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Comentario de {userName || 'usuario'}:
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            "{commentText.length > 100 ? `${commentText.substring(0, 100)}...` : commentText}"
                        </p>
                    </div>
                )}

                {/* Formulario */}
                <div className="space-y-4">
                    {/* Tipo de reporte */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de reporte *
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => {
                                setReportType(e.target.value);
                                if (errors.type) setErrors(prev => ({ ...prev, type: undefined }));
                            }}
                            className={`w-full p-3 rounded-lg border transition-colors ${
                                errors.type 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                            } focus:ring-2 focus:ring-opacity-50`}
                        >
                            <option value="">Selecciona un tipo</option>
                            {REPORT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                        )}
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo del reporte *
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (errors.reason) setErrors(prev => ({ ...prev, reason: undefined }));
                            }}
                            rows={4}
                            placeholder="Explica por qué estás reportando este comentario..."
                            className={`w-full p-3 rounded-lg border resize-none transition-colors ${
                                errors.reason 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                            } focus:ring-2 focus:ring-opacity-50`}
                            maxLength={300}
                        />
                        {errors.reason && (
                            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {reason.length}/300 caracteres (mínimo 10)
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Enviar reporte
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportCommentModal; 