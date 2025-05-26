import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import  authService  from '@/services/auth/authService';
import { User } from '@/interfaces/user';

export function useAuth() {
    const queryClient = useQueryClient();

    // LOGIN
    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (user: User) => {
            queryClient.setQueryData(['auth-user'], user);
        },
    });

    // LOGOUT
    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['auth-user'] });
        },
    });

    // REFRESH TOKEN
    const refreshMutation = useMutation({
        mutationFn: authService.refreshToken,
        onSuccess: (user: User) => {
            queryClient.setQueryData(['auth-user'], user);
        },
    });

    // VERIFY TOKEN (query que se puede ejecutar al cargar la app)
    const {
        data: sessionData,
        isLoading: isVerifying,
        isError: isVerifyError,
    } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const result = await authService.verifyToken();
            if (!result.isValid || !result.user) throw new Error('No autorizado');
            return result.user;
        },
        staleTime: 1000 * 60 * 5, // 5 min
        retry: false,
    });

    return {
        user: sessionData,
        isVerifying,
        isVerifyError,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending,
    };
}
