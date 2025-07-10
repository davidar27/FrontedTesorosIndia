import React from 'react';
import { ModalProvider, useGlobalModal } from '@/context/ModalContext';
import NotificationModal from './NotificationModal';

const ModalRenderer: React.FC = () => {
    const { isOpen, modalConfig, hideModal } = useGlobalModal();

    if (!modalConfig) return null;

    return (
        <NotificationModal
            isOpen={isOpen}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            onClose={hideModal}
            autoClose={modalConfig.autoClose}
            autoCloseDelay={modalConfig.autoCloseDelay}
            showCloseButton={modalConfig.showCloseButton}
        />
    );
};

interface GlobalModalProviderProps {
    children: React.ReactNode;
}

const GlobalModalProvider: React.FC<GlobalModalProviderProps> = ({ children }) => {
    return (
        <ModalProvider>
            {children}
            <ModalRenderer />
        </ModalProvider>
    );
};

export default GlobalModalProvider; 