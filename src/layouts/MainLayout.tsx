import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { usePageContext } from '@/context/PageContext';
import { useState, useCallback, useMemo } from 'react';
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

    // Memoize the context object to prevent unnecessary re-renders
    const outletContext = useMemo(() => ({
        registerStatusChangeHandler, 
        registerSaveChangesHandler,
        updateCurrentStatus,
        updateSavingStatus
    }), [registerStatusChangeHandler, registerSaveChangesHandler, updateCurrentStatus, updateSavingStatus]);

    // Memoize the experience page check to prevent unnecessary re-renders
    const isExperiencePage = useMemo(() => 
        location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/'),
        [location.pathname]
    );

    // Memoize the handler props to prevent unnecessary re-renders
    const headerProps = useMemo(() => ({
        isEditMode,
        onToggleEditMode: toggleEditMode,
        onStatusChangeRequest: isExperiencePage && onStatusChangeRequest ? onStatusChangeRequest : undefined,
        onSaveChanges: isExperiencePage && onSaveChanges ? onSaveChanges : undefined,
        isSaving,
        currentStatus: isExperiencePage ? currentStatus : undefined
    }), [
        isEditMode, 
        toggleEditMode, 
        isExperiencePage, 
        onStatusChangeRequest, 
        onSaveChanges, 
        isSaving, 
        currentStatus
    ]);

    return (
        <div className="flex flex-col min-h-screen ">
            <Header {...headerProps} />

            <main className="flex-grow">
                <Outlet context={outletContext} /> 
            </main>

            <Footer />
            <Chatbot />
        </div>
    );
};

export default MainLayout;