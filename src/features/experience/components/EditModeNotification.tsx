import React, { useEffect, useRef } from 'react';
import { Edit, X } from 'lucide-react';

interface EditModeNotificationProps {
    isVisible: boolean;
    onClose: () => void;
    experienceName: string;
    autoCloseDelay?: number; 
}

const EditModeNotification: React.FC<EditModeNotificationProps> = ({
    isVisible,
    onClose,
    experienceName,
    autoCloseDelay = 5000
}) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isVisible) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }

        timeoutRef.current = setTimeout(() => {
            onClose();
        }, autoCloseDelay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isVisible, onClose, autoCloseDelay]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        if (isVisible) {
            timeoutRef.current = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div
                className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
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
                        className="flex-shrink-0 text-blue-200 hover:text-white transition-colors cursor-pointer"
                        aria-label="Cerrar notificación"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModeNotification;