import React from 'react';
import { XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';

interface CancelReserveConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
    reserveData?: {
        package_name?: string;
        date?: string;
        people?: number;
        total_price?: number;
    };
}

const CancelReserveConfirmDialog: React.FC<CancelReserveConfirmDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    isLoading,
    reserveData
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar Cancelación</h2>
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres cancelar tu reserva?
                    </p>
                </div>

                {/* Información de la reserva */}
                {reserveData && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Detalles de la reserva:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Paquete:</span>
                                <span className="font-medium">{reserveData.package_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fecha:</span>
                                <span className="font-medium">
                                    {reserveData.date ? new Date(reserveData.date).toLocaleDateString('es-ES') : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Personas:</span>
                                <span className="font-medium">{reserveData.people}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium">
                                    {reserveData.total_price ? `$${reserveData.total_price.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Advertencia */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-800">
                            <p className="font-medium mb-1">Importante:</p>
                            <p>
                                Esta acción no se puede deshacer. Una vez cancelada la reserva,
                                se procesará el reembolso según las políticas de cancelación.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    <Button
                        onClick={onCancel}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        variant="danger"
                        className="flex-1"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelando...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <XCircle className="w-4 h-4" />
                                Sí, cancelar
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CancelReserveConfirmDialog; 