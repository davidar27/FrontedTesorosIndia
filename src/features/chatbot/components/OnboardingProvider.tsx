import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import OnboardingMessage from './OnboardingMessage';
import { OnboardingAction } from '../interfaces/OnboardingInterfaces';

interface OnboardingProviderProps {
    children?: React.ReactNode;
}

const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
    const {
        messages,
        isActive,
        handleMessageAction,
        closeMessage
    } = useOnboarding();

    // No renderizar nada si no hay mensajes activos
    if (!isActive || messages.length === 0) {
        return <>{children}</>;
    }

    return (
        <>
            {children}

            {/* Renderizar mensajes de onboarding */}
            {messages.map((message, index) => (
                <OnboardingMessage
                    key={message.id}
                    message={message}
                    onAction={(action: OnboardingAction) => {
                        handleMessageAction(action);
                        closeMessage(message.id);
                    }}
                    onClose={() => closeMessage(message.id)}
                    position={index === 0 ? 'bottom-right' : 'top-right'}
                />
            ))}
        </>
    );
};

export default OnboardingProvider; 