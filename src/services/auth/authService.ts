import { axiosInstance } from '@/api/axiosInstance';
import { AuthResponse } from '@/interfaces/responsesApi';
import { User } from '@/interfaces/user';
import { AuthError } from '@/interfaces/responsesApi';


const authService = {
    async login(credentials: { email: string; password: string }): Promise<User> {
        try {
            const response = await axiosInstance.post<{
                user?: User;
                error: { type: 'email' | 'password' | 'general'; message: string; redirectTo?: string };
            }>('/auth/login', credentials);
            if (response.data.error) {
                throw new AuthError(response.data.error.message, {
                    redirectTo: response.data.error.redirectTo,
                    errorType: response.data.error.type
                });
            }
            if (!response.data.user) {
                throw new AuthError('Error desconocido al iniciar sesión', { errorType: 'general' });
            }
            return response.data.user;
        } catch (error: unknown) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Error inesperado al iniciar sesión', { errorType: 'general' });
        }

    },

    async logout(): Promise<void> {
        try {
            await axiosInstance.post('/auth/logout');
        } catch {
            throw new AuthError('Error al cerrar sesión', { errorType: 'general' });
        }
    },

    async verifyToken(): Promise<{ isValid: boolean; user?: User }> {
        try {
            const res = await axiosInstance.get('/auth/verificar-token');
            return { isValid: res.data.success, user: res.data.user };
        } catch {
            return { isValid: false };
        }
    },

    async refreshToken(): Promise<User> {
        try {
            const res = await axiosInstance.post<AuthResponse>('/auth/refresh');
            if (!res.data.user) throw new AuthError('No se recibió el usuario', { errorType: 'general' });
            return res.data.user;
        } catch {
            throw new AuthError('La sesión ha expirado', { errorType: 'general' });
        }
    }
};

export default authService;
