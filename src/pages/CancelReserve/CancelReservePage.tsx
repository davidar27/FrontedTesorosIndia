import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { useNotificationModal } from '@/hooks/useNotificationModal';
import { useCancelReserve } from '@/hooks/useCancelReserve';
import CancelReserveConfirmDialog from '@/components/ui/feedback/CancelReserveConfirmDialog';

const CancelReservePage: React.FC = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotificationModal();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const {
        reserveData,
        isValidToken,
        cancelReserveMutation,
        handleCancelReserve
    } = useCancelReserve();

    // Usar refs para evitar bucles infinitos
    const hasShownSuccess = useRef(false);
    const hasShownError = useRef(false);

    // Manejar éxito y error de la mutación
    useEffect(() => {
        if (cancelReserveMutation.isSuccess && !hasShownSuccess.current) {
            hasShownSuccess.current = true;
            setShowConfirmDialog(false);
            showSuccess(
                'Reserva cancelada',
                cancelReserveMutation.data?.message || 'Reserva cancelada exitosamente',
                { autoCloseDelay: 3000 }
            );
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 3000);
        }
    }, [cancelReserveMutation.isSuccess, cancelReserveMutation.data, showSuccess, navigate]);

    useEffect(() => {
        if (cancelReserveMutation.isError && !hasShownError.current) {
            hasShownError.current = true;
            setShowConfirmDialog(false);
            showError(
                'Error al cancelar reserva',
                cancelReserveMutation.error instanceof Error
                    ? cancelReserveMutation.error.message
                    : 'No se pudo cancelar la reserva. Por favor, intenta nuevamente.',
                { autoClose: false }
            );
        }
    }, [cancelReserveMutation.isError, cancelReserveMutation.error, showError]);

    const handleShowConfirmDialog = () => {
        setShowConfirmDialog(true);
    };

    const handleHideConfirmDialog = () => {
        setShowConfirmDialog(false);
    };

      const handleConfirmCancel = () => {
    handleCancelReserve();
  };

    const handleGoHome = () => {
        navigate('/', { replace: true });
    };

    if (isValidToken === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando...</h2>
                    <p className="text-gray-600">Validando tu enlace de cancelación</p>
                </div>
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Enlace Inválido</h2>
                    <p className="text-gray-600 mb-6">
                        El enlace de cancelación no es válido o ha expirado.
                        Por favor, contacta con soporte si necesitas cancelar tu reserva.
                    </p>
                    <Button onClick={handleGoHome} variant="primary" className="w-full">
                        Ir al Inicio
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Cancelar Reserva</h1>
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres cancelar tu reserva?
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        Al cancelar la reserva, se cancela la compra del paquete junto con la reserva de la habitación.
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
                <div className="space-y-3">
                    <Button
                        onClick={handleShowConfirmDialog}
                        disabled={cancelReserveMutation.isPending}
                        variant="danger"
                        className="w-full"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Cancelar reserva
                        </div>
                    </Button>

                    <Button
                        onClick={handleGoHome}
                        disabled={cancelReserveMutation.isPending}
                        variant="secondary"
                        className="w-full"
                    >
                        No, mantener reserva
                    </Button>
                </div>

                {/* Diálogo de confirmación */}
                <CancelReserveConfirmDialog
                    isOpen={showConfirmDialog}
                    onConfirm={handleConfirmCancel}
                    onCancel={handleHideConfirmDialog}
                    isLoading={cancelReserveMutation.isPending}
                    reserveData={reserveData || undefined}
                />

                {/* Mensaje de éxito */}
                {cancelReserveMutation.isSuccess && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div className="text-sm text-green-800">
                                <p className="font-medium">¡Reserva cancelada exitosamente!</p>
                                <p>Serás redirigido al inicio en unos segundos...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelReservePage; 