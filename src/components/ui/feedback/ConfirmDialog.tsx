import React from 'react';
import Button from '@/components/ui/buttons/Button';
interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title = '¿Estás seguro?',
    description = 'Esta acción no se puede deshacer.',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',

    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!open) return null;

    const isDangerAction = confirmText === 'Cancelar' || confirmText === 'Activar';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                <div className="flex justify-end gap-2">
                    <Button
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={onCancel}
                        disabled={loading}
                        variant={isDangerAction ? 'danger' : 'primary'}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmText === 'Activar' ? 'primary' : 'danger'}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog; 