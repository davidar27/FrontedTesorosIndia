import useAuth from '@/context/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { UserRole } from '@/interfaces/role';
import { useEffect, useState } from 'react';
import { ExperiencesApi } from '@/services/home/experiences';

interface ProtectedRouteProps {
    roles?: UserRole[];
    requireAuth?: boolean;
    allowAdmin?: boolean;
}

const ProtectedRoute = ({ roles = [], requireAuth = true, allowAdmin = true }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();
    const [isPublicExperience, setIsPublicExperience] = useState(false);
    const [checkingExperiencestatus, setCheckingExperiencestatus] = useState(false);

    useEffect(() => {
        const checkExperienceAccess = async () => {
            if (location.pathname.startsWith('/experiencias/')) {
                setCheckingExperiencestatus(true);
                try {
                    const experienceId = location.pathname.split('/')[2];
                    const Experience = await ExperiencesApi.getExperienceById(Number(experienceId));
                    setIsPublicExperience(Experience.status === 'published');
                } catch {
                    setIsPublicExperience(false);
                }
                setCheckingExperiencestatus(false);
            }
        };

        checkExperienceAccess();
    }, [location.pathname]);

    if (isLoading || checkingExperiencestatus) {
        return <LoadingSpinner message="Verificando acceso..." />;
    }

    if (user?.role === 'administrador' && !allowAdmin && !location.pathname.startsWith('/dashboard')) {
        return <Navigate to="/dashboard" replace />;
    }

    if (isPublicExperience) {
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