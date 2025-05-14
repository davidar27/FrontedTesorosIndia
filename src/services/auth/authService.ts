import { axiosInstance } from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import { Credentials } from '@/interfaces/formInterface';
import { ErrorResponse, AuthResponse } from '@/interfaces/responsesApi';
import { User } from '@/interfaces/user'

const authService = {
    login: async (credentials: Credentials): Promise<User> => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
            console.log(response.data.user);

            return response.data.user;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            throw new Error(
                axiosError.response?.data?.error || 'Error durante el inicio de sesión'
            );
        }
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout');
    },

    verifyToken: async (): Promise<{ isValid: boolean; user?: User }> => {
        try {
            const response = await axiosInstance.get('/auth/verificar-token');
            return {
                isValid: response.data.success,
                user: response.data.user
            };
        } catch (error) {
            console.error('Token verification failed:', error);
            return { isValid: false };
        }
    },

    refreshToken: async (): Promise<User> => {
        const response = await axiosInstance.post<AuthResponse>('/auth/refresh');
        return response.data.user;
    }
};

export default authService;
