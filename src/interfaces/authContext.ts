import { UserRole } from '@/interfaces/role';
import { User } from '@/interfaces/user'
export interface AuthContextType {
    // Estado
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Helpers
    role: UserRole | null;
    isAdmin: boolean;
    isEntrepreneur: boolean;
    isClient: boolean;

    // Métodos
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    hasPermission: (permission: string) => boolean;
    checkAuth: () => Promise<void>;
    refreshAuth: () => Promise<boolean>; // Asegúrate que coincida
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}