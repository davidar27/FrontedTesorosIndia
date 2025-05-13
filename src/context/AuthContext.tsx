import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import authService from "@/services/auth/authService";
import { User , AuthContextType} from '@/types/auth/authTypes'

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'administrador';
    const isEntrepreneur = user?.role === 'emprendedor';
    const isClient = user?.role === 'cliente';

    // Verificar autenticación al iniciar
    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        const token = Cookies.get('auth_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authService.verifyToken(token);

            if (userData.isValid && userData.user) {
                setUser(userData.user);
            } else {
                await logout();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Login function
    const login = useCallback((token: string, userData: User) => {
        const cookieOptions = {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/'
        };

        Cookies.set('auth_token', token, cookieOptions);
        Cookies.set('user_role', userData.role, cookieOptions);
        setUser(userData);
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            Cookies.remove('auth_token');
            Cookies.remove('user_role');
            setUser(null);
        }
    }, []);

    // Actualizar datos de usuario
    const updateUser = useCallback((userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    }, []);

    // Verificar permisos
    const hasPermission = useCallback((permission: string) => {
        if (!user) return false;

        // Admins tienen todos los permisos
        if (isAdmin) return true;

        // Verificar permisos específicos
        return user.permissions?.includes(permission) || false;
    }, [user, isAdmin]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                role: user?.role || null,
                isAdmin,
                isEntrepreneur,
                isClient,
                login,
                logout,
                updateUser,
                hasPermission
            }}
        >
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