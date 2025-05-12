/* import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';

export const ProtectedRoute = ({
    children,
    allowedRoles
}: {
    children: JSX.Element,
    allowedRoles: UserRole[]
}) => {
    const { user, isLoading } = useAuth();

    // if (isLoading) return <LoadingSpinner />;

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Uso:
<ProtectedRoute allowedRoles={['administrador', 'emprendedor']}>
    <Home/>
</ProtectedRoute> */