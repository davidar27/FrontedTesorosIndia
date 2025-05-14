import { useAuth } from "@/context/useAuth";
export const useRoles = () => {
    const { user } = useAuth();

    return {
        isAdmin: user?.role === 'administrador',
        isEntrepreneur: user?.role === 'emprendedor',
        isClient: user?.role === 'cliente',
        currentRole: user?.role
    };
};