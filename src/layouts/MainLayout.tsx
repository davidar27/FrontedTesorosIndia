import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { usePageContext } from '@/context/PageContext';
import { useState, useCallback } from 'react';
import Chatbot from '@/features/chatbot/Chatbot';

const MainLayout = () => {
    const { isEditMode, toggleEditMode } = usePageContext();
    const location = useLocation();
    const [onStatusChangeRequest, setOnStatusChangeRequest] = useState<(() => void) | undefined>(undefined);
    const [onSaveChanges, setOnSaveChanges] = useState<(() => Promise<boolean>) | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<string | undefined>(undefined);

    // Función para registrar la función de cambio de estado desde ExperiencePage
    const registerStatusChangeHandler = useCallback((handler: () => void) => {
        setOnStatusChangeRequest(() => handler);
    }, []);

    // Función para registrar la función de guardar cambios desde ExperiencePage
    const registerSaveChangesHandler = useCallback((handler: () => Promise<boolean>) => {
        setOnSaveChanges(() => handler);
    }, []);

    // Función para actualizar el estado actual
    const updateCurrentStatus = useCallback((status: string) => {
        setCurrentStatus(status);
    }, []);

    // Función para actualizar el estado de guardado
    const updateSavingStatus = useCallback((saving: boolean) => {
        setIsSaving(saving);
    }, []);

    // Solo pasar la función si estamos en una página de experiencia
    const isExperiencePage = location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/');
    const shouldPassHandler = isExperiencePage && onStatusChangeRequest;
    const shouldPassSaveHandler = isExperiencePage && onSaveChanges;

    return (
        <div className="flex flex-col min-h-screen ">
            <Header 
                isEditMode={isEditMode}
                onToggleEditMode={toggleEditMode}
                onStatusChangeRequest={shouldPassHandler ? onStatusChangeRequest : undefined}
                onSaveChanges={shouldPassSaveHandler ? onSaveChanges : undefined}
                isSaving={isSaving}
                currentStatus={isExperiencePage ? currentStatus : undefined}
            />

            <main className="flex-grow">
                <Outlet context={{ 
                    registerStatusChangeHandler, 
                    registerSaveChangesHandler,
                    updateCurrentStatus,
                    updateSavingStatus
                }} /> 
            </main>

            <Footer />
            <Chatbot />
        </div>
    );
};

export default MainLayout;