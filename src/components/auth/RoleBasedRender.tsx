/* import React from 'react';
import { useAuth } from '@/context/AuthContext';
import  UserRole  from '@/types/auth/authTypes'; 

interface RoleBasedRenderProps {
    administrador: React.ReactNode;
    emprendedor: React.ReactNode;
    cliente: React.ReactNode;
    loadingComponent?: React.ReactNode;
    unauthorizedComponent?: React.ReactNode;
}

const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
    administrador,
    emprendedor,
    cliente,
    loadingComponent = null,
    unauthorizedComponent = null,
}) => {
    const { role, isLoading } = useAuth();

    // Mostrar componente de carga mientras se verifica la autenticación
    if (isLoading) {
        return <>{loadingComponent}</>;
    }

    // Renderizar contenido basado en el rol
    switch (role) {
        case 'administrador':
            return <>{administrador}</>;
        case 'emprendedor':
            return <>{emprendedor}</>;
        case 'cliente':
            return <>{cliente}</>;
        default:
            return <>{unauthorizedComponent}</>;
    }
};

export default RoleBasedRender; */