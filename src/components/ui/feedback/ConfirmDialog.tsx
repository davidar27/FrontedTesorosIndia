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
                        textColor={isDangerAction ? 'text-red-600' : 'text-primary'}
                        hoverTextColor='hover:text-white'
                        borderColor={isDangerAction ? 'border-red-600' : 'border-primary'}
                        bgColor='bg-transparent'
                        hoverBg={isDangerAction ? 'hover:bg-red-600' : 'hover:bg-primary'}
                        hoverBorderColor={isDangerAction ? 'hover:border-red-600' : 'hover:border-primary'}

                    >
                        {cancelText}
                    </Button>
                    <Button
                        bgColor='bg-transparent'
                        hoverBg={confirmText === 'Activar' ? 'hover:bg-primary' : 'hover:bg-red-600'}
                        textColor={confirmText === 'Activar' ? 'text-primary' : 'text-red-600'}
                        hoverTextColor={confirmText === 'Activar' ? 'hover:text-white' : 'hover:text-white'}
                        borderColor={confirmText === 'Activar' ? 'border-primary' : 'border-red-600'}
                        hoverBorderColor={confirmText === 'Activar' ? 'hover:border-primary' : 'hover:border-red-600'}
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