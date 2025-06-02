import useAuth from '@/context/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { UserRole } from '@/interfaces/role';
import { farmsApi } from '@/services/admin/farms';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    roles?: UserRole[];
    requireAuth?: boolean;
}

const ProtectedRoute = ({ roles = [], requireAuth = true }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();
    const [isPublicFarm, setIsPublicFarm] = useState(false);
    const [checkingFarmStatus, setCheckingFarmStatus] = useState(false);

    useEffect(() => {
        const checkFarmAccess = async () => {
            // Solo verificar si es una ruta de finca específica
            if (location.pathname.startsWith('/fincas/')) {
                setCheckingFarmStatus(true);
                try {
                    const farmId = location.pathname.split('/')[2];
                    const farm = await farmsApi.public.getFarmById(Number(farmId));
                    setIsPublicFarm(farm.status === 'Publicada');
                } catch {
                    setIsPublicFarm(false);
                }
                setCheckingFarmStatus(false);
            }
        };

        checkFarmAccess();
    }, [location.pathname]);

    if (isLoading || checkingFarmStatus) {
        return <LoadingSpinner message="Verificando acceso..." />;
    }

    // Si es una finca publicada, permitir acceso
    if (isPublicFarm) {
        return <Outlet />;
    }

    // Si la ruta requiere autenticación y el usuario no está autenticado
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/iniciar-sesion" state={{ from: location.pathname }} replace />;
    }

    // Si hay roles específicos y el usuario no tiene el rol requerido
    if (roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
        // Si el usuario está autenticado pero no tiene permiso, ir a una página de acceso denegado
        if (isAuthenticated) {
            return <Navigate to="/acceso-denegado" replace />;
        }
        // Si el usuario no está autenticado, redirigir al login
        return <Navigate to="/auth/iniciar-sesion" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;