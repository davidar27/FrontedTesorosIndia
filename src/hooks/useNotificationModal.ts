import { useGlobalModal, ModalConfig } from '@/context/ModalContext';

export const useNotificationModal = () => {
    const { showModal } = useGlobalModal();

    const showSuccess = (title: string, message: string, options?: Partial<ModalConfig>) => {
        showModal({
            title,
            message,
            type: 'success',
            ...options,
        });
    };

    const showError = (title: string, message: string, options?: Partial<ModalConfig>) => {
        showModal({
            title,
            message,
            type: 'error',
            autoClose: false, // Los errores no se cierran automáticamente por defecto
            ...options,
        });
    };

    const showWarning = (title: string, message: string, options?: Partial<ModalConfig>) => {
        showModal({
            title,
            message,
            type: 'warning',
            ...options,
        });
    };

    const showInfo = (title: string, message: string, options?: Partial<ModalConfig>) => {
        showModal({
            title,
            message,
            type: 'info',
            ...options,
        });
    };

    const showCustom = (config: ModalConfig) => {
        showModal(config);
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showCustom,
    };
}; 