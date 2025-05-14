import { createContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/interfaces/user';
import { AuthContextType } from '@/interfaces/authContextInterface';
import authService from "@/services/auth/authService";
import { PUBLIC_ROUTES } from '@/routes/publicRoutes';


export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isAdmin, isEntrepreneur, isClient } = useMemo(() => ({
        isAdmin: user?.role === 'administrador',
        isEntrepreneur: user?.role === 'emprendedor',
        isClient: user?.role === 'cliente'
    }), [user?.role]);

    // ===== Funciones de mantenimiento de sesión =====

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            setUser(null);
            setError(null);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const { isValid, user: userData } = await authService.verifyToken();

            if (isValid && userData) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAuth = useCallback(async (silent: boolean = false) => {
        if (!silent) {
            setIsLoading(true);
        }

        try {
            const { isValid, user: userData } = await authService.verifyToken();

            if (!isValid || !userData) {
                await logout();
                return false;
            }

            setUser(userData);
            return true;
        } catch (error) {
            if (!silent) {
                setError('Error al actualizar la sesión');
            }
            console.error('Error refreshing auth:', error);
            await logout();
            return false;
        } finally {
            if (!silent) {
                setIsLoading(false);
            }
        }
    }, [logout]);

    useEffect(() => {
        const verifySession = async () => {
            await checkAuth();

            const interval = setInterval(checkAuth, 5 * 60 * 1000);
            return () => clearInterval(interval);
        };

        verifySession();
    }, [checkAuth]);

    // ===== Funciones de autenticación principal =====

    const login = useCallback(async (credentials: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
        } catch (err) {
            setError('Credenciales incorrectas');
            console.error('Login failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);


    // ===== Funciones de gestión de usuario =====

    const updateUser = useCallback((updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...updates };
        });
    }, []);

    const hasPermission = useCallback((permission: string) => {
        if (!user) return false;
        if (isAdmin) return true;
        return user.permissions?.includes(permission) ?? false;
    }, [user, isAdmin]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        role: user?.role || null,
        isAdmin,
        isEntrepreneur,
        isClient,
        login,
        logout,
        updateUser,
        hasPermission,
        checkAuth,
        refreshAuth,
        setError,
        isPublicRoute: (path: string) => {
            const publicRoutes = PUBLIC_ROUTES;
            return publicRoutes.includes(path);
        }
    }), [
        user,
        isLoading,
        error,
        isAdmin,
        isEntrepreneur,
        isClient,
        login,
        logout,
        updateUser,
        hasPermission,
        checkAuth,
        refreshAuth,
        setError
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

