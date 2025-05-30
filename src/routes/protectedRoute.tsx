import useAuth from '@/context/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles = [] }: { roles?: string[] }) => {
    const { isAuthenticated, user } = useAuth();


    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && user?.role && !roles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;