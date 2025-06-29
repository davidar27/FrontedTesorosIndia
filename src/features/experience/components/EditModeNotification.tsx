import React from 'react';
import { Edit, X } from 'lucide-react';

interface EditModeNotificationProps {
    isVisible: boolean;
    onClose: () => void;
    experienceName: string;
}

const EditModeNotification: React.FC<EditModeNotificationProps> = ({
    isVisible,
    onClose,
    experienceName
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <Edit className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                            Modo Edición Activado
                        </h4>
                        <p className="text-blue-100 text-sm">
                            Estás editando tu experiencia: <strong>{experienceName}</strong>
                        </p>
                        <p className="text-blue-100 text-xs mt-2">
                            Los cambios se guardarán automáticamente cuando hagas clic en "Guardar"
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-blue-200 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModeNotification; 