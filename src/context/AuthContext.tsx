import { createContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/interfaces/user';
import { AuthContextType } from '@/interfaces/authContextInterface';
import authService from "@/services/auth/authService";
import { PUBLIC_ROUTES } from '@/routes/publicRoutes';
import { Credentials } from '@/interfaces/formInterface';

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

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } catch {
            // 
        } finally {
            setUser(null);
            setError(null);
        }
    }, []);

    const checkAuth = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const { isValid, user: userData } = await authService.verifyToken();
            if (isValid && userData) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAuth = useCallback(async (silent: boolean = false): Promise<boolean> => {
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
        } catch {
            if (!silent) {
                setError('Error al actualizar la sesión');
            }
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

    const login = useCallback(async (credentials: Credentials): Promise<User> => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
            return userData; 
        } catch (err) {
            setError('Credenciales incorrectas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ===== Funciones de gestión de usuario =====

    const updateUser = useCallback((updates: Partial<User>): void => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...updates };
        });
    }, []);

    const setErrorCallback = useCallback((error: string | null): void => {
        setError(error);
    }, []);

    const isPublicRoute = useCallback((path: string): boolean => {
        const publicRoutes = PUBLIC_ROUTES;
        return publicRoutes.includes(path);
    }, []);

    const value: AuthContextType = useMemo(() => ({
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
        checkAuth,
        refreshAuth,
        setError: setErrorCallback,
        isPublicRoute
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