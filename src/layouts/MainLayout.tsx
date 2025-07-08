import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { usePageContext } from '@/context/PageContext';
import { useState, useCallback } from 'react';
import Chatbot from '@/features/chatbot/Chatbot';
// import OnboardingProvider from '@/features/chatbot/components/OnboardingProvider';

const MainLayout = () => {
    const { isEditMode, toggleEditMode } = usePageContext();
    const location = useLocation();
    const [onStatusChangeRequest, setOnStatusChangeRequest] = useState<(() => void) | undefined>(undefined);
    const [currentStatus, setCurrentStatus] = useState<string | undefined>(undefined);

    // Función para registrar la función de cambio de estado desde ExperiencePage
    const registerStatusChangeHandler = useCallback((handler: () => void) => {
        setOnStatusChangeRequest(() => handler);
    }, []);

    // Función para actualizar el estado actual
    const updateCurrentStatus = useCallback((status: string) => {
        setCurrentStatus(status);
    }, []);

    // Solo pasar la función si estamos en una página de experiencia
    const isExperiencePage = location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/');
    const shouldPassHandler = isExperiencePage && onStatusChangeRequest;

    return (
        // <OnboardingProvider>
            <div className="flex flex-col min-h-screen ">
                <Header 
                    isEditMode={isEditMode}
                    onToggleEditMode={toggleEditMode}
                    onStatusChangeRequest={shouldPassHandler ? onStatusChangeRequest : undefined}
                    currentStatus={isExperiencePage ? currentStatus : undefined}
                />

                <main className="flex-grow">
                    <Outlet context={{ registerStatusChangeHandler, updateCurrentStatus }} /> 
                </main>

                <Footer />
                <Chatbot />
            </div>
        // </OnboardingProvider>
    );
};

export default MainLayout;