import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedMutationOptions<TData, TError, TVariables> extends UseMutationOptions<TData, TError, TVariables> {
    requiredPermission?: string;
    onUnauthorized?: () => void;
}

export const useProtectedMutation = <TData = unknown, TError = unknown, TVariables = void>(
    options: ProtectedMutationOptions<TData, TError, TVariables>
) => {
    const { isAuthenticated } = useAuth();
    const { hasPermission } = usePermissions();
    const { requiredPermission, onUnauthorized, ...mutationOptions } = options;

    return useMutation<TData, TError, TVariables>({
        ...mutationOptions,
        mutationFn: async (variables: TVariables): Promise<TData> => {
            if (!isAuthenticated) {
                throw new Error('Usuario no autenticado');
            }

            if (requiredPermission && !hasPermission(requiredPermission)) {
                if (onUnauthorized) {
                    onUnauthorized();
                } else {
                    throw new Error('No tienes permisos para realizar esta acción');
                }
            }

            return mutationOptions.mutationFn!(variables);
        }
    });
};