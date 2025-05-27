import React from 'react';
import { usePageSetup } from '@/hooks/usePageSetup';

export const PageWrapper: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ title, description, children }) => {
    // Configurar la información de la página
    usePageSetup({ title, description });

    return (
        <div className="animate-fade-in-up">
            {children}
        </div>
    );
};