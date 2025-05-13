/**
 * Roles de usuario disponibles en el sistema
 */
export type UserRole = 'administrador' | 'emprendedor' | 'cliente';

/**
 * Datos básicos del usuario
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone_number?: string;

    // Campos específicos por rol
    businessName?: string;    // Para emprendedores
    address?: string;        // Para clientes
    permissions?: string[];  // Para administradores
}

/**
 * Estructura de respuesta para operaciones de autenticación
 */
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
    };
    expiresIn?: number; 
}

/**
 * Datos requeridos para el formulario de login
 */
export interface LoginFormData {
    email: string;
    password: string;
}

/**
 * Estructura para errores de autenticación
 */
export interface AuthError {
    error: string;
    details?: Record<string, string>;
}

/**
 * Propiedades del contexto de autenticación
 */
export interface AuthContextType {
    // Estado actual
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Helpers de roles
    role: UserRole | null;
    isAdmin: boolean;
    isEntrepreneur: boolean;
    isClient: boolean;

    // Métodos
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    hasPermission: (permission: string) => boolean;
}

/**
 * Datos requeridos para el formulario de registro
 */
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    phone_number?: string;
    role?: UserRole; 
}

/**
 * Datos para recuperación de contraseña
 */
export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Payload para tokens JWT
 */
export interface TokenPayload {
    userId: string;
    role?: UserRole;
    purpose?: 'email_verification' | 'password_reset';
}