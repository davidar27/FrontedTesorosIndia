import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

export interface ModalConfig {
    title: string;
    message: string;
    type: ModalType;
    autoClose?: boolean;
    autoCloseDelay?: number;
    showCloseButton?: boolean;
}

interface ModalContextType {
    showModal: (config: ModalConfig) => void;
    hideModal: () => void;
    isOpen: boolean;
    modalConfig: ModalConfig | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

    const showModal = (config: ModalConfig) => {
        setModalConfig({
            autoClose: true,
            autoCloseDelay: 3000,
            showCloseButton: true,
            ...config,
        });
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
        setModalConfig(null);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, isOpen, modalConfig }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useGlobalModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useGlobalModal must be used within a ModalProvider');
    }
    return context;
}; 