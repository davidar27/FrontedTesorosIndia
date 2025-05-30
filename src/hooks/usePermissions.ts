import { useMemo } from 'react';
import useAuth from '@/context/useAuth';

export const usePermissions = () => {
    const { user, isAdmin } = useAuth();

    return useMemo(() => ({
        isAdmin: () => isAdmin,
        hasPermission: (permission: string): boolean => {
            if (isAdmin) return true;

            // Aquí puedes implementar tu lógica de permisos
            // Por ejemplo, si tienes permisos específicos por usuario:
            // return user?.permissions?.includes(permission) || false;

            // Lógica básica por rol:
            const [resource, action] = permission.split(':');

            switch (user?.role) {
                case 'emprendedor':
                    return ['entrepreneurs', 'products'].includes(resource) &&
                        ['read', 'create', 'edit'].includes(action);
                case 'cliente':
                    return resource === 'products' && action === 'read';
                default:
                    return false;
            }
        },
        canAccess: (route: string): boolean => {
            if (isAdmin) return true;

            // Definir rutas por rol
            const roleRoutes = {
                administrador: ['/admin', '/entrepreneurs', '/users', '/products'],
                emprendedor: ['/entrepreneur', '/products', '/profile'],
                cliente: ['/client', '/products', '/profile']
            };

            const allowedRoutes = roleRoutes[user?.role as keyof typeof roleRoutes] || [];
            return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
        }
    }), [user, isAdmin]);
};