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

const AuthContext = createContext<AuthContextType>(null!);

const AUTH_QUERY_KEY = ['auth', 'user'];
const TOKEN_REFRESH_INTERVAL = 4.5 * 60 * 1000;
const TOKEN_REFRESH_SAFETY_MARGIN = 30 * 1000;

const defaultObserverUser: User = {
    id: '0',
    name: 'Observador',
    email: '',
    role: 'observador' as UserRole,
    isVerified: false
};

function AuthProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const isPublicRoute = useCallback((path: string): boolean => {
        if (PUBLIC_ROUTES.includes(path)) {
            return true;
        }

        return PUBLIC_ROUTES.some(route => {
            const pattern = route
                .replace(/:[^/]+/g, '[^/]+')
                .replace(/\//g, '\\/');

            const regex = new RegExp(`^${pattern}$`);
            return regex.test(path);
        });
    }, []);

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
                    return defaultObserverUser;
                }
                return result.user;
            } catch {
                return defaultObserverUser;
            }
        },
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnMount: false
    });

    useEffect(() => {
        const initializeAuth = async () => {
            await refetchAuth();
            setIsInitializing(false);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (!isInitializing && !isPublicRoute(location.pathname) && (user?.role === 'observador' || !user)) {
            navigate('/auth/iniciar-sesion', {
                replace: true,
                state: { from: location.pathname }
            });
        }
    }, [isInitializing, user, location.pathname]);

    const loginMutation = useMutation<{ user: User; }, Error, Credentials>({
        mutationFn: async (credentials: Credentials) => {
            const result = await authService.login(credentials);
            return { user: result };
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
            localStorage.removeItem('cart_items');
            localStorage.removeItem('lastTokenRefresh');
            setError(null);
            navigate("/");
            if (window.location.pathname === "/") {
                window.location.reload();
            }
        },
        onError: () => {
            queryClient.clear();
            localStorage.removeItem('cart_items');
            localStorage.removeItem('lastTokenRefresh');
            setError(null);
            navigate("/");
            if (window.location.pathname === "/") {
                window.location.reload();
            }
        }
    });

    const { isAdmin, isEntrepreneur, isClient, isObserver } = useMemo(() => ({
        isAdmin: user?.role === ('administrador' as UserRole),
        isEntrepreneur: user?.role === ('emprendedor' as UserRole),
        isClient: user?.role === ('cliente' as UserRole),
        isObserver: user?.role === ('observador' as UserRole)
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

    useEffect(() => {
        let refreshTimeout: NodeJS.Timeout;

        const scheduleTokenRefresh = () => {
            refreshTimeout = setTimeout(async () => {

                try {
                    const refreshedUser = await authService.refresh_token();
                    queryClient.setQueryData(AUTH_QUERY_KEY, refreshedUser);
                    scheduleTokenRefresh();
                } catch {
                    
                        const verifyResult = await authService.verifyToken();
                        if (verifyResult.isValid && verifyResult.user) {
                            queryClient.setQueryData(AUTH_QUERY_KEY, verifyResult.user);
                            scheduleTokenRefresh();
                            return;
                        }
                    if (!isPublicRoute(location.pathname)) {
                        await logout();
                    }
                }
            }, TOKEN_REFRESH_INTERVAL - TOKEN_REFRESH_SAFETY_MARGIN);
        };

        if (!isInitializing && user?.role !== 'observador' && !isPublicRoute(location.pathname)) {
            scheduleTokenRefresh();
        }

        return () => {
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
        };
    }, [isInitializing, user?.role, location.pathname, logout, isPublicRoute, queryClient]);

    const checkAuth = useCallback(async (): Promise<void> => {
        await refetchAuth();
    }, [refetchAuth]);

    const refreshAuth = useCallback(async (silent: boolean = false): Promise<boolean> => {
        try {
            const refreshedUser = await authService.refresh_token();
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

    const value: AuthContextType = useMemo(() => ({
        user: user || defaultObserverUser,
        isAuthenticated: !!user && user.role !== 'observador',
        isLoading: isLoading && !isPublicRoute(location.pathname),
        error,
        role: user?.role || 'observador',
        isAdmin,
        isEntrepreneur,
        isClient,
        isObserver,
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
        location.pathname,
        error,
        isAdmin,
        isEntrepreneur,
        isClient,
        isObserver,
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

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };
export default AuthContext;