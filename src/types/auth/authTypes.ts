export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    expiresIn?: number;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface AuthError {
    error: string;
    details?: Record<string, string>;
}
type UserRole = 'ADMIN' | 'ENTREPRENEUR' | 'CLIENT';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    // Datos específicos por rol
    businessName?: string;    // Para emprendedores
    phoneNumber?: string;     // Para clientes
    permissions?: string[];   // Para administradores
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: UserRole | null;
    isAdmin: boolean;
    isEntrepreneur: boolean;
    isClient: boolean;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    hasPermission: (permission: string) => boolean;
}
