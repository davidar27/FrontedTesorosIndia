import useAuth from '@/context/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { UserRole } from '@/interfaces/role';
import { farmsApi } from '@/services/admin/farms';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    roles?: UserRole[];
    requireAuth?: boolean;
    allowAdmin?: boolean;
}

const ProtectedRoute = ({ roles = [], requireAuth = true, allowAdmin = true }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();
    const [isPublicFarm, setIsPublicFarm] = useState(false);
    const [checkingFarmStatus, setCheckingFarmStatus] = useState(false);

    useEffect(() => {
        const checkFarmAccess = async () => {
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

    if (user?.role === 'administrador' && !allowAdmin && !location.pathname.startsWith('/dashboard')) {
        return <Navigate to="/dashboard" replace />;
    }

    if (isPublicFarm) {
        return <Outlet />;
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/iniciar-sesion" state={{ from: location.pathname }} replace />;
    }

    if (roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
        if (isAuthenticated) {
            return <Navigate to="/acceso-denegado" replace />;
        }
        return <Navigate to="/auth/iniciar-sesion" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;