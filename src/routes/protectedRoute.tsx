import useAuth from '@/context/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { UserRole } from '@/interfaces/role';

interface ProtectedRouteProps {
    roles?: UserRole[];
    requireAuth?: boolean;
    allowAdmin?: boolean;
}

const ProtectedRoute = ({ roles = [], requireAuth = true, allowAdmin = true }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner message="Verificando acceso..." />;
    }

    if (user?.role === 'administrador' && !allowAdmin && !location.pathname.startsWith('/dashboard')) {
        return <Navigate to="/dashboard" replace />;
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