import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import useAuth from '@/context/useAuth';

// Hook personalizado que solo ejecuta queries si el usuario está autenticado
export const useAuthenticatedQuery = <TData = unknown, TError = unknown>(
    options: UseQueryOptions<TData, TError> & { requireAuth?: boolean }
) => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { requireAuth = true, ...queryOptions } = options;

    return useQuery({
        ...queryOptions,
        enabled: requireAuth ? isAuthenticated && !authLoading && (queryOptions.enabled ?? true) : (queryOptions.enabled ?? true)
    });
};