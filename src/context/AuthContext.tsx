import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/interfaces/user';
import { AuthContextType } from '@/interfaces/authContext';
import authService from "@/services/auth/authService";


const AuthContext = createContext<AuthContextType>(null!);

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
            const { isValid, user } = await authService.verifyToken();
            if (isValid && user) {
                setUser(user);
            } else {
                await logout();
            }
        } catch {
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

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

    // Initialize auth state
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            await checkAuth();

            // Set up periodic token verification (every 5 minutes)
            if (isMounted) {
                const interval = setInterval(checkAuth, 5 * 60 * 1000);
                return () => clearInterval(interval);
            }
        };

        initializeAuth();

        return () => {
            isMounted = false;
        };
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
        setError
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};