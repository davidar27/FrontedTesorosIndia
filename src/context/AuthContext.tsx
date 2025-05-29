/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthProvider con React Query - Fixed Version
import { createContext, ReactNode, useState, useCallback, useMemo, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '@/interfaces/user';
import { UserRole } from '@/interfaces/role';
import { AuthContextType } from '@/interfaces/authContextInterface';
import authService from "@/services/auth/authService";
import { PUBLIC_ROUTES } from '@/routes/publicRoutes';
import { Credentials } from '@/interfaces/formInterface';

export const AuthContext = createContext<AuthContextType>(null!);

const AUTH_QUERY_KEY = ['auth', 'user'];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        refetch: refetchAuth
    } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: async () => {
            const result = await authService.verifyToken();
            if (!result.isValid || !result.user) {
                throw new Error('No authenticated');
            }
            return result.user;
        },
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchInterval: 15 * 60 * 1000,
    });

    const loginMutation = useMutation<{ user: User; }, Error, Credentials>({
        mutationFn: async (credentials: Credentials) => {
            const result = await authService.login(credentials);
            return { user: result};
        },
        onSuccess: (result: { user: User; }) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, result.user);
            setError(null);
        },
        onError: (error: any) => {
            setError(error.message || 'Error de autenticación');
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.clear();
            setError(null);
            navigate("/");
        },
        onError: () => {
            queryClient.clear();
            setError(null);
            navigate("/");
        }
    });

    const { isAdmin, isEntrepreneur, isClient } = useMemo(() => ({
        isAdmin: user?.role === ('administrador' as UserRole),
        isEntrepreneur: user?.role === ('emprendedor' as UserRole),
        isClient: user?.role === ('cliente' as UserRole)
    }), [user?.role]);

    // ===== Funciones de autenticación =====

    const login = useCallback(async (credentials: Credentials): Promise<User> => {
        return new Promise((resolve, reject) => {
            loginMutation.mutate(credentials, {
                onSuccess: (result) => resolve(result.user),
                onError: reject
            });
        });
    }, [loginMutation]);

    const logout = useCallback(async (): Promise<void> => {
        return new Promise((resolve) => {
            logoutMutation.mutate(undefined, {
                onSettled: () => resolve()
            });
        });
    }, [logoutMutation]);

    const checkAuth = useCallback(async (): Promise<void> => {
        await refetchAuth();
    }, [refetchAuth]);

    const refreshAuth = useCallback(async (silent: boolean = false): Promise<boolean> => {
        try {
            const result = await refetchAuth();
            return !!result.data;
        } catch {
            if (!silent) {
                setError('Error al actualizar la sesión');
            }
            await logout();
            return false;
        }
    }, [refetchAuth, logout]);

    // ===== Funciones de gestión de usuario =====

    const updateUser = useCallback((updates: Partial<User>): void => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
        }
    }, [user, queryClient]);

    const setErrorCallback = useCallback((error: string | null): void => {
        setError(error);
    }, []);

    const isPublicRoute = useCallback((path: string): boolean => {
        return PUBLIC_ROUTES.includes(path);
    }, []);



    const value: AuthContextType = useMemo(() => ({
        user: user || null,
        isAuthenticated: !!user,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
        error,
        role: user?.role || null,
        isAdmin,
        isEntrepreneur,
        isClient,
        login,
        logout,
        updateUser,
        checkAuth,
        refreshAuth,
        setError: setErrorCallback,
        isPublicRoute
    }), [
        user,
        isLoading,
        loginMutation.isPending,
        logoutMutation.isPending,
        error,
        isAdmin,
        isEntrepreneur,
        isClient,
        login,
        logout,
        updateUser,
        checkAuth,
        refreshAuth,
        setErrorCallback,
        isPublicRoute
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}