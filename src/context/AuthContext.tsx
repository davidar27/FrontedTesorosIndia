/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@/interfaces/user';
import { UserRole } from '@/interfaces/role';
import { AuthContextType } from '@/interfaces/authContextInterface';
import authService from "@/services/auth/authService";
import { PUBLIC_ROUTES } from '@/routes/publicRoutes';
import { Credentials } from '@/interfaces/formInterface';

export const AuthContext = createContext<AuthContextType>(null!);

const AUTH_QUERY_KEY = ['auth', 'user'];
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; 

export function AuthProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        refetch: refetchAuth
    } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: async () => {
            try {
                const result = await authService.verifyToken();
                if (!result.isValid || !result.user) {
                    throw new Error('No authenticated');
                }
                return result.user;
            } catch (error) {
                if (!isPublicRoute(location.pathname)) {
                    navigate('/login', { 
                        replace: true,
                        state: { from: location.pathname }
                    });
                }
                throw error;
            }
        },
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: true,
        refetchInterval: TOKEN_REFRESH_INTERVAL,
        refetchOnMount: true,
    });

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refetchAuth();
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        let refreshTimeout: NodeJS.Timeout;

        const scheduleTokenRefresh = () => {
            refreshTimeout = setTimeout(async () => {
                try {
                    const refreshedUser = await authService.refreshToken();
                    queryClient.setQueryData(AUTH_QUERY_KEY, refreshedUser);
                    scheduleTokenRefresh(); // Programa el siguiente refresh
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    if (!isPublicRoute(location.pathname)) {
                        await logout();
                    }
                }
            }, TOKEN_REFRESH_INTERVAL);
        };

        if (user?.token) {
            scheduleTokenRefresh();
        }

        return () => {
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
        };
    }, [user?.token, location.pathname]);

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
            const refreshedUser = await authService.refreshToken();
            queryClient.setQueryData(AUTH_QUERY_KEY, refreshedUser);
            return true;
        } catch {
            if (!silent) {
                setError('Error al actualizar la sesión');
            }
            if (!isPublicRoute(location.pathname)) {
                await logout();
            }
            return false;
        }
    }, [queryClient, logout, location.pathname]);

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
        isLoading: isLoading || isInitializing || loginMutation.isPending || logoutMutation.isPending,
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
        isInitializing,
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

    if (isInitializing) {
        return null;
    }

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